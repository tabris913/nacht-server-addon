import { NachtServerAddonItemTypes } from '../enums';
import { MinecraftItemTypes } from '../types/index';

import type { ItemType } from '@minecraft/server';

const HELMET_TYPES: Array<string> = [
  NachtServerAddonItemTypes.SilverHelmet,
  NachtServerAddonItemTypes.HolySilverHelmet,
  NachtServerAddonItemTypes.BlazeredSteelHelmet,
  NachtServerAddonItemTypes.HollowCrystalHelmet,
  NachtServerAddonItemTypes.NocturiumHelmet,
  NachtServerAddonItemTypes.LuminariumHelmet,
  NachtServerAddonItemTypes.TerramagniteHelmet,
  NachtServerAddonItemTypes.ElectrumHelmet,
  NachtServerAddonItemTypes.MagnosHelmet,
  NachtServerAddonItemTypes.AedriumHelmet,
  NachtServerAddonItemTypes.ScarletOrichalcumHelmet,
  NachtServerAddonItemTypes.StarIronHelmet,
  NachtServerAddonItemTypes.OrichalcumHelmet,
  NachtServerAddonItemTypes.MagradisHelmet,
  NachtServerAddonItemTypes.NexiatiteHelmet,
  NachtServerAddonItemTypes.SolistiteHelmet,
  NachtServerAddonItemTypes.AdamantiumHelmet,
  // invisible
  NachtServerAddonItemTypes.AdamantiumHelmetInvisible,
  NachtServerAddonItemTypes.AedriumHelmetInvisible,
  NachtServerAddonItemTypes.BlazeredSteelHelmetInvisible,
  NachtServerAddonItemTypes.ElectrumHelmetInvisible,
  NachtServerAddonItemTypes.HollowCrystalHelmetInvisible,
  NachtServerAddonItemTypes.HolySilverHelmetInvisible,
  NachtServerAddonItemTypes.LuminariumHelmetInvisible,
  NachtServerAddonItemTypes.MagnosHelmetInvisible,
  NachtServerAddonItemTypes.MagradisHelmetInvisible,
  NachtServerAddonItemTypes.NexiatiteHelmetInvisible,
  NachtServerAddonItemTypes.NocturiumHelmetInvisible,
  NachtServerAddonItemTypes.OrichalcumHelmetInvisible,
  NachtServerAddonItemTypes.ScarletOrichalcumHelmetInvisible,
  NachtServerAddonItemTypes.SilverHelmetInvisible,
  NachtServerAddonItemTypes.SolistiteHelmetInvisible,
  NachtServerAddonItemTypes.StarIronHelmetInvisible,
  NachtServerAddonItemTypes.TerramagniteHelmetInvisible,
];

const CHESTPLATE_TYPES: Array<string> = [
  NachtServerAddonItemTypes.SilverChestplate,
  NachtServerAddonItemTypes.HolySilverChestplate,
  NachtServerAddonItemTypes.BlazeredSteelChestplate,
  NachtServerAddonItemTypes.HollowCrystalChestplate,
  NachtServerAddonItemTypes.NocturiumChestplate,
  NachtServerAddonItemTypes.LuminariumChestplate,
  NachtServerAddonItemTypes.TerramagniteChestplate,
  NachtServerAddonItemTypes.ElectrumChestplate,
  NachtServerAddonItemTypes.MagnosChestplate,
  NachtServerAddonItemTypes.AedriumChestplate,
  NachtServerAddonItemTypes.ScarletOrichalcumChestplate,
  NachtServerAddonItemTypes.StarIronChestplate,
  NachtServerAddonItemTypes.OrichalcumChestplate,
  NachtServerAddonItemTypes.MagradisChestplate,
  NachtServerAddonItemTypes.NexiatiteChestplate,
  NachtServerAddonItemTypes.SolistiteChestplate,
  NachtServerAddonItemTypes.AdamantiumChestplate,
  // invisible
  NachtServerAddonItemTypes.AdamantiumChestplateInvisible,
  NachtServerAddonItemTypes.AedriumChestplateInvisible,
  NachtServerAddonItemTypes.BlazeredSteelChestplateInvisible,
  NachtServerAddonItemTypes.ElectrumChestplateInvisible,
  NachtServerAddonItemTypes.HollowCrystalChestplateInvisible,
  NachtServerAddonItemTypes.HolySilverChestplateInvisible,
  NachtServerAddonItemTypes.LuminariumChestplateInvisible,
  NachtServerAddonItemTypes.MagnosChestplateInvisible,
  NachtServerAddonItemTypes.MagradisChestplateInvisible,
  NachtServerAddonItemTypes.NexiatiteChestplateInvisible,
  NachtServerAddonItemTypes.NocturiumChestplateInvisible,
  NachtServerAddonItemTypes.OrichalcumChestplateInvisible,
  NachtServerAddonItemTypes.ScarletOrichalcumChestplateInvisible,
  NachtServerAddonItemTypes.SilverChestplateInvisible,
  NachtServerAddonItemTypes.SolistiteChestplateInvisible,
  NachtServerAddonItemTypes.StarIronChestplateInvisible,
  NachtServerAddonItemTypes.TerramagniteChestplateInvisible,
];

