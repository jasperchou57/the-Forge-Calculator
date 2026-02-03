import { describe, it, expect } from 'vitest';
import { calculateForgingStats, validateOreSelection, getMaterialName } from '../lib/calculator';
import { SelectedOre, Ore } from '../types';

// Helper to create mock ores
function createOre(partial: Partial<Ore>): Ore {
    return {
        slug: partial.slug || 'test-ore',
        name: partial.name || 'Test Ore',
        rarity: partial.rarity || 'Common',
        chance: partial.chance || '1/1',
        multiplier: partial.multiplier || 1.0,
        price: partial.price ?? 10,
        color: partial.color || '#fff',
        location: partial.location || "Stonewake's Cross",
        trait: partial.trait ?? null,
        rocks: partial.rocks || ['Rock']
    };
}

// Test data based on real game ores
const MOCK_ORES = {
    stone: createOre({ slug: 'stone', name: 'Stone', rarity: 'Common', multiplier: 0.2, trait: null }),
    iron: createOre({ slug: 'iron', name: 'Iron', rarity: 'Common', multiplier: 0.35, trait: null }),
    gold: createOre({ slug: 'gold', name: 'Gold', rarity: 'Uncommon', multiplier: 0.65, trait: null }),
    diamond: createOre({ slug: 'diamond', name: 'Diamond', rarity: 'Rare', multiplier: 2.0, trait: null }),
    obsidian: createOre({ slug: 'obsidian', name: 'Obsidian', rarity: 'Epic', multiplier: 2.35, trait: '+30% extra defense' }),
    eyeOre: createOre({ slug: 'eye-ore', name: 'Eye Ore', rarity: 'Legendary', multiplier: 4.0, trait: '+15% weapon damage, -10% max HP' }),
    mythril: createOre({ slug: 'mythril', name: 'Mythril', rarity: 'Legendary', multiplier: 3.5, trait: '+15% extra defense' }),
    darkryte: createOre({ slug: 'darkryte', name: 'Darkryte', rarity: 'Mythical', multiplier: 6.3, trait: '15% chance to dodge attacks completely' }),
    iceite: createOre({ slug: 'iceite', name: 'Iceite', rarity: 'Mythical', multiplier: 10.5, trait: '25% chance to freeze enemies on hit' }),
    gargantuan: createOre({ slug: 'gargantuan', name: 'Gargantuan', rarity: 'Divine', multiplier: 25.0, trait: '35% chance for 50% AOE explosion, +35% crit damage, -20% attack speed' }),
};

describe('Calculator Engine - Basic Calculations', () => {

    // Test 1: Empty input
    it('1. should handle empty input', () => {
        const result = calculateForgingStats([]);
        expect(result.totalMultiplier).toBe(0);
        expect(result.stability).toBe(100);
        expect(result.totalOreCount).toBe(0);
        expect(result.activeTraits).toHaveLength(0);
    });

    // Test 2: Single ore with quantity 1 (below minimum)
    it('2. should return empty stats when total ores below 3', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iron, quantity: 2 }]);
        expect(result.totalOreCount).toBe(2);
        expect(result.weaponProbabilities).toHaveLength(0);
    });

    // Test 3: Single ore with minimum quantity
    it('3. should calculate correctly with minimum 3 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iron, quantity: 3 }]);
        expect(result.totalMultiplier).toBe(0.35);
        expect(result.totalOreCount).toBe(3);
    });

    // Test 4: Average multiplier calculation
    it('4. should calculate average multiplier correctly', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.iron, quantity: 5 },  // 0.35 * 5 = 1.75
            { ore: MOCK_ORES.gold, quantity: 5 }   // 0.65 * 5 = 3.25
        ]);
        // (1.75 + 3.25) / 10 = 0.5
        expect(result.totalMultiplier).toBe(0.5);
    });

    // Test 5: Higher multiplier ores
    it('5. should handle high multiplier ores correctly', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.gargantuan, quantity: 3 }
        ]);
        expect(result.totalMultiplier).toBe(25.0);
    });

    // Test 6: Mixed multipliers
    it('6. should calculate mixed multipliers correctly', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.eyeOre, quantity: 4 },    // 4.0 * 4 = 16
            { ore: MOCK_ORES.mythril, quantity: 4 },   // 3.5 * 4 = 14
            { ore: MOCK_ORES.darkryte, quantity: 4 }   // 6.3 * 4 = 25.2
        ]);
        // (16 + 14 + 25.2) / 12 = 4.6
        expect(result.totalMultiplier).toBe(4.6);
    });

});

