export interface NavItem {
    label: string;
    href: string;
    isNew?: boolean;
}

// Rarity tiers as per game data
export type OreRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Divine' | 'Relic' | 'Exotic';

// Game locations/worlds
export type GameLocation = 
    | "Stonewake's Cross" 
    | "Forgotten Kingdom" 
    | "Goblin Cave" 
    | "Frostspire Expanse" 
    | "The Peak" 
    | "Enemy Drop" 
    | "Boss Drop"
    | string;

export interface TraitEffect {
    name: string;
    effect: string;
    minPercent?: number;
    optimalPercent?: number;
}

export interface Ore {
    slug: string;
    name: string;
    rarity: OreRarity;
    chance: string; // e.g. "1/500"
    multiplier: number;
    price: number | null;
    color: string;
    location: GameLocation;
    trait: string | null; // Trait description or null
    rocks: string[]; // Rock types where ore can be found
    // Computed/derived fields
    traitEffect?: TraitEffect;
}

// Selected ore with quantity for forging
export interface SelectedOre {
    ore: Ore;
    quantity: number;
}

export interface Weapon {
    slug: string;
    name: string;
    category: string;
    chance: string; // e.g. "1/4"
    damage: number;
    speed: number;
    range: number;
    price: number;
}

export interface WeaponCategory {
    name: string;
    oreRange: string;
    description: string;
    weapons: Weapon[];
}

export interface Armor {
    slug: string;
    name: string;
    type: 'Helmet' | 'Chestplate' | 'Leggings';
    class: 'Light' | 'Medium' | 'Heavy';
    variant?: string; // e.g. "Samurai", "Viking", "Knight"
    healthBonus: string;
    basePrice: number;
    oreRequired: string;
}

// Forging result from calculator
export interface ForgingResult {
    totalMultiplier: number;
    stability: number;
    totalOreCount: number;
    activeTraits: {
        trait: string;
        traitName: string;
        percentage: number; // 0-100% effectiveness
        sourceOre: string;
    }[];
    weaponProbabilities: {
        category: string;
        chance: number;
        color: string;
    }[];
    armorProbabilities: {
        class: string;
        chance: number;
        color: string;
    }[];
    estimatedDamage?: {
        min: number;
        max: number;
        average: number;
    };
    estimatedDefense?: {
        min: number;
        max: number;
        average: number;
    };
}

export interface StatResult {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    color: string;
}

export interface UpdateLog {
    version: string;
    date: string;
    changes: string[];
}

// Probability tables
export interface WeaponProbabilityRange {
    oreRange: string;
    probabilities: Record<string, number>;
}

export interface ArmorProbabilityRange {
    oreRange: string;
    probabilities: Record<string, number>;
}

// Data version metadata
export interface DataVersion {
    version: string;
    date: string;
    totalOres: number;
    totalWeapons: number;
    totalArmor: number;
    sources: string[];
}
