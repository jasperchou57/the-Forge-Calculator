import data from '@/data/v20260201/ores.json';
import type { CraftingMode, Ore, OreTraits } from '@/types';

const colors: Record<string, string> = data.rarityColors;

export const MIX_AVERAGE_DESCRIPTION = 'Bismuth and Fichilliumorite add to your ore count and copy the weighted average of any regular ores. In recipes made entirely from these two ore types, each Bismuth counts as 8× and each Fichilliumorite as 1×.';

export function traitForMode(ore: Ore, mode: CraftingMode): string | null {
    if (!ore.traits) return ore.trait;
    return [ore.traits.both, ore.traits[mode]].filter(Boolean).join(' ') || null;
}

export const ALL_ORES: Ore[] = data.ores.map(raw => {
    const traits: OreTraits | undefined = raw.traits;
    const description = traits && [
        traits.both,
        traits.weapon && `Weapon: ${traits.weapon}`,
        traits.armor && `Armor: ${traits.armor}`
    ].filter(Boolean).join(' ');
    return {
        ...raw,
        rarity: raw.rarity as Ore['rarity'],
        color: colors[raw.rarity],
        trait: description || null
    };
});