describe('Calculator Engine - Stability', () => {

    // Test 7: Low multiplier = high stability
    it('7. should have high stability with low multiplier ores', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.stone, quantity: 10 }
        ]);
        // 100 - (0.2 * 3) = 99.4
        expect(result.stability).toBeGreaterThan(95);
    });

    // Test 8: High multiplier = low stability
    it('8. should have lower stability with high multiplier ores', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.gargantuan, quantity: 3 }
        ]);
        // 100 - (25.0 * 3) = 25 (clamped to 10 minimum)
        expect(result.stability).toBeLessThanOrEqual(30);
    });

    // Test 9: Medium multiplier = medium stability
    it('9. should have medium stability with medium multipliers', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.diamond, quantity: 6 }
        ]);
        // 100 - (2.0 * 3) = 94
        expect(result.stability).toBeGreaterThan(90);
        expect(result.stability).toBeLessThan(100);
    });

    // Test 10: Stability minimum is 10
    it('10. should clamp stability minimum at 10', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.gargantuan, quantity: 51 }
        ]);
        expect(result.stability).toBeGreaterThanOrEqual(10);
    });

});

describe('Calculator Engine - Trait Activation', () => {

    // Test 11: No trait ores = no active traits
    it('11. should have no active traits when no trait ores used', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.iron, quantity: 6 },
            { ore: MOCK_ORES.gold, quantity: 6 }
        ]);
        expect(result.activeTraits).toHaveLength(0);
    });

    // Test 12: Trait ore below 10% = not activated
    it('12. should not activate trait below 10% composition', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.iron, quantity: 27 },      // 90%
            { ore: MOCK_ORES.obsidian, quantity: 3 }    // 10% - at threshold
        ]);
        // At exactly 10%, should be minimally active
        const obsidianTrait = result.activeTraits.find(t => t.sourceOre === 'Obsidian');
        expect(obsidianTrait).toBeDefined();
        expect(obsidianTrait?.percentage).toBe(0); // Linear interp: (10-10)/(30-10) = 0
    });

    // Test 13: Trait ore at 30% = 100% strength
    it('13. should activate trait at 100% strength when at 30% composition', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.obsidian, quantity: 3 },   // 30%
            { ore: MOCK_ORES.iron, quantity: 7 }        // 70%
        ]);
        const obsidianTrait = result.activeTraits.find(t => t.sourceOre === 'Obsidian');
        expect(obsidianTrait).toBeDefined();
        expect(obsidianTrait?.percentage).toBe(100);
    });

    // Test 14: Trait ore at 20% = 50% strength
    it('14. should calculate 50% trait strength at 20% composition', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.eyeOre, quantity: 2 },     // 20%
            { ore: MOCK_ORES.iron, quantity: 8 }        // 80%
        ]);
        const trait = result.activeTraits.find(t => t.sourceOre === 'Eye Ore');
        expect(trait).toBeDefined();
        expect(trait?.percentage).toBe(50);
    });

    // Test 15: Multiple traits active
    it('15. should activate multiple traits from different ores', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.obsidian, quantity: 4 },   // 33%
            { ore: MOCK_ORES.mythril, quantity: 4 },    // 33%
            { ore: MOCK_ORES.eyeOre, quantity: 4 }      // 33%
        ]);
        expect(result.activeTraits.length).toBe(3);
        result.activeTraits.forEach(t => {
            expect(t.percentage).toBe(100); // All at 33% > 30%
        });
    });

    // Test 16: Trait above 30% still 100%
    it('16. should cap trait strength at 100% even above 30% composition', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.iceite, quantity: 10 }  // 100%
        ]);
        const trait = result.activeTraits.find(t => t.sourceOre === 'Iceite');
        expect(trait).toBeDefined();
        expect(trait?.percentage).toBe(100);
    });

});

