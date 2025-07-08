import { BlockTypes, type DimensionLocation, type Player, type RawMessage, system, world } from '@minecraft/server';

import { Formatting, PREFIX_PLAYERNAME, PREFIX_TITLE } from '../const';
import { MinecraftEntityTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import BaseUtils from '../utils/BaseUtils';

const show = (player: Player, blocks: Array<string>) => {
  const dimLoc: DimensionLocation = { ...player.location, dimension: player.dimension };
  const content: Array<RawMessage | string> = [];

  // Area info
  content.push({
    text:
      '現在地: ' +
      (AreaUtils.isInBaseArea(dimLoc) ? '拠点エリア' : AreaUtils.isInExploringArea(dimLoc) ? '探索エリア' : '街エリア'),
  });

  // Base info
  const base = BaseUtils.findByLocation(dimLoc);
  if (base !== undefined) {
    const ownerName = world.getDynamicProperty(PREFIX_PLAYERNAME + base.owner) || base.owner;
    content.push({ text: `\n拠点: ${base.name} (所有者: ${ownerName})` });
  }

  const entity = player.getEntitiesFromViewDirection({ maxDistance: 10 })[0]?.entity;
  if (entity !== undefined && entity.isValid) {
    // Look at an entity
    switch (entity.typeId) {
      case MinecraftEntityTypes.Player:
        content.push({
          text: `\n${entity.nameTag}: ${world.getDynamicProperty(PREFIX_PLAYERNAME + entity.nameTag) || '未設定'}`,
        });
        break;
      case MinecraftEntityTypes.Npc:
        content.push({ text: `\nLook at ${entity.nameTag || 'NPC'}` });
        break;
      default:
        content.push({ text: `\nLook at ` }, { translate: entity.localizationKey });
    }

    /// 称号
    const tags = entity.getTags().filter((tag) => tag.startsWith('TAG_'));
    if (tags.length > 0) {
      const tagToDisplay = world.getDynamicProperty(PREFIX_TITLE + entity.nameTag) as string | undefined;
      if (tagToDisplay === undefined) {
        content.push({ text: `\n${Formatting.Color.AQUA}${tags.at(tags.length % world.getDay())}${Formatting.Reset}` });
      } else {
        content.push({ text: `\n${Formatting.Color.AQUA}${tagToDisplay}${Formatting.Reset}` });
      }
    }
  } else {
    // Look at a block
    const block = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
    if (block !== undefined && block.isValid) {
      content.push({ text: '\nLook at ' }, { translate: block.localizationKey });
    }
  }

  player.onScreenDisplay.setActionBar(content);
};

export default () =>
  system.run(() => {
    const BLOCK_TYPES = BlockTypes.getAll().map((bt) => bt.id);

    system.runInterval(() => {
      system.runJob(
        (function* () {
          for (const player of world.getAllPlayers()) {
            yield show(player, BLOCK_TYPES);
          }
        })()
      );
    });
  });
