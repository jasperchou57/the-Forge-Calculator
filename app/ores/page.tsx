import Link from 'next/link';
import Header from '@/components/Layout/Header';
import oresJSON from '@/data/v20260201/ores.json';
import { Metadata } from 'next';
import { ArrowRight, Database } from 'lucide-react';

const SITE_URL = 'https://www.forgeore.com';
const TITLE = 'All Ores List & Stats - The Forge Roblox Wiki';
const DESCRIPTION =
    'Complete database of all ores in The Forge Roblox. Compare multipliers, rarities, and traits for Iron, Gold, Mythril, Void Ore, and more.';

// Ore data with color mapping
interface OreData {
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

const ORES_DATA = oresJSON.ores as OreData[];
const RARITY_COLORS = oresJSON.rarityColors as Record<string, string>;

// Helper to get color from rarity
function getOreColor(rarity: string): string {
    return RARITY_COLORS[rarity] || '#6B7280';
}

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: '/ores',
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/ores`,
        siteName: 'ForgeCalc',
        type: 'website',
        locale: 'en_US',
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'ForgeCalc - The Forge Calculator',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: ['/twitter-image'],
    },
};

export default function OresHubPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-white pb-20">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-accent-blue font-mono text-sm">
                                <Database className="w-4 h-4" />
                                <span>DATABASE</span>
                            </div>
                            <h1 className="text-4xl font-bold font-heading">Ores & Materials</h1>
                            <p className="text-gray-400 max-w-xl">
                                Comprehensive list of all mineable resources in The Forge.
                                Click on an ore to view detailed stats, drop locations, and best crafting recipes.
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-mono font-bold text-white">{ORES_DATA.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Items Indexed</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ORES_DATA.map((ore) => (
                            <Link
                                href={`/ores/${ore.slug}`}
                                key={ore.slug}
                                className="group bg-surface border border-white/5 rounded-xl p-5 hover:border-accent-blue/50 hover:bg-surface-highlight transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/10" style={{ backgroundColor: getOreColor(ore.rarity) }}>
                                            {/* Icon placeholder or initial */}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-accent-blue transition-colors">{ore.name}</h3>
                                            <div className="text-xs text-gray-500 font-mono uppercase">{ore.rarity}</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 px-2 py-1 rounded text-xs font-mono text-gray-300">
                                        {ore.multiplier}x
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Location</span>
                                        <span className="text-gray-300">{ore.location || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Trait</span>
                                        <span className={ore.trait ? "text-accent-blue" : "text-gray-600"}>
                                            {ore.trait ? 'Yes' : 'None'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end text-accent-blue text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    VIEW DETAILS <ArrowRight className="w-3 h-3" />
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