const LEGGINGS_TYPES: Array<string> = [
  NachtServerAddonItemTypes.SilverLeggings,
  NachtServerAddonItemTypes.HolySilverLeggings,
  NachtServerAddonItemTypes.BlazeredSteelLeggings,
  NachtServerAddonItemTypes.HollowCrystalLeggings,
  NachtServerAddonItemTypes.NocturiumLeggings,
  NachtServerAddonItemTypes.LuminariumLeggings,
  NachtServerAddonItemTypes.TerramagniteLeggings,
  NachtServerAddonItemTypes.ElectrumLeggings,
  NachtServerAddonItemTypes.MagnosLeggings,
  NachtServerAddonItemTypes.AedriumLeggings,
  NachtServerAddonItemTypes.ScarletOrichalcumLeggings,
  NachtServerAddonItemTypes.StarIronLeggings,
  NachtServerAddonItemTypes.OrichalcumLeggings,
  NachtServerAddonItemTypes.MagradisLeggings,
  NachtServerAddonItemTypes.NexiatiteLeggings,
  NachtServerAddonItemTypes.SolistiteLeggings,
  NachtServerAddonItemTypes.AdamantiumLeggings,
  // invisible
  NachtServerAddonItemTypes.AdamantiumLeggingsInvisible,
  NachtServerAddonItemTypes.AedriumLeggingsInvisible,
  NachtServerAddonItemTypes.BlazeredSteelLeggingsInvisible,
  NachtServerAddonItemTypes.ElectrumLeggingsInvisible,
  NachtServerAddonItemTypes.HollowCrystalLeggingsInvisible,
  NachtServerAddonItemTypes.HolySilverLeggingsInvisible,
  NachtServerAddonItemTypes.LuminariumLeggingsInvisible,
  NachtServerAddonItemTypes.MagnosLeggingsInvisible,
  NachtServerAddonItemTypes.MagradisLeggingsInvisible,
  NachtServerAddonItemTypes.NexiatiteLeggingsInvisible,
  NachtServerAddonItemTypes.NocturiumLeggingsInvisible,
  NachtServerAddonItemTypes.OrichalcumLeggingsInvisible,
  NachtServerAddonItemTypes.ScarletOrichalcumLeggingsInvisible,
  NachtServerAddonItemTypes.SilverLeggingsInvisible,
  NachtServerAddonItemTypes.SolistiteLeggingsInvisible,
  NachtServerAddonItemTypes.StarIronLeggingsInvisible,
  NachtServerAddonItemTypes.TerramagniteLeggingsInvisible,
];

const BOOTS_TYPES: Array<string> = [
  NachtServerAddonItemTypes.SilverBoots,
  NachtServerAddonItemTypes.HolySilverBoots,
  NachtServerAddonItemTypes.BlazeredSteelBoots,
  NachtServerAddonItemTypes.HollowCrystalBoots,
  NachtServerAddonItemTypes.NocturiumBoots,
  NachtServerAddonItemTypes.LuminariumBoots,
  NachtServerAddonItemTypes.TerramagniteBoots,
  NachtServerAddonItemTypes.ElectrumBoots,
  NachtServerAddonItemTypes.MagnosBoots,
  NachtServerAddonItemTypes.AedriumBoots,
  NachtServerAddonItemTypes.ScarletOrichalcumBoots,
  NachtServerAddonItemTypes.StarIronBoots,
  NachtServerAddonItemTypes.OrichalcumBoots,
  NachtServerAddonItemTypes.MagradisBoots,
  NachtServerAddonItemTypes.NexiatiteBoots,
  NachtServerAddonItemTypes.SolistiteBoots,
  NachtServerAddonItemTypes.AdamantiumBoots,
  // invisible
  NachtServerAddonItemTypes.AdamantiumBootsInvisible,
  NachtServerAddonItemTypes.AedriumBootsInvisible,
  NachtServerAddonItemTypes.BlazeredSteelBootsInvisible,
  NachtServerAddonItemTypes.ElectrumBootsInvisible,
  NachtServerAddonItemTypes.HollowCrystalBootsInvisible,
  NachtServerAddonItemTypes.HolySilverBootsInvisible,
  NachtServerAddonItemTypes.LuminariumBootsInvisible,
  NachtServerAddonItemTypes.MagnosBootsInvisible,
  NachtServerAddonItemTypes.MagradisBootsInvisible,
  NachtServerAddonItemTypes.NexiatiteBootsInvisible,
  NachtServerAddonItemTypes.NocturiumBootsInvisible,
  NachtServerAddonItemTypes.OrichalcumBootsInvisible,
  NachtServerAddonItemTypes.ScarletOrichalcumBootsInvisible,
  NachtServerAddonItemTypes.SilverBootsInvisible,
  NachtServerAddonItemTypes.SolistiteBootsInvisible,
  NachtServerAddonItemTypes.StarIronBootsInvisible,
  NachtServerAddonItemTypes.TerramagniteBootsInvisible,
];

