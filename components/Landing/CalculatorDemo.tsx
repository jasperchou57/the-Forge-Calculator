'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { SelectedOre, Ore } from '@/types';
import { calculateForgingStats, validateOreSelection, getMaterialName } from '@/lib/calculator';
import oresJSON from '@/data/v20260201/ores.json';
import { Sparkles, RefreshCw, Zap, Share2, Check, Minus, Plus, Sword, Shield, AlertCircle } from 'lucide-react';

// Dynamically import Recharts to avoid SSR issues
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

// Type assertion for ore data
interface OreDataRaw {
    slug: string;
    name: string;
    rarity: string;
    chance: string;
    multiplier: number;
    price: number | null;
    trait: string | null;
    rocks: string[];
    location: string;
}

const ORES_DATA = oresJSON.ores as OreDataRaw[];
const RARITY_COLORS = oresJSON.rarityColors as Record<string, string>;

// World groupings
const WORLD_GROUPS: Record<string, string[]> = {
    'W1/W2': ["Stonewake's Cross", "Forgotten Kingdom", "Goblin Cave", "Enemy Drop"],
    'W3': ["Frostspire Expanse", "The Peak", "Boss Drop"]
};

// Convert raw data to Ore type
function toOre(raw: OreDataRaw): Ore {
    return {
        slug: raw.slug,
        name: raw.name,
        rarity: raw.rarity as Ore['rarity'],
        chance: raw.chance,
        multiplier: raw.multiplier,
        price: raw.price,
        color: RARITY_COLORS[raw.rarity] || '#6B7280',
        location: raw.location,
        trait: raw.trait,
        rocks: raw.rocks
    };
}

