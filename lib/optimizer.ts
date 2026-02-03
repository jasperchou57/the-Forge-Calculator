import { Ore, SelectedOre, ForgingResult } from '@/types';
import { calculateForgingStats } from './calculator';
import oresJSON from '@/data/v20260201/ores.json';

// Type for ore data from JSON
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

const RARITY_COLORS = oresJSON.rarityColors as Record<string, string>;
const ALL_ORES_RAW = oresJSON.ores as OreDataRaw[];

// Convert raw ore data to Ore type
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

const ALL_ORES = ALL_ORES_RAW.map(toOre);

export interface OptimizationCriteria {
    targetTrait?: string;
    minMultiplier?: number;
    mustContainOreSlug?: string;
    sortBy: 'multiplier' | 'stability' | 'trait_strength';
    craftingType: 'weapon' | 'armor';
    targetOreCount?: number;
}

export interface OptimizationResult {
    ores: SelectedOre[];
    stats: ForgingResult;
    score: number;
}

/**
 * Finds the best ore combinations based on the given criteria.
 * Uses a brute-force approach suitable for client-side usage with small datasets.
 * 
 * PRD Requirements:
 * - Up to 4 different ore types
 * - Total ore count: 3-51 for weapons, 3-45 for armor
 */
export function findBestCombinations(criteria: OptimizationCriteria): OptimizationResult[] {
    const results: OptimizationResult[] = [];
    const maxOres = criteria.craftingType === 'weapon' ? 51 : 45;
    const targetCount = criteria.targetOreCount || 12; // Default to 12 ores

    // Filter ores based on criteria
    let eligibleOres = ALL_ORES;

    // If must contain ore, ensure it's in the list
    if (criteria.mustContainOreSlug) {
        const mustHave = ALL_ORES.find(o => o.slug === criteria.mustContainOreSlug);
        if (!mustHave) {
            return []; // Invalid ore slug
        }
    }

    // If targeting a trait, filter to ores with traits
    if (criteria.targetTrait) {
        eligibleOres = eligibleOres.filter(o => 
            o.trait && o.trait.toLowerCase().includes(criteria.targetTrait!.toLowerCase())
        );
    }

    // Limit to ores with reasonable multipliers for performance
    const topOres = eligibleOres
        .filter(o => o.multiplier > 0)
        .sort((a, b) => b.multiplier - a.multiplier)
        .slice(0, 20); // Top 20 ores by multiplier

    // Generate combinations (simplified: pairs and triples)
    const combinations: SelectedOre[][] = [];

    // Single ore (full stack)
    for (const ore of topOres) {
        const qty = Math.min(targetCount, maxOres);
        combinations.push([{ ore, quantity: qty }]);
    }

    // Two ore combinations (50/50 split)
    for (let i = 0; i < topOres.length; i++) {
        for (let j = i; j < topOres.length; j++) {
            const half = Math.floor(targetCount / 2);
            combinations.push([
                { ore: topOres[i], quantity: half },
                { ore: topOres[j], quantity: targetCount - half }
            ]);
        }
    }

    // Three ore combinations (with trait optimization)
    for (let i = 0; i < Math.min(topOres.length, 10); i++) {
        for (let j = i; j < Math.min(topOres.length, 10); j++) {
            for (let k = j; k < Math.min(topOres.length, 10); k++) {
                const third = Math.floor(targetCount / 3);
                const remainder = targetCount - (third * 2);
                combinations.push([
                    { ore: topOres[i], quantity: third },
                    { ore: topOres[j], quantity: third },
                    { ore: topOres[k], quantity: remainder }
                ]);
            }
        }
    }

    // Evaluate each combination
    for (const combo of combinations) {
        // Check "Must Contain" constraint
        if (criteria.mustContainOreSlug) {
            if (!combo.find(s => s.ore.slug === criteria.mustContainOreSlug)) {
                continue;
            }
        }

        const stats = calculateForgingStats(combo);

        // Check "Min Multiplier"
        if (criteria.minMultiplier && stats.totalMultiplier < criteria.minMultiplier) {
            continue;
        }

        // Check "Target Trait"
        let traitScore = 0;
        if (criteria.targetTrait) {
            const active = stats.activeTraits.find(t =>
                t.trait.toLowerCase().includes(criteria.targetTrait!.toLowerCase())
            );
            if (!active) continue; // Trait must be present
            traitScore = active.percentage;
        }

        // Calculate Score based on SortBy
        let score = 0;
        if (criteria.sortBy === 'multiplier') score = stats.totalMultiplier;
        else if (criteria.sortBy === 'stability') score = stats.stability;
        else if (criteria.sortBy === 'trait_strength') score = traitScore;

        results.push({
            ores: combo,
            stats,
            score
        });
    }

    // Sort and return top 50
    return results.sort((a, b) => b.score - a.score).slice(0, 50);
}

/**
 * Helper to get unique traits available in the ore data for the dropdown
 */
export function getAvailableTraits(): string[] {
    const traits = new Set<string>();
    ALL_ORES.forEach(o => {
        if (o.trait) {
            // Extract trait name patterns
            if (o.trait.includes('defense')) traits.add('Defense');
            if (o.trait.includes('damage') || o.trait.includes('Damage')) traits.add('Damage');
            if (o.trait.includes('crit')) traits.add('Critical');
            if (o.trait.includes('movement speed')) traits.add('Speed');
            if (o.trait.includes('vitality')) traits.add('Vitality');
            if (o.trait.includes('dodge')) traits.add('Dodge');
            if (o.trait.includes('burn')) traits.add('Burn');
            if (o.trait.includes('freeze')) traits.add('Freeze');
            if (o.trait.includes('slow')) traits.add('Slow');
            if (o.trait.includes('poison')) traits.add('Poison');
            if (o.trait.includes('AOE') || o.trait.includes('explosion')) traits.add('AOE');
            if (o.trait.includes('health') || o.trait.includes('HP')) traits.add('Health');
            if (o.trait.includes('lifesteal')) traits.add('Lifesteal');
            if (o.trait.includes('lethality')) traits.add('Lethality');
            if (o.trait.includes('attack speed')) traits.add('Attack Speed');
        }
    });
    return Array.from(traits).sort();
}

/**
 * Get all available ores
 */
export function getAllOres(): Ore[] {
    return ALL_ORES;
}

/**
 * Get ores by location
 */
export function getOresByLocation(location: string): Ore[] {
    return ALL_ORES.filter(o => o.location === location);
}

/**
 * Get ores with traits only
 */
export function getTraitOres(): Ore[] {
    return ALL_ORES.filter(o => o.trait !== null);
}
