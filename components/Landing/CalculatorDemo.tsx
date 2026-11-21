'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import ProbabilityChart from './ProbabilityChart';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { CraftingMode, SelectedOre, Ore } from '@/types';
import { calculateForgingStats, validateOreSelection, getMaterialName } from '@/lib/calculator';
import { ALL_ORES, traitForMode } from '@/lib/ores';
import { RefreshCw, Zap, Share2, Check, Minus, Plus, Sword, Shield, AlertCircle } from 'lucide-react';

const WORLD_GROUPS = {
    'W1/W2': ["Stonewake's Cross", 'Forgotten Kingdom', 'Goblin Cave', 'Enemy Drop'],
    W3: ['Frostspire Expanse', 'The Peak', 'Raven Cave', 'Boss Drop'],
    W4: ['Bamboo Forest', 'Holy Tree', 'Tower of Hell', 'Void Cave']
};
const WORLD_FILTERS = ['All', 'W1/W2', 'W3', 'W4'] as const;

const ORE_BY_SLUG = new Map<string, Ore>(ALL_ORES.map((o) => [o.slug, o]));

type WorldFilter = typeof WORLD_FILTERS[number];

function encodeOresParam(selection: SelectedOre[]): string {
    const bySlug = new Map<string, number>();

    for (const item of selection) {
        const slug = item.ore.slug;
        const qty = Math.max(0, Math.floor(item.quantity));
        if (!slug || qty <= 0) continue;

        bySlug.set(slug, (bySlug.get(slug) || 0) + qty);
    }

    return [...bySlug.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slug, qty]) => `${encodeURIComponent(slug)}:${qty}`)
        .join(',');
}

function parseOresParam(oresParam: string | null): Array<{ slug: string; qty: number }> {
    if (!oresParam) return [];

    return oresParam
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((part) => {
            const [rawSlug, rawQty] = part.split(':');
            const slug = decodeURIComponent(rawSlug || '').trim();

            // Backwards compatible: "slug" means quantity 1
            const qtyParsed = rawQty === undefined ? 1 : parseInt(rawQty, 10);
            const qty = Number.isFinite(qtyParsed) && qtyParsed > 0 ? qtyParsed : 1;

            return { slug, qty };
        });
}

function trimSelectionToMaxTotal(selection: SelectedOre[], maxTotal: number): SelectedOre[] {
    const next = selection
        .map((s) => ({ ...s, quantity: Math.floor(s.quantity) }))
        .filter((s) => s.quantity > 0);

    let total = next.reduce((sum, s) => sum + s.quantity, 0);
    if (total <= maxTotal) return next;

    let overflow = total - maxTotal;

    for (let i = next.length - 1; i >= 0 && overflow > 0; i--) {
        const reduceBy = Math.min(overflow, next[i].quantity);
        next[i].quantity -= reduceBy;
        overflow -= reduceBy;

        if (next[i].quantity <= 0) {
            next.splice(i, 1);
        }
    }

    return next;
}

async function safeCopyToClipboard(text: string): Promise<boolean> {
    // Prefer the modern async clipboard API when available.
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // Fall through to legacy copy.
    }

    // Legacy fallback (works in more browsers/permission configs).
    try {
        if (typeof document === 'undefined') return false;

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch {
        return false;
    }
}

