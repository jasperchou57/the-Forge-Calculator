import React from 'react';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import oresJSON from '@/data/v20260201/ores.json';
import { Ore } from '@/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Share2, Sparkles, MapPin, Zap, TrendingUp } from 'lucide-react';
import { notFound } from 'next/navigation';

const ORES_DATA = oresJSON.ores as Ore[];

interface PageProps {
    params: Promise<{ slug: string }>;
}

// SSG: Generate params for all ores
export async function generateStaticParams() {
    return ORES_DATA.map((ore) => ({
        slug: ore.slug,
    }));
}

// Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const ore = ORES_DATA.find((o) => o.slug === slug);
    if (!ore) return { title: 'Ore Not Found' };

    return {
        title: `${ore.name} Stats, Location & Best Recipes - The Forge Calculator`,
        description: `Everything about ${ore.name} in The Forge. Rarity: ${ore.rarity}, Multiplier: ${ore.multiplier}x. Found in ${ore.location}. Check best crafting combinations.`,
    };
}

export default async function OreDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const ore = ORES_DATA.find((o) => o.slug === slug);

    if (!ore) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background font-sans text-white pb-20">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">

                    {/* Breadcrumb / Back */}
                    <Link href="/ores" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Database
                    </Link>

                    {/* Hero Section */}
                    <div className="bg-surface border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background Glow */}
                        <div
                            className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                            style={{ backgroundColor: ore.color, opacity: 0.15 }}
                        ></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">

                            {/* Ore Icon Large */}
                            <div
                                className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center shadow-2xl"
                                style={{ backgroundColor: ore.color }}
                            >
                                {/* No image asset yet, using color block */}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono uppercase tracking-wider">{ore.rarity}</span>
                                    {ore.trait && (
                                        <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> Has Trait
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-5xl font-bold font-heading">{ore.name}</h1>

                                <div className="flex gap-4 pt-4">
                                    <Button asChild icon={<Sparkles className="w-4 h-4" />}>
                                        <Link href={`/?ores=${ore.slug},${ore.slug},${ore.slug}`}>
                                            Simulate with {ore.name}
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" icon={<Share2 className="w-4 h-4" />}>
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-[#0B0C0E] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-surface rounded-lg text-gray-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-mono uppercase">Multiplier</div>
                                <div className="text-2xl font-bold text-white">{ore.multiplier.toFixed(1)}x</div>
                            </div>
                        </div>

                        <div className="bg-[#0B0C0E] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-surface rounded-lg text-gray-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-mono uppercase">Location</div>
                                <div className="text-lg font-bold text-white">{ore.location || 'Unknown'}</div>
                            </div>
                        </div>

                        <div className="bg-[#0B0C0E] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-surface rounded-lg text-gray-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-mono uppercase">Trait Effect</div>
                                <div className="text-sm font-medium text-gray-300">
                                    {ore.trait || 'No special trait'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body (SEO Rich Text) */}
                    <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">About {ore.name}</h2>
                            <p>
                                {ore.name} is a {ore.rarity} tier material in The Forge.
                                With a multiplier of {ore.multiplier}x, it is considered a {ore.multiplier > 4 ? "high-tier" : "standard"} choice for crafting.
                                Players typically farm this ore in {ore.location}.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Best Combinations</h2>
                            <p className="mb-4">
                                Here are some popular recipes using {ore.name}:
                            </p>

                            <div className="grid gap-4">
                                {/* Dynamic Recommendation Mockup */}
                                <div className="bg-surface border border-white/5 p-4 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-accent-blue">Triple Stack</span>
                                        <span className="text-sm text-gray-400">3x {ore.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{(ore.multiplier).toFixed(2)}x Power</div>
                                        <Link href={`/?ores=${ore.slug},${ore.slug},${ore.slug}`} className="text-xs text-accent-blue hover:underline">
                                            Load Recipe &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}
