'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Layout/Header';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { findBestCombinations, getAvailableTraits, OptimizationResult } from '@/lib/optimizer';
import { Sparkles, ArrowRight, Settings, Filter } from 'lucide-react';
import oresJSON from '@/data/v20260201/ores.json';
import { Ore, SelectedOre } from '@/types';

const OptimizerPage = () => {
    const router = useRouter();

    // Form State
    const [targetTrait, setTargetTrait] = useState<string>('');
    const [minMultiplier, setMinMultiplier] = useState<number>(0);
    const [mustContain, setMustContain] = useState<string>('');
    const [sortBy, setSortBy] = useState<'multiplier' | 'stability' | 'trait_strength'>('multiplier');

    // Results State
    const [results, setResults] = useState<OptimizationResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Data helpers
    const traits = getAvailableTraits();
    const ores = oresJSON.ores as Ore[];

    const handleOptimize = () => {
        const res = findBestCombinations({
            targetTrait: targetTrait || undefined,
            minMultiplier: minMultiplier || undefined,
            mustContainOreSlug: mustContain || undefined,
            sortBy,
            craftingType: 'weapon'
        });
        setResults(res);
        setHasSearched(true);
    };

    const applyToCalculator = (combo: SelectedOre[]) => {
        const slugs = combo.map(s => `${s.ore.slug}:${s.quantity}`).join(',');
        router.push(`/?ores=${slugs}`);
    };

    return (
        <div className="min-h-screen bg-background font-sans text-white pb-20">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Forge Optimizer
                        </h1>
                        <p className="text-gray-400">Discover the best recipes for your specific goals.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Sidebar: Controls */}
                        <Card className="md:w-1/3 bg-[#0B0C0E] h-fit" glow>
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-accent-blue" />
                                <h2 className="font-mono text-sm">CONFIGURATION</h2>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* Target Trait */}
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-mono uppercase">Target Trait</label>
                                    <select
                                        value={targetTrait}
                                        onChange={(e) => setTargetTrait(e.target.value)}
                                        className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:border-accent-blue outline-none"
                                    >
                                        <option value="">Any Trait</option>
                                        {traits.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                {/* Min Multiplier */}
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-mono uppercase">Min Multiplier (x)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={minMultiplier}
                                        onChange={(e) => setMinMultiplier(Number(e.target.value))}
                                        className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:border-accent-blue outline-none"
                                        placeholder="e.g. 3.0"
                                    />
                                </div>

                                {/* Must Contain */}
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-mono uppercase">Must Include Ore</label>
                                    <select
                                        value={mustContain}
                                        onChange={(e) => setMustContain(e.target.value)}
                                        className="w-full bg-surface border border-white/10 rounded-lg p-2 text-sm focus:border-accent-blue outline-none"
                                    >
                                        <option value="">None</option>
                                        {ores.map(o => <option key={o.slug} value={o.slug}>{o.name}</option>)}
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-mono uppercase">Prioritize</label>
                                    <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                                        <button
                                            onClick={() => setSortBy('multiplier')}
                                            className={`flex-1 text-xs py-1.5 rounded ${sortBy === 'multiplier' ? 'bg-accent-blue text-white' : 'text-gray-400'}`}
                                        >
                                            Power
                                        </button>
                                        <button
                                            onClick={() => setSortBy('stability')}
                                            className={`flex-1 text-xs py-1.5 rounded ${sortBy === 'stability' ? 'bg-accent-blue text-white' : 'text-gray-400'}`}
                                        >
                                            Stable
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={handleOptimize} className="w-full" icon={<Filter className="w-4 h-4" />}>
                                    Find Recipes
                                </Button>

                            </div>
                        </Card>

                        {/* Main: Results */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{hasSearched ? `Found ${results.length} combinations` : 'Ready to optimize'}</span>
                            </div>

                            {!hasSearched ? (
                                <div className="h-64 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-600">
                                    <div className="text-center">
                                        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Enter criteria to find the best forging recipes</p>
                                    </div>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="h-64 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-600">
                                    <div className="text-center">
                                        <p>No combinations found matching these criteria.</p>
                                        <button onClick={() => { setMinMultiplier(0); setMustContain(''); setTargetTrait(''); handleOptimize(); }} className="text-accent-blue hover:underline mt-2">
                                            Clear filters?
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {results.map((res, idx) => (
                                        <div key={idx} className="bg-surface border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors flex flex-col md:flex-row gap-4 items-center">

                                            {/* Visual Ores */}
                                            <div className="flex -space-x-3">
                                                {res.ores.map((selectedOre, i) => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0C0E] bg-surface flex items-center justify-center" title={selectedOre.ore.name} style={{ backgroundColor: selectedOre.ore.color }}>
                                                        <span className="text-[10px] bg-black/50 text-white rounded px-1">{selectedOre.ore.multiplier}x</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex-1 grid grid-cols-3 gap-2 text-center md:text-left">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 font-mono">MULTIPLIER</div>
                                                    <div className="text-lg font-bold text-white">{res.stats.totalMultiplier.toFixed(2)}x</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 font-mono">STABILITY</div>
                                                    <div className={`text-lg font-bold ${res.stats.stability < 100 ? 'text-warning' : 'text-success'}`}>
                                                        {res.stats.stability}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 font-mono">TRAITS</div>
                                                    {res.stats.activeTraits.length > 0 ? (
                                                        res.stats.activeTraits.map(t => (
                                                            <div key={t.traitName} className="text-xs text-accent-blue truncate">
                                                                {t.traitName} ({t.percentage}%)
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-600">-</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <Button variant="secondary" size="sm" onClick={() => applyToCalculator(res.ores)} icon={<ArrowRight className="w-3 h-3" />}>
                                                Use
                                            </Button>
                                        </div>
                                    ))}

                                    {results.length >= 50 && (
                                        <div className="text-center text-xs text-gray-500 pt-4">
                                            Showing top 50 results. Refine your search for more specific matches.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default OptimizerPage;