// Main calculator component with URL sync + shareable recipes
const CalculatorDemoInner: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasInitializedFromUrl = useRef(false);
    const skipNextUrlSync = useRef(false);

    // State
    const [selectedOres, setSelectedOres] = useState<SelectedOre[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const [activeWorld, setActiveWorld] = useState<WorldFilter>('All');
    const [craftingMode, setCraftingMode] = useState<CraftingMode>('weapon');
    const [searchTerm, setSearchTerm] = useState('');

    const maxOres = craftingMode === 'weapon' ? 51 : 45;

    // Initialize from URL (?mode=weapon|armor&ores=slug:qty,slug:qty)
    useEffect(() => {
        if (hasInitializedFromUrl.current) return;

        try {
            const modeParam = searchParams.get('mode');
            const initialMode: CraftingMode = modeParam === 'armor' ? 'armor' : 'weapon';
            setCraftingMode(initialMode);

            const parsed = parseOresParam(searchParams.get('ores'));
            if (parsed.length > 0) {
                const selection: SelectedOre[] = [];

                for (const { slug, qty } of parsed) {
                    const ore = ORE_BY_SLUG.get(slug);
                    if (!ore) continue;

                    const existing = selection.find((s) => s.ore.slug === ore.slug);
                    if (existing) {
                        existing.quantity += qty;
                    } else if (selection.length < 4) {
                        selection.push({ ore, quantity: qty });
                    }
                }

                const clamped = trimSelectionToMaxTotal(selection, initialMode === 'weapon' ? 51 : 45);
                setSelectedOres(clamped);
            }
        } catch (err) {
            console.error('Failed to initialize from URL:', err);
        }

        hasInitializedFromUrl.current = true;
        skipNextUrlSync.current = true;
    }, [searchParams]);

    // Clamp selection when switching crafting mode (weapon max 51, armor max 45)
    useEffect(() => {
        setSelectedOres((prev) => {
            const total = prev.reduce((sum, s) => sum + s.quantity, 0);
            if (total <= maxOres) return prev;
            return trimSelectionToMaxTotal(prev, maxOres);
        });
    }, [maxOres]);

    // Keep URL in sync for shareable recipes
    useEffect(() => {
        if (!hasInitializedFromUrl.current) return;
        if (skipNextUrlSync.current) {
            skipNextUrlSync.current = false;
            return;
        }

        try {
            const desiredMode = craftingMode;
            const desiredOres = encodeOresParam(selectedOres);

            const currentMode = searchParams.get('mode') || 'weapon';
            const currentOres = searchParams.get('ores') || '';

            if (currentMode === desiredMode && currentOres === desiredOres) {
                return;
            }

            const params = new URLSearchParams(searchParams.toString());
            params.set('mode', desiredMode);
            if (desiredOres) params.set('ores', desiredOres);
            else params.delete('ores');

            const href = `/?${params.toString()}${window.location.hash}`;
            router.replace(href, { scroll: false });
        } catch (err) {
            console.error('Failed to sync URL:', err);
        }
    }, [craftingMode, selectedOres, router, searchParams]);

    // Filter ores by world and search
    const filteredOres = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return ALL_ORES
            .filter((ore) => activeWorld === 'All' || WORLD_GROUPS[activeWorld].includes(ore.location))
            .filter(
                (ore) =>
                    query === '' ||
                    ore.name.toLowerCase().includes(query) ||
                    ore.rarity.toLowerCase().includes(query)
            );
    }, [activeWorld, searchTerm]);

    const stats = useMemo(() => calculateForgingStats(selectedOres, craftingMode), [selectedOres, craftingMode]);
    const validationError = useMemo(
        () => validateOreSelection(selectedOres, craftingMode),
        [selectedOres, craftingMode]
    );
    const materialName = useMemo(() => getMaterialName(selectedOres), [selectedOres]);

    // Handlers
    const addOre = (ore: Ore) => {
        // Enforce total ore cap for the current crafting mode
        if (totalOres >= maxOres) return;

        const existing = selectedOres.find((s) => s.ore.slug === ore.slug);
        if (existing) {
            setSelectedOres(
                selectedOres.map((s) =>
                    s.ore.slug === ore.slug ? { ...s, quantity: s.quantity + 1 } : s
                )
            );
            return;
        }

        // Add new ore (max 4 types)
        if (selectedOres.length < 4) {
            setSelectedOres([...selectedOres, { ore, quantity: 1 }]);
        }
    };

    const removeOre = (slug: string) => {
        const existing = selectedOres.find(s => s.ore.slug === slug);
        if (existing && existing.quantity > 1) {
            setSelectedOres(selectedOres.map(s => 
                s.ore.slug === slug 
                    ? { ...s, quantity: s.quantity - 1 }
                    : s
            ));
        } else {
            setSelectedOres(selectedOres.filter(s => s.ore.slug !== slug));
        }
    };

    const setOreQuantity = (slug: string, qty: number) => {
        const safeQty = Math.max(0, Math.floor(qty));
        const existing = selectedOres.find((s) => s.ore.slug === slug);
        if (!existing) return;

        // Clamp so the total never exceeds the max for the current mode
        const otherTotal = totalOres - existing.quantity;
        const allowedForThisOre = Math.max(0, maxOres - otherTotal);
        const clampedQty = Math.min(safeQty, allowedForThisOre);

        if (clampedQty <= 0) {
            setSelectedOres(selectedOres.filter((s) => s.ore.slug !== slug));
            return;
        }

        setSelectedOres(
            selectedOres.map((s) => (s.ore.slug === slug ? { ...s, quantity: clampedQty } : s))
        );
    };

    const handleShare = async () => {
        try {
            const oresParam = encodeOresParam(selectedOres);
            const shareUrl = new URL(window.location.origin);
            shareUrl.searchParams.set('mode', craftingMode);
            if (oresParam) shareUrl.searchParams.set('ores', oresParam);
            shareUrl.hash = 'calculator';

            const oreText = selectedOres.length
                ? selectedOres.map((s) => `${s.ore.name} x${s.quantity}`).join(', ')
                : 'None';

            let topLine: string | null = null;
            if (craftingMode === 'weapon') {
                const top = stats.weaponProbabilities?.[0];
                if (top) topLine = `Estimated top category: ${top.category} ${top.chance}%`;
            } else {
                const top = stats.armorProbabilities?.[0];
                if (top) topLine = `Estimated top category: ${top.class} ${top.chance}%`;
            }

            const traitText = stats.activeTraits?.length
                ? stats.activeTraits.map((t) => `${t.sourceOre} (${Number(t.mixPercent.toFixed(1))}% of mix): ${t.trait}`).join(', ')
                : 'None';

            const modeLabel = craftingMode === 'weapon' ? 'Weapon' : 'Armor';
            const text = [
                `ForgeCalc — The Forge ${modeLabel} Recipe`,
                `Ores (${totalOres}/${maxOres}): ${oreText}`,
                topLine,
                `Multiplier: ${stats.totalMultiplier.toFixed(2)}x`,
                `Traits: ${traitText}`,
                shareUrl.toString(),
            ]
                .filter(Boolean)
                .join('\n');

            // Clipboard can be blocked by browser permissions/policies. Never throw here.
            const copied =
                (await safeCopyToClipboard(text)) ||
                (await safeCopyToClipboard(shareUrl.toString()));

            if (!copied) {
                // Last resort: show the URL so users can copy manually.
                window.prompt('Copy this link:', shareUrl.toString());
            }

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    const totalOres = stats.totalOreCount;
    const canAddMore = selectedOres.length < 4 && totalOres < maxOres;

    // Chart data - safely handle empty arrays
    const probabilityData = craftingMode === 'weapon' 
        ? (stats.weaponProbabilities || []).map(p => ({ name: p.category, prob: p.chance, color: p.color }))
        : (stats.armorProbabilities || []).map(p => ({ name: p.class, prob: p.chance, color: p.color }));

    return (
        <div className="w-full max-w-6xl mx-auto my-12">
            <div className="grid items-stretch gap-6 lg:grid-cols-2">
                {/* Left: Input Selection */}
                <div className="flex min-w-0 flex-col gap-4">
                    {/* Mode Toggle */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                            <button
                                aria-pressed={craftingMode === 'weapon'}
                                onClick={() => setCraftingMode('weapon')}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    craftingMode === 'weapon' 
                                        ? 'bg-accent-blue text-white' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Sword className="w-4 h-4" /> Weapon
                            </button>
                            <button
                                aria-pressed={craftingMode === 'armor'}
                                onClick={() => setCraftingMode('armor')}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    craftingMode === 'armor' 
                                        ? 'bg-accent-blue text-white' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Shield className="w-4 h-4" /> Armor
                            </button>
                        </div>

                        {/* World Toggle */}
                        <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                            {WORLD_FILTERS.map(world => (
                                <button
                                    key={world}
                                    aria-pressed={activeWorld === world}
                                    onClick={() => setActiveWorld(world)}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                        activeWorld === world 
                                            ? 'bg-accent-indigo text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {world}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <span className="w-1 h-5 bg-accent-blue rounded-full"></span>
                            Material Selection
                        </h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                disabled={totalOres < 3}
                                className="text-xs flex items-center gap-1.5 text-accent-blue disabled:opacity-40 hover:text-accent-blue/80 transition-colors"
                                title="Copy share text + link"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                                {isCopied ? 'COPIED' : 'SHARE'}
                            </button>
                            <span className="text-xs text-gray-500 font-mono">
                                {totalOres}/{maxOres} ORES • {selectedOres.length}/4 TYPES
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        aria-label="Search ores"
                        placeholder={activeWorld === 'All' ? 'Search all ores...' : `Search ${activeWorld} ores...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-accent-blue outline-none"
                    />

                    {/* Selected Ores */}
                    {selectedOres.length > 0 && (
                        <div className="p-4 bg-surface border border-white/10 rounded-lg space-y-2">
                            <div className="text-xs text-gray-500 font-mono mb-2">SELECTED MATERIALS</div>
                            {selectedOres.map(({ ore, quantity }) => (
                                <div key={ore.slug} className="flex items-center justify-between gap-2 p-2 bg-black/40 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ore.color }}></div>
                                        <span className="text-sm text-white">{ore.name}</span>
                                        <span className="text-xs text-gray-500">({ore.multiplier}x)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            aria-label={`Remove one ${ore.name}`}
                                            onClick={() => removeOre(ore.slug)}
                                            className="p-1 hover:bg-white/10 rounded"
                                        >
                                            <Minus className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <input
                                            aria-label={`${ore.name} quantity`}
                                            type="number"
                                            min="1"
                                            max={maxOres}
                                            value={quantity}
                                            onChange={(e) => setOreQuantity(ore.slug, parseInt(e.target.value) || 0)}
                                            className="w-14 bg-surface border border-white/10 rounded px-2 py-1 text-sm text-center"
                                        />
                                        <button 
                                            aria-label={`Add one ${ore.name}`}
                                            onClick={() => addOre(ore)}
                                            className="p-1 hover:bg-white/10 rounded"
                                            disabled={totalOres >= maxOres}
                                        >
                                            <Plus className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Validation Error */}
                    {validationError && (
                        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
                            <AlertCircle className="w-4 h-4" />
                            {validationError}
                        </div>
                    )}

                    {/* Ore Grid */}
                    <div className="grid max-h-[400px] grid-cols-2 content-start gap-2 overflow-y-auto pr-2 md:grid-cols-3 lg:h-[400px] lg:max-h-none lg:grow">
                        {filteredOres.length === 0 && <p className="col-span-full p-3 text-sm text-gray-400">No matching ores in this filter.</p>}
                        {filteredOres.map((ore) => {
                            const selected = selectedOres.find((s) => s.ore.slug === ore.slug);
                            const isSelected = !!selected;
                            const trait = traitForMode(ore, craftingMode);
                            const isDisabled = (!canAddMore && !isSelected) || (totalOres >= maxOres && isSelected);

                            return (
                                <button
                                    key={ore.slug}
                                    onClick={() => addOre(ore)}
                                    disabled={isDisabled}
                                    className={`
                                        relative p-3 rounded-lg border text-left transition-all duration-200 group
                                        ${isSelected
                                            ? 'bg-accent-blue/10 border-accent-blue/50 text-white'
                                            : 'bg-surface border-white/5 text-gray-400 hover:border-white/20 hover:bg-surface-highlight'}
                                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                                            {selected.quantity}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ore.color }}></div>
                                        <span className="text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                                            {ore.multiplier}x
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium">{ore.name}</div>
                                    <div className="text-[10px] uppercase tracking-wider mt-1 opacity-60">{ore.rarity}</div>
                                    {trait && (
                                        <div className="text-[9px] text-accent-blue mt-1 truncate" title={trait}>
                                            ★ {craftingMode === 'weapon' ? 'Weapon' : 'Armor'} trait
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Output / Dashboard */}
                <Card className="flex min-w-0 flex-col bg-[#0B0C0E]" glow>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-surface/50 px-5 py-4 sm:px-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-100">
                            <Zap className="w-4 h-4 text-warning" />
                            {craftingMode === 'weapon' ? 'Weapon' : 'Armor'} simulation
                        </h3>
                        <Badge variant={totalOres >= 3 ? "success" : "neutral"} pulsing={totalOres >= 3}>
                            {totalOres >= 3 ? "READY" : "IDLE"}
                        </Badge>
                    </div>

                    <div className="flex flex-1 flex-col gap-5 p-5 sm:gap-6 sm:p-6 lg:justify-evenly">
                        {/* Material Name */}
                        {totalOres >= 3 && (
                            <div className="rounded-lg border border-white/5 bg-black/40 px-4 py-4 text-center">
                                <div className="mb-1 text-sm text-gray-400">Material name</div>
                                <div className="break-words text-xl font-semibold leading-7 text-white">{materialName} {craftingMode === 'weapon' ? 'Weapon' : 'Armor'}</div>
                            </div>
                        )}

                        {/* KPI Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-white/5 bg-black/40 px-4 py-4">
                                <div className="mb-1 text-sm text-gray-400">Multiplier</div>
                                <div className="text-2xl font-semibold leading-8 text-white tabular-nums">
                                    {totalOres >= 3 ? `${stats.totalMultiplier.toFixed(2)}x` : '—'}
                                </div>
                            </div>
                            <div className="rounded-lg border border-white/5 bg-black/40 px-4 py-4">
                                <div className="mb-1 text-sm text-gray-400">Total ores</div>
                                <div className="text-2xl font-semibold leading-8 text-white tabular-nums">
                                    {totalOres}
                                </div>
                            </div>
                        </div>

                        {probabilityData.length > 0 && (
                            <ProbabilityChart
                                data={probabilityData}
                                title={craftingMode === 'weapon' ? 'Estimated weapon type chances' : 'Estimated armor class chances'}
                            />
                        )}

                        {/* Traits Analysis */}
                        <div className="space-y-3">
                            <h4 className="text-base font-semibold text-gray-100">Active traits</h4>

                            {(stats?.activeTraits?.length ?? 0) > 0 ? (
                                (stats?.activeTraits ?? []).map((t) => (
                                    <div key={t.sourceOre} className="rounded-lg border border-white/5 bg-black/40 px-4 py-3">
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                            <span className="text-base font-semibold text-white">{t.sourceOre}</span>
                                            <span className="whitespace-nowrap text-sm font-medium text-blue-300 tabular-nums">{Number(t.mixPercent.toFixed(1))}% of mix</span>
                                        </div>
                                        <div className="mt-1 text-sm leading-[21px] text-gray-300">
                                            {t.trait}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-white/5 bg-black/40 px-4 py-3 text-sm leading-[21px] text-gray-400">
                                    {totalOres > 0 ? "No active traits for this mode. Use at least 3 ores and reach a 10% share with a matching trait ore." : "Select ores to see predictions"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/10 bg-surface/50 px-5 py-4 sm:px-6">
                        <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} disabled={!selectedOres.length} onClick={() => setSelectedOres([])}>
                            Clear mix
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// Wrapper component with Suspense boundary
const CalculatorDemo: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="w-full max-w-6xl mx-auto my-12">
                <div className="flex justify-center items-center h-96">
                    <div className="text-gray-500">Loading calculator...</div>
                </div>
            </div>
        }>
            <CalculatorDemoInner />
        </Suspense>
    );
};

export default CalculatorDemo;