describe('Calculator Engine - Weapon Probabilities', () => {

    // Test 17: 3-5 ores = Dagger dominant
    it('17. should favor Daggers with 3-5 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iron, quantity: 4 }]);
        const dagger = result.weaponProbabilities.find(p => p.category === 'Dagger');
        expect(dagger).toBeDefined();
        expect(dagger?.chance).toBeGreaterThan(50);
    });

    // Test 18: 12-14 ores = Katana dominant
    it('18. should favor Katana with 12-14 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.diamond, quantity: 12 }]);
        const katana = result.weaponProbabilities.find(p => p.category === 'Katana');
        expect(katana).toBeDefined();
        expect(katana?.chance).toBeGreaterThanOrEqual(70);
    });

    // Test 19: 41-51 ores = Colossal dominant
    it('19. should favor Colossal with 41-51 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.darkryte, quantity: 45 }]);
        const colossal = result.weaponProbabilities.find(p => p.category === 'Colossal');
        expect(colossal).toBeDefined();
        expect(colossal?.chance).toBeGreaterThanOrEqual(50);
    });

    // Test 20: Probabilities sum to 100
    it('20. should have weapon probabilities summing to approximately 100', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.diamond, quantity: 20 }]);
        const sum = result.weaponProbabilities.reduce((acc, p) => acc + p.chance, 0);
        expect(sum).toBeCloseTo(100, 0);
    });

});

describe('Calculator Engine - Armor Probabilities', () => {

    // Test 21: 3-10 ores = Light Armor dominant
    it('21. should favor Light Armor with 3-10 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iron, quantity: 8 }]);
        const light = result.armorProbabilities.find(p => p.class === 'Light Armor');
        expect(light).toBeDefined();
        expect(light?.chance).toBeGreaterThanOrEqual(70);
    });

    // Test 22: 21-30 ores = Heavy Armor favored
    it('22. should favor Heavy Armor with 21-30 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.mythril, quantity: 25 }]);
        const heavy = result.armorProbabilities.find(p => p.class === 'Heavy Armor');
        expect(heavy).toBeDefined();
        expect(heavy?.chance).toBeGreaterThanOrEqual(50);
    });

    // Test 23: 31-45 ores = Heavy Armor dominant
    it('23. should strongly favor Heavy Armor with 31-45 ores', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.darkryte, quantity: 35 }]);
        const heavy = result.armorProbabilities.find(p => p.class === 'Heavy Armor');
        expect(heavy).toBeDefined();
        expect(heavy?.chance).toBeGreaterThanOrEqual(70);
    });

});

describe('Calculator Engine - Validation', () => {

    // Test 24: Valid weapon selection
    it('24. should validate correct weapon ore selection', () => {
        const selection: SelectedOre[] = [
            { ore: MOCK_ORES.eyeOre, quantity: 10 },
            { ore: MOCK_ORES.mythril, quantity: 10 }
        ];
        const error = validateOreSelection(selection, 'weapon');
        expect(error).toBeNull();
    });

    // Test 25: Too few ores
    it('25. should reject selection with fewer than 3 ores', () => {
        const selection: SelectedOre[] = [{ ore: MOCK_ORES.iron, quantity: 2 }];
        const error = validateOreSelection(selection, 'weapon');
        expect(error).toContain('Minimum 3');
    });

    // Test 26: Too many weapon ores
    it('26. should reject weapon selection exceeding 51 ores', () => {
        const selection: SelectedOre[] = [{ ore: MOCK_ORES.iron, quantity: 52 }];
        const error = validateOreSelection(selection, 'weapon');
        expect(error).toContain('Maximum 51');
    });

    // Test 27: Too many armor ores
    it('27. should reject armor selection exceeding 45 ores', () => {
        const selection: SelectedOre[] = [{ ore: MOCK_ORES.iron, quantity: 46 }];
        const error = validateOreSelection(selection, 'armor');
        expect(error).toContain('Maximum 45');
    });

    // Test 28: Too many ore types
    it('28. should reject selection with more than 4 ore types', () => {
        const selection: SelectedOre[] = [
            { ore: MOCK_ORES.iron, quantity: 2 },
            { ore: MOCK_ORES.gold, quantity: 2 },
            { ore: MOCK_ORES.diamond, quantity: 2 },
            { ore: MOCK_ORES.obsidian, quantity: 2 },
            { ore: MOCK_ORES.eyeOre, quantity: 2 }
        ];
        const error = validateOreSelection(selection, 'weapon');
        expect(error).toContain('Maximum 4');
    });

    // Test 29: Exactly 4 ore types is valid
    it('29. should accept selection with exactly 4 ore types', () => {
        const selection: SelectedOre[] = [
            { ore: MOCK_ORES.iron, quantity: 3 },
            { ore: MOCK_ORES.gold, quantity: 3 },
            { ore: MOCK_ORES.diamond, quantity: 3 },
            { ore: MOCK_ORES.obsidian, quantity: 3 }
        ];
        const error = validateOreSelection(selection, 'weapon');
        expect(error).toBeNull();
    });

});

