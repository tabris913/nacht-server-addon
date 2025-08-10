import { world } from '@minecraft/server';

import { TAG_ITEM } from '../const';
import { NachtServerAddonItemTypes } from '../enums';

export default () =>
  world.afterEvents.playerInventoryItemChange.subscribe((event) => {
    switch (event.itemStack?.typeId) {
      case NachtServerAddonItemTypes.HolyWater:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.HolyWater);
        break;
      case NachtServerAddonItemTypes.Aether:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.Aether);
        break;
      case NachtServerAddonItemTypes.CondensedAether:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.CondensedAether);
        break;
      case NachtServerAddonItemTypes.PoorElixir:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.PoorElixir);
        break;
      case NachtServerAddonItemTypes.Elixir:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.Elixir);
        break;
      case NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum);
        break;
      case NachtServerAddonItemTypes.LapisPhilosophorum:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.LapisPhilosophorum);
        break;
      case NachtServerAddonItemTypes.InvertiaCore:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.InvertiaCore);
        break;
      case NachtServerAddonItemTypes.AntiWitherCore:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.AntiWitherCore);
        break;
      case NachtServerAddonItemTypes.AntiEnderCore:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.AntiEnderCore);
        break;
      case NachtServerAddonItemTypes.Stellavita:
        event.player.addTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita);
        break;
      case undefined:
        break;
      default:
        if (event.itemStack?.typeId.includes('holy_silver')) {
          event.player.addTag(TAG_ITEM + 'holy_silver_tier');
        } else if (event.itemStack?.typeId.includes('silver')) {
          event.player.addTag(TAG_ITEM + 'silver_tier');
        } else if (event.itemStack?.typeId.includes('blazered_steel')) {
          event.player.addTag(TAG_ITEM + 'blazered_steel_tier');
        } else if (event.itemStack?.typeId.includes('hollow_crystal')) {
          event.player.addTag(TAG_ITEM + 'hollow_crystal_tier');
        } else if (event.itemStack?.typeId.includes('nocturium')) {
          event.player.addTag(TAG_ITEM + 'nocturium_tier');
        } else if (event.itemStack?.typeId.includes('luminarium')) {
          event.player.addTag(TAG_ITEM + 'luminarium_tier');
        } else if (event.itemStack?.typeId.includes('terramagnite')) {
          event.player.addTag(TAG_ITEM + 'terramagnite_tier');
        } else if (event.itemStack?.typeId.includes('electrum')) {
          event.player.addTag(TAG_ITEM + 'electrum_tier');
        } else if (event.itemStack?.typeId.includes('magnos')) {
          event.player.addTag(TAG_ITEM + 'magnos_tier');
        } else if (event.itemStack?.typeId.includes('aedrium')) {
          event.player.addTag(TAG_ITEM + 'aedrium_tier');
        } else if (event.itemStack?.typeId.includes('star_iron')) {
          event.player.addTag(TAG_ITEM + 'star_iron_tier');
        } else if (event.itemStack?.typeId.includes('scarlet_orichalcum')) {
          event.player.addTag(TAG_ITEM + 'scarlet_orichalcum_tier');
        } else if (event.itemStack?.typeId.includes('orichalcum')) {
          event.player.addTag(TAG_ITEM + 'orichalcum_tier');
        } else if (event.itemStack?.typeId.includes('magradis') || event.itemStack?.typeId.includes('ruin_lump')) {
          event.player.addTag(TAG_ITEM + 'magradis_tier');
        } else if (
          event.itemStack?.typeId.includes('nexiatitie') ||
          event.itemStack?.typeId.includes('endrift_lump')
        ) {
          event.player.addTag(TAG_ITEM + 'nexiatitie_tier');
        } else if (event.itemStack?.typeId.includes('solistite')) {
          event.player.addTag(TAG_ITEM + 'solistite_tier');
        } else if (event.itemStack?.typeId.includes('adamantium')) {
          event.player.addTag(TAG_ITEM + 'adamantium_tier');
        }
    }
  });
