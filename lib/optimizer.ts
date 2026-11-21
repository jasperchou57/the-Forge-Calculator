import { Ore, SelectedOre, ForgingResult } from '@/types';
import { calculateForgingStats } from './calculator';
import { ALL_ORES, traitForMode } from './ores';

export interface OptimizationCriteria {
    targetTrait?: string;
    minMultiplier?: number;
    mustContainOreSlug?: string;
    sortBy: 'multiplier' | 'lowest_multiplier' | 'trait_strength';
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
            traitForMode(o, criteria.craftingType)?.toLowerCase().includes(criteria.targetTrait!.toLowerCase())
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
        for (let j = i + 1; j < topOres.length; j++) {
            const half = Math.floor(targetCount / 2);
            combinations.push([
                { ore: topOres[i], quantity: half },
                { ore: topOres[j], quantity: targetCount - half }
            ]);
        }
    }

    // Three ore combinations (with trait optimization)
    for (let i = 0; i < Math.min(topOres.length, 10); i++) {
        for (let j = i + 1; j < Math.min(topOres.length, 10); j++) {
            for (let k = j + 1; k < Math.min(topOres.length, 10); k++) {
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

        const stats = calculateForgingStats(combo, criteria.craftingType);

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
            traitScore = Math.min(active.mixPercent, 30);
        }

        // Calculate Score based on SortBy
        let score = 0;
        if (criteria.sortBy === 'multiplier') score = stats.totalMultiplier;
        else if (criteria.sortBy === 'lowest_multiplier') score = -stats.totalMultiplier;
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
    const effects = ALL_ORES.map(ore => traitForMode(ore, 'weapon')?.toLowerCase() || '');
    const filters = ['Attack speed', 'Burn', 'Critical', 'Damage', 'Explosion', 'Freeze',
        'Lifesteal', 'Poison', 'Slow', 'Smite'];
    return filters.filter(filter => effects.some(effect => effect.includes(filter.toLowerCase())));
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