describe('Calculator Engine - Material Name', () => {

    // Test 30: Single ore = that ore name
    it('30. should return ore name for single ore selection', () => {
        const selection: SelectedOre[] = [{ ore: MOCK_ORES.diamond, quantity: 10 }];
        expect(getMaterialName(selection)).toBe('Diamond');
    });

    // Test 31: Highest quantity wins
    it('31. should use ore with highest quantity for material name', () => {
        const selection: SelectedOre[] = [
            { ore: MOCK_ORES.iron, quantity: 5 },
            { ore: MOCK_ORES.diamond, quantity: 10 }
        ];
        expect(getMaterialName(selection)).toBe('Diamond');
    });

    // Test 32: Tie goes to highest multiplier
    it('32. should use highest multiplier ore when quantities tied', () => {
        const selection: SelectedOre[] = [
            { ore: MOCK_ORES.iron, quantity: 5 },
            { ore: MOCK_ORES.diamond, quantity: 5 }
        ];
        expect(getMaterialName(selection)).toBe('Diamond');
    });

    // Test 33: Empty selection
    it('33. should return Unknown for empty selection', () => {
        expect(getMaterialName([])).toBe('Unknown');
    });

});

describe('Calculator Engine - Edge Cases', () => {

    // Test 34: Maximum weapon ores (51)
    it('34. should handle maximum weapon ore count (51)', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iceite, quantity: 51 }]);
        expect(result.totalOreCount).toBe(51);
        expect(result.totalMultiplier).toBe(10.5);
    });

    // Test 35: Maximum armor ores (45)
    it('35. should handle maximum typical armor ore count (45)', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.darkryte, quantity: 45 }]);
        expect(result.totalOreCount).toBe(45);
    });

    // Test 36: Very low multiplier
    it('36. should handle very low multiplier ores (0.2x)', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.stone, quantity: 10 }]);
        expect(result.totalMultiplier).toBe(0.2);
        expect(result.stability).toBeGreaterThan(99);
    });

    // Test 37: Very high multiplier
    it('37. should handle very high multiplier ores (25x)', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.gargantuan, quantity: 10 }]);
        expect(result.totalMultiplier).toBe(25.0);
        // 100 - (25 * 3) = 25, stability is 25 (not clamped to 10 for 25x)
        expect(result.stability).toBe(25);
    });

    // Test 38: Ore with null price
    it('38. should handle ores with null price', () => {
        const nullPriceOre = createOre({ slug: 'test', multiplier: 2.0, price: null });
        const result = calculateForgingStats([{ ore: nullPriceOre, quantity: 5 }]);
        expect(result.totalMultiplier).toBe(2.0);
    });

});