const ARMOR_TYPES = [...BOOTS_TYPES, ...CHESTPLATE_TYPES, ...HELMET_TYPES, ...LEGGINGS_TYPES];

/**
 * Returns the set of armor types registered within addon.
 */
export class ArmorTypes {
  constructor(symbol: Symbol) {
    if (symbol != Symbol('private')) {
      throw new Error();
    }
  }

  /**
   * Returns a specific armor type, if available within addon.
   *
   * @param itemId
   * @returns
   */
  static get = (itemId: string | NachtServerAddonItemTypes) =>
    ARMOR_TYPES.includes(itemId) ? ({ id: itemId } as ItemType) : undefined;

  /**
   * Retrieves all available armor types registered within addon.
   *
   * @returns all available armor types registered within addon
   */
  static getAll = () => ARMOR_TYPES.map((armor) => ({ id: armor }) as ItemType);

  /**
   * Retrieves all available armor type ids registered within addon.
   *
   * @returns
   */
  static getAllIds = () => ARMOR_TYPES;
}

// TOOD Copper

const SWORD_TYPES: Array<string> = [
  MinecraftItemTypes.WoodenSword,
  MinecraftItemTypes.StoneSword,
  MinecraftItemTypes.IronSword,
  MinecraftItemTypes.DiamondSword,
  MinecraftItemTypes.NetheriteSword,
  NachtServerAddonItemTypes.SilverKnife,
  NachtServerAddonItemTypes.HolySilverKnife,
  NachtServerAddonItemTypes.BlazeredSteelSword,
  NachtServerAddonItemTypes.HollowCrystalSword,
  NachtServerAddonItemTypes.NocturiumSword,
  NachtServerAddonItemTypes.LuminariumSword,
  NachtServerAddonItemTypes.TerramagniteSword,
  NachtServerAddonItemTypes.ElectrumSword,
  NachtServerAddonItemTypes.MagnosSword,
  NachtServerAddonItemTypes.AedriumSword,
  NachtServerAddonItemTypes.ScarletOrichalcumSword,
  NachtServerAddonItemTypes.StarIronSword,
  NachtServerAddonItemTypes.OrichalcumSword,
  NachtServerAddonItemTypes.MagradisSword,
  NachtServerAddonItemTypes.NexiatiteSword,
  NachtServerAddonItemTypes.SolistiteSword,
  NachtServerAddonItemTypes.AdamantiumSword,
];

const AXE_TYPES: Array<string> = [
  NachtServerAddonItemTypes.ElectrumAxe,
  NachtServerAddonItemTypes.ScarletOrichalcumAxe,
  NachtServerAddonItemTypes.StarIronAxe,
  NachtServerAddonItemTypes.OrichalcumAxe,
  NachtServerAddonItemTypes.AdamantiumAxe,
];

const PICKAXE_TYPES: Array<string> = [
  NachtServerAddonItemTypes.SilverPickaxe,
  NachtServerAddonItemTypes.HolySilverPickaxe,
  NachtServerAddonItemTypes.ElectrumPickaxe,
  NachtServerAddonItemTypes.ScarletOrichalcumPickaxe,
  NachtServerAddonItemTypes.StarIronPickaxe,
  NachtServerAddonItemTypes.OrichalcumPickaxe,
  NachtServerAddonItemTypes.AdamantiumPickaxe,
];

const SHOVEL_TYPES: Array<string> = [
  NachtServerAddonItemTypes.ElectrumShovel,
  NachtServerAddonItemTypes.ScarletOrichalcumShovel,
  NachtServerAddonItemTypes.StarIronShovel,
  NachtServerAddonItemTypes.OrichalcumShovel,
  NachtServerAddonItemTypes.AdamantiumShovel,
];

const HOE_TYPES: Array<string> = [
  NachtServerAddonItemTypes.ElectrumHoe,
  NachtServerAddonItemTypes.ScarletOrichalcumHoe,
  NachtServerAddonItemTypes.StarIronHoe,
  NachtServerAddonItemTypes.OrichalcumHoe,
  NachtServerAddonItemTypes.AdamantiumHoe,
];

const TOOL_TYPES = [...SWORD_TYPES, ...AXE_TYPES, ...PICKAXE_TYPES, ...SHOVEL_TYPES, ...HOE_TYPES];

/**
 * Returns the set of tool types registered within addon.
 */
export class ToolTypes {
  constructor(symbol: Symbol) {
    if (symbol != Symbol('private')) {
      throw new Error();
    }
  }

  /**
   * Returns a specific tool type, if available within addon.
   *
   * @param itemId
   * @returns
   */
  static get = (itemId: string | NachtServerAddonItemTypes) =>
    TOOL_TYPES.includes(itemId) ? ({ id: itemId } as ItemType) : undefined;

  /**
   * Retrieves all available tool types registered within addon.
   *
   * @returns all available tool types registered within addon
   */
  static getAll = () => TOOL_TYPES.map((tool) => ({ id: tool }) as ItemType);

  /**
   * Retrieves all available tool type ids registered within addon.
   *
   * @returns
   */
  static getAllIds = () => TOOL_TYPES;
}
