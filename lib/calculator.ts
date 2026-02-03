import { SelectedOre, ForgingResult } from '@/types';
import probabilitiesData from '@/data/v20260201/probabilities.json';

// Weapon probability table type
type WeaponProbabilities = Record<string, Record<string, number>>;
type ArmorProbabilities = Record<string, Record<string, number>>;

const WEAPON_PROBS = probabilitiesData.weaponProbabilityByOreCount as WeaponProbabilities;
const ARMOR_PROBS = probabilitiesData.armorProbabilityByOreCount as ArmorProbabilities;

// Category colors
const WEAPON_CATEGORY_COLORS: Record<string, string> = {
    'Dagger': '#94A3B8',
    'Gauntlet': '#F97316',
    'Straight Sword': '#3B82F6',
    'Katana': '#EC4899',
    'Axe': '#84CC16',
    'Mace': '#8B5CF6',
    'Spear': '#06B6D4',
    'Great Sword': '#F59E0B',
    'Great Axe': '#EF4444',
    'Colossal': '#A855F7',
    'Heavy Weapons': '#DC2626',
    'Other': '#6B7280'
};

const ARMOR_CLASS_COLORS: Record<string, string> = {
    'Light Armor': '#94A3B8',
    'Medium Armor': '#3B82F6',
    'Heavy Armor': '#F59E0B'
};

/**
 * Get the appropriate probability range key based on ore count
 */
function getWeaponProbabilityRange(oreCount: number): string {
    if (oreCount >= 3 && oreCount <= 5) return '3-5';
    if (oreCount >= 6 && oreCount <= 8) return '6-8';
    if (oreCount >= 9 && oreCount <= 11) return '9-11';
    if (oreCount >= 12 && oreCount <= 14) return '12-14';
    if (oreCount >= 15 && oreCount <= 20) return '15-20';
    if (oreCount >= 21 && oreCount <= 25) return '21-25';
    if (oreCount >= 26 && oreCount <= 30) return '26-30';
    if (oreCount >= 31 && oreCount <= 40) return '31-40';
    if (oreCount >= 41 && oreCount <= 51) return '41-51';
    return '3-5'; // Default
}

function getArmorProbabilityRange(oreCount: number): string {
    if (oreCount >= 3 && oreCount <= 10) return '3-10';
    if (oreCount >= 11 && oreCount <= 20) return '11-20';
    if (oreCount >= 21 && oreCount <= 30) return '21-30';
    if (oreCount >= 31 && oreCount <= 45) return '31-45';
    return '3-10'; // Default
}

/**
 * Calculate forging statistics based on selected ores and quantities
 * 
 * PRD Requirements:
 * - Support up to 4 different ore types
 * - Total ore count: 3-51 for weapons, 3-45 for armor
 * - Trait activation: 10% minimum, 30% optimal
 * - Use real probability tables from game data
 */
export function calculateForgingStats(selectedOres: SelectedOre[]): ForgingResult {
    // Handle empty input
    if (selectedOres.length === 0) {
        return {
            totalMultiplier: 0,
            stability: 100,
            totalOreCount: 0,
            activeTraits: [],
            weaponProbabilities: [],
            armorProbabilities: []
        };
    }

    // Calculate total ore count
    const totalOreCount = selectedOres.reduce((sum, item) => sum + item.quantity, 0);

    // Validate constraints
    if (totalOreCount < 3) {
        return {
            totalMultiplier: 0,
            stability: 100,
            totalOreCount,
            activeTraits: [],
            weaponProbabilities: [],
            armorProbabilities: []
        };
    }

    // 1. Calculate Average Multiplier
    // Formula: Sum of (ore.multiplier * quantity) / Total ore count
    const sumMultiplier = selectedOres.reduce(
        (sum, item) => sum + (item.ore.multiplier * item.quantity), 
        0
    );
    const avgMultiplier = Number((sumMultiplier / totalOreCount).toFixed(2));

    // 2. Calculate Stability
    // Higher multiplier = lower stability (heuristic)
    // Base 100, -3% per 1.0 multiplier
    const stability = Math.max(10, Math.min(100, 100 - (avgMultiplier * 3)));

    // 3. Calculate Trait Activation
    // Trait activates at 10% composition minimum, optimal at 30%
    const activeTraits = selectedOres
        .filter(item => item.ore.trait !== null)
        .map(item => {
            const percentOfTotal = (item.quantity / totalOreCount) * 100;
            
            // Activation Logic: Start at 10%, Max at 30%
            if (percentOfTotal < 10) return null;

            let strength = 0;
            if (percentOfTotal >= 30) {
                strength = 100;
            } else {
                // Linear interpolation between 10% and 30%
                strength = ((percentOfTotal - 10) / (30 - 10)) * 100;
            }

            // Extract trait name from trait description
            const traitDesc = item.ore.trait || '';
            const traitName = extractTraitName(traitDesc);

            return {
                trait: traitDesc,
                traitName,
                percentage: Math.round(strength),
                sourceOre: item.ore.name
            };
        })
        .filter((t): t is NonNullable<typeof t> => t !== null);

    // 4. Calculate Weapon Probabilities based on ore count
    const weaponRange = getWeaponProbabilityRange(totalOreCount);
    const weaponProbs = WEAPON_PROBS[weaponRange] || {};
    const weaponProbabilities = Object.entries(weaponProbs).map(([category, chance]) => ({
        category,
        chance: Number(chance),
        color: WEAPON_CATEGORY_COLORS[category] || '#6B7280'
    })).sort((a, b) => b.chance - a.chance);

    // 5. Calculate Armor Probabilities based on ore count
    const armorRange = getArmorProbabilityRange(totalOreCount);
    const armorProbs = ARMOR_PROBS[armorRange] || {};
    const armorProbabilities = Object.entries(armorProbs).map(([armorClass, chance]) => ({
        class: armorClass,
        chance: Number(chance),
        color: ARMOR_CLASS_COLORS[armorClass] || '#6B7280'
    })).sort((a, b) => b.chance - a.chance);

    return {
        totalMultiplier: avgMultiplier,
        stability: Number(stability.toFixed(1)),
        totalOreCount,
        activeTraits,
        weaponProbabilities,
        armorProbabilities
    };
}

