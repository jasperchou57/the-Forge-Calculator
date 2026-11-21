import data from '@/data/v20260201/ores.json';
import type { CraftingMode, Ore, OreTraits } from '@/types';

const colors: Record<string, string> = data.rarityColors;

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