// Inner component that uses useSearchParams
const CalculatorDemoInner: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // State
    const [selectedOres, setSelectedOres] = useState<SelectedOre[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [activeWorld, setActiveWorld] = useState<'W1/W2' | 'W3'>('W1/W2');
    const [craftingMode, setCraftingMode] = useState<'weapon' | 'armor'>('weapon');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter ores by world and search
    const filteredOres = useMemo(() => {
        const worldLocations = WORLD_GROUPS[activeWorld];
        return ORES_DATA
            .filter(ore => worldLocations.includes(ore.location))
            .filter(ore => 
                searchTerm === '' || 
                ore.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ore.rarity.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(toOre);
    }, [activeWorld, searchTerm]);

    // Load from URL on mount
    useEffect(() => {
        if (isInitialized) return;

        const oresParam = searchParams.get('ores');
        if (oresParam) {
            // Format: slug:qty,slug:qty
            const parts = oresParam.split(',');
            const loadedOres: SelectedOre[] = [];
            
            parts.forEach(part => {
                const [slug, qtyStr] = part.includes(':') ? part.split(':') : [part, '1'];
                const qty = parseInt(qtyStr) || 1;
                const rawOre = ORES_DATA.find(o => o.slug === slug);
                if (rawOre) {
                    loadedOres.push({ ore: toOre(rawOre), quantity: qty });
                }
            });
            
            setSelectedOres(loadedOres.slice(0, 4)); // Max 4 types
        }
        setIsInitialized(true);
    }, [searchParams, isInitialized]);

    // Update URL when selection changes
    useEffect(() => {
        if (!isInitialized) return;

        const params = new URLSearchParams(searchParams);
        if (selectedOres.length > 0) {
            const oresStr = selectedOres.map(s => `${s.ore.slug}:${s.quantity}`).join(',');
            params.set('ores', oresStr);
        } else {
            params.delete('ores');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [selectedOres, router, pathname, searchParams, isInitialized]);

    // Real-time calculation
    const stats = useMemo(() => calculateForgingStats(selectedOres), [selectedOres]);
    const validationError = useMemo(
        () => validateOreSelection(selectedOres, craftingMode),
        [selectedOres, craftingMode]
    );
    const materialName = useMemo(() => getMaterialName(selectedOres), [selectedOres]);

    // Handlers
    const addOre = (ore: Ore) => {
        const existing = selectedOres.find(s => s.ore.slug === ore.slug);
        if (existing) {
            // Increase quantity
            setSelectedOres(selectedOres.map(s => 
                s.ore.slug === ore.slug 
                    ? { ...s, quantity: s.quantity + 1 }
                    : s
            ));
        } else {
            // Add new ore (max 4 types)
            if (selectedOres.length < 4) {
                setSelectedOres([...selectedOres, { ore, quantity: 1 }]);
            }
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
        if (qty <= 0) {
            setSelectedOres(selectedOres.filter(s => s.ore.slug !== slug));
        } else {
            setSelectedOres(selectedOres.map(s => 
                s.ore.slug === slug ? { ...s, quantity: qty } : s
            ));
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const totalOres = stats.totalOreCount;
    const maxOres = craftingMode === 'weapon' ? 51 : 45;
    const canAddMore = selectedOres.length < 4 && totalOres < maxOres;

    // Chart data - safely handle empty arrays
    const probabilityData = craftingMode === 'weapon' 
        ? (stats.weaponProbabilities || []).map(p => ({ name: p.category, prob: p.chance, color: p.color }))
        : (stats.armorProbabilities || []).map(p => ({ name: p.class, prob: p.chance, color: p.color }));

    return (
        <div className="w-full max-w-6xl mx-auto my-12">
            {/* Data Version Badge */}
            <div className="flex justify-end mb-4">
                <Badge variant="neutral">
                    Data: {oresJSON.metadata.version} ({oresJSON.metadata.totalOres} ores)
                </Badge>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Input Selection */}
                <div className="flex-1 space-y-4">
                    {/* Mode Toggle */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                            <button
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
                            {(['W1/W2', 'W3'] as const).map(world => (
                                <button
                                    key={world}
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
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <span className="w-1 h-5 bg-accent-blue rounded-full"></span>
                            Material Selection
                        </h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="text-xs flex items-center gap-1.5 text-accent-blue hover:text-accent-blue/80 transition-colors"
                                title="Copy link to this setup"
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
                        placeholder="Search ores..."
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
                                            onClick={() => removeOre(ore.slug)}
                                            className="p-1 hover:bg-white/10 rounded"
                                        >
                                            <Minus className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={maxOres}
                                            value={quantity}
                                            onChange={(e) => setOreQuantity(ore.slug, parseInt(e.target.value) || 0)}
                                            className="w-14 bg-surface border border-white/10 rounded px-2 py-1 text-sm text-center"
                                        />
                                        <button 
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                        {filteredOres.map((ore) => {
                            const selected = selectedOres.find(s => s.ore.slug === ore.slug);
                            const isSelected = !!selected;
                            return (
                                <button
                                    key={ore.slug}
                                    onClick={() => addOre(ore)}
                                    disabled={!canAddMore && !isSelected}
                                    className={`
                                        relative p-3 rounded-lg border text-left transition-all duration-200 group
                                        ${isSelected
                                            ? 'bg-accent-blue/10 border-accent-blue/50 text-white'
                                            : 'bg-surface border-white/5 text-gray-400 hover:border-white/20 hover:bg-surface-highlight'}
                                        ${!canAddMore && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
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
                                    {ore.trait && (
                                        <div className="text-[9px] text-accent-blue mt-1 truncate" title={ore.trait}>
                                            ★ Has Trait
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Output / Dashboard */}
                <Card className="flex-1 p-0 flex flex-col bg-[#0B0C0E] max-h-[700px]" glow>
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface/50">
                        <h3 className="font-mono text-sm text-gray-300 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-warning" />
                            {craftingMode === 'weapon' ? 'WEAPON' : 'ARMOR'} SIMULATION
                        </h3>
                        <Badge variant={totalOres >= 3 ? "success" : "neutral"} pulsing={totalOres >= 3}>
                            {totalOres >= 3 ? "READY" : "IDLE"}
                        </Badge>
                    </div>

                    <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                        {/* Material Name */}
                        {totalOres >= 3 && (
                            <div className="text-center p-3 bg-black/40 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 font-mono mb-1">MATERIAL NAME</div>
                                <div className="text-lg font-bold text-white">{materialName} {craftingMode === 'weapon' ? 'Weapon' : 'Armor'}</div>
                            </div>
                        )}

                        {/* KPI Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 font-mono mb-1">MULTIPLIER</div>
                                <div className="text-xl font-mono text-white tabular-nums">
                                    {stats.totalMultiplier.toFixed(2)}x
                                </div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 font-mono mb-1">STABILITY</div>
                                <div className={`text-xl font-mono tabular-nums ${stats.stability >= 70 ? 'text-success' : stats.stability >= 40 ? 'text-warning' : 'text-error'}`}>
                                    {stats.stability}%
                                </div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 font-mono mb-1">TOTAL ORES</div>
                                <div className="text-xl font-mono text-white tabular-nums">
                                    {totalOres}
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        {probabilityData.length > 0 && (
                            <div className="h-44 w-full relative">
                                <div className="absolute top-0 left-0 text-xs text-gray-500 font-mono">
                                    {craftingMode === 'weapon' ? 'WEAPON TYPE' : 'ARMOR CLASS'} PROBABILITY
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={probabilityData} barSize={20} margin={{ top: 20 }}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#333"
                                            tick={{ fill: '#666', fontSize: 9, fontFamily: 'monospace' }}
                                            tickLine={false}
                                            axisLine={false}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#161719', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                                            itemStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                                            formatter={(value) => [`${value}%`, 'Chance']}
                                        />
                                        <Bar dataKey="prob" radius={[2, 2, 0, 0]}>
                                            {probabilityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Traits Analysis */}
                        <div className="space-y-2">
                            <div className="text-xs text-gray-500 font-mono border-b border-white/5 pb-1">ACTIVE TRAITS</div>

                            {stats.activeTraits.length > 0 ? (
                                stats.activeTraits.map((t, idx) => (
                                    <div key={idx} className="p-2 bg-black/40 rounded border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white font-medium">{t.traitName}</span>
                                            <span className="font-mono text-accent-blue tabular-nums">{t.percentage}%</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {t.sourceOre}: {t.trait}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-xs text-gray-600 italic">
                                    {totalOres > 0 ? "No active traits (need ≥10% composition of trait ore)" : "Select ores to see predictions"}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10 bg-surface/50 flex gap-2">
                        <Button className="flex-1" icon={<Sparkles />} disabled={totalOres < 3}>
                            FORGE {craftingMode.toUpperCase()}
                        </Button>
                        <Button variant="secondary" icon={<RefreshCw />} className="w-12" onClick={() => setSelectedOres([])}></Button>
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