/**
 * Extract a short trait name from a trait description
 */
function extractTraitName(traitDesc: string): string {
    if (!traitDesc) return 'Unknown';
    
    // Common patterns - order matters! More specific patterns first
    if (traitDesc.includes('AOE') || traitDesc.includes('explosion')) return 'AOE Damage';
    if (traitDesc.includes('defense')) return 'Defense Boost';
    if (traitDesc.includes('damage') && traitDesc.includes('weapon')) return 'Weapon Damage';
    if (traitDesc.includes('movement speed')) return 'Speed Boost';
    if (traitDesc.includes('vitality')) return 'Vitality';
    if (traitDesc.includes('dodge')) return 'Dodge';
    if (traitDesc.includes('burn')) return 'Burn';
    if (traitDesc.includes('freeze')) return 'Freeze';
    if (traitDesc.includes('slow')) return 'Slow';
    if (traitDesc.includes('poison')) return 'Poison';
    if (traitDesc.includes('crit')) return 'Critical Strike';
    if (traitDesc.includes('health') || traitDesc.includes('HP')) return 'Health Mod';
    if (traitDesc.includes('lifesteal')) return 'Lifesteal';
    if (traitDesc.includes('lethality')) return 'Lethality';
    if (traitDesc.includes('attack speed')) return 'Attack Speed';
    if (traitDesc.includes('stamina') || traitDesc.includes('endurance')) return 'Endurance';
    
    // Return first part if nothing matches
    const firstPart = traitDesc.split(',')[0].trim();
    return firstPart.length > 20 ? firstPart.substring(0, 20) + '...' : firstPart;
}

/**
 * Validate ore selection constraints
 * Returns error message if invalid, null if valid
 */
export function validateOreSelection(
    selectedOres: SelectedOre[], 
    craftingType: 'weapon' | 'armor'
): string | null {
    const totalOreCount = selectedOres.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueOreTypes = selectedOres.length;

    // Check max ore types (4)
    if (uniqueOreTypes > 4) {
        return 'Maximum 4 different ore types allowed';
    }

    // Check min ores
    if (totalOreCount < 3) {
        return 'Minimum 3 ores required to craft';
    }

    // Check max ores based on crafting type
    const maxOres = craftingType === 'weapon' ? 51 : 45;
    if (totalOreCount > maxOres) {
        return `Maximum ${maxOres} ores for ${craftingType}s`;
    }

    return null;
}

/**
 * Get material name based on ore composition
 * Rule: Based on ore with highest quantity. If tied, based on highest multiplier ore.
 */
export function getMaterialName(selectedOres: SelectedOre[]): string {
    if (selectedOres.length === 0) return 'Unknown';

    // Sort by quantity (desc), then by multiplier (desc)
    const sorted = [...selectedOres].sort((a, b) => {
        if (b.quantity !== a.quantity) return b.quantity - a.quantity;
        return b.ore.multiplier - a.ore.multiplier;
    });

    return sorted[0].ore.name;
}

/**
 * Calculate estimated damage for weapons
 */
export function calculateEstimatedDamage(
    baseDamage: number,
    oreMultiplier: number,
    quality: number = 1.0
): { min: number; max: number; average: number } {
    const damage = baseDamage * oreMultiplier * quality;
    return {
        min: Math.floor(damage * 0.85),
        max: Math.ceil(damage * 1.15),
        average: Math.round(damage)
    };
}

/**
 * Calculate estimated defense for armor
 */
export function calculateEstimatedDefense(
    baseDefense: number,
    oreMultiplier: number,
    quality: number = 1.0
): { min: number; max: number; average: number } {
    const defense = baseDefense * oreMultiplier * quality;
    return {
        min: Math.floor(defense * 0.9),
        max: Math.ceil(defense * 1.1),
        average: Math.round(defense)
    };
}