describe('Calculator Engine - Real Game Recipes', () => {

    // Test 39: High DPS Katana recipe
    it('39. should calculate high DPS Katana recipe correctly', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.eyeOre, quantity: 4 },
            { ore: MOCK_ORES.mythril, quantity: 4 },
            { ore: createOre({ slug: 'lightite', multiplier: 4.6, trait: '+15% movement speed' }), quantity: 4 }
        ]);
        expect(result.totalOreCount).toBe(12);
        expect(result.totalMultiplier).toBeCloseTo(4.03, 1);
        const katana = result.weaponProbabilities.find(p => p.category === 'Katana');
        expect(katana?.chance).toBeGreaterThanOrEqual(70);
    });

    // Test 40: Tank Heavy Armor recipe
    it('40. should calculate tank armor recipe correctly', () => {
        const result = calculateForgingStats([
            { ore: MOCK_ORES.darkryte, quantity: 12 },
            { ore: MOCK_ORES.obsidian, quantity: 12 },
            { ore: MOCK_ORES.mythril, quantity: 11 }
        ]);
        expect(result.totalOreCount).toBe(35);
        expect(result.activeTraits.length).toBe(3);
        const heavy = result.armorProbabilities.find(p => p.class === 'Heavy Armor');
        expect(heavy?.chance).toBeGreaterThanOrEqual(70);
    });

    // Test 41: Dragon Slayer attempt recipe
    it('41. should calculate Dragon Slayer recipe correctly', () => {
        const result = calculateForgingStats([
            { ore: createOre({ slug: 'arcane', multiplier: 7.5 }), quantity: 15 },
            { ore: createOre({ slug: 'demonite', multiplier: 5.5, trait: 'burn' }), quantity: 15 },
            { ore: MOCK_ORES.darkryte, quantity: 15 },
            { ore: MOCK_ORES.eyeOre, quantity: 6 }
        ]);
        expect(result.totalOreCount).toBe(51);
        const colossal = result.weaponProbabilities.find(p => p.category === 'Colossal');
        expect(colossal?.chance).toBeGreaterThanOrEqual(50);
    });

    // Test 42: Budget starter sword recipe
    it('42. should calculate budget sword recipe correctly', () => {
        const silver = createOre({ slug: 'silver', multiplier: 0.5 });
        const platinum = createOre({ slug: 'platinum', multiplier: 0.8 });
        const result = calculateForgingStats([
            { ore: silver, quantity: 5 },
            { ore: MOCK_ORES.gold, quantity: 5 },
            { ore: platinum, quantity: 5 }
        ]);
        expect(result.totalOreCount).toBe(15);
        expect(result.totalMultiplier).toBeCloseTo(0.65, 1);
    });

});

describe('Calculator Engine - Trait Name Extraction', () => {

    // Test 43: Defense trait
    it('43. should extract defense trait correctly', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.obsidian, quantity: 10 }]);
        const trait = result.activeTraits[0];
        expect(trait.traitName).toBe('Defense Boost');
    });

    // Test 44: Freeze trait
    it('44. should extract freeze trait correctly', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iceite, quantity: 10 }]);
        const trait = result.activeTraits[0];
        expect(trait.traitName).toBe('Freeze');
    });

    // Test 45: Dodge trait
    it('45. should extract dodge trait correctly', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.darkryte, quantity: 10 }]);
        const trait = result.activeTraits[0];
        expect(trait.traitName).toBe('Dodge');
    });

    // Test 46: AOE trait
    it('46. should extract AOE trait correctly', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.gargantuan, quantity: 10 }]);
        const trait = result.activeTraits[0];
        expect(trait.traitName).toBe('AOE Damage');
    });

});

describe('Calculator Engine - Probability Ranges', () => {

    // Test 47: Range 6-8 ores
    it('47. should have correct probabilities for 6-8 ore range', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.iron, quantity: 7 }]);
        expect(result.weaponProbabilities.length).toBeGreaterThan(0);
        const dagger = result.weaponProbabilities.find(p => p.category === 'Dagger');
        expect(dagger?.chance).toBe(50);
    });

    // Test 48: Range 15-20 ores
    it('48. should have correct probabilities for 15-20 ore range', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.diamond, quantity: 18 }]);
        const greatSword = result.weaponProbabilities.find(p => p.category === 'Great Sword');
        expect(greatSword?.chance).toBe(45);
    });

    // Test 49: Range 26-30 ores
    it('49. should have correct probabilities for 26-30 ore range', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.mythril, quantity: 28 }]);
        const axe = result.weaponProbabilities.find(p => p.category === 'Axe');
        expect(axe?.chance).toBe(35);
    });

    // Test 50: Range 31-40 ores
    it('50. should have correct probabilities for 31-40 ore range', () => {
        const result = calculateForgingStats([{ ore: MOCK_ORES.darkryte, quantity: 35 }]);
        const colossal = result.weaponProbabilities.find(p => p.category === 'Colossal');
        expect(colossal?.chance).toBe(40);
    });

});
