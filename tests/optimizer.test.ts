import { describe, expect, it } from 'vitest';
import { calculateForgingStats } from '@/lib/calculator';
import { findBestCombinations, type OptimizationCriteria } from '@/lib/optimizer';

const criteria: OptimizationCriteria = { craftingType: 'weapon', sortBy: 'multiplier' };

describe('Must Include Ore', () => {
    it.each(['iron', 'fichilliumorite', 'frost-star', 'fichillium'])('includes %s in every result', slug => {
        const results = findBestCombinations({ ...criteria, mustContainOreSlug: slug });
        expect(results.some(result => result.ores.length === 3)).toBe(true);
        for (const { ores, stats } of results) {
            expect(ores.filter(({ ore }) => ore.slug === slug)).toHaveLength(1);
            expect(stats.totalMultiplier).toBe(calculateForgingStats(ores, 'weapon').totalMultiplier);
        }
    });

    it('allows a partner to provide the requested trait and respects the minimum multiplier', () => {
        const filters = { ...criteria, mustContainOreSlug: 'iron', targetTrait: 'Burn' };
        const matches = findBestCombinations({ ...filters, minMultiplier: 5 });
        expect(matches.length).toBeGreaterThan(0);
        for (const result of matches) {
            expect(result.stats.totalMultiplier).toBeGreaterThanOrEqual(5);
            expect(result.ores.some(({ ore }) => ore.slug === 'iron')).toBe(true);
            expect(result.stats.activeTraits.some(({ trait }) => /burn/i.test(trait))).toBe(true);
        }
        expect(findBestCombinations({ ...filters, minMultiplier: 100 })).toEqual([]);
    });
});
