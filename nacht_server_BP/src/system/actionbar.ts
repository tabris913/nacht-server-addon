import {
  BlockTypes,
  type DimensionLocation,
  type Player,
  PlayerPermissionLevel,
  type RawMessage,
  system,
  world,
} from '@minecraft/server';

import { Formatting, PREFIX_PLAYERNAME, PREFIX_TITLE } from '../const';
import { MinecraftBlockTypes, MinecraftEntityTypes } from '../types/index';
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

    if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
      content.push('\nEntity Id: ', entity.typeId);
      content.push('\nEntity Localization Key: ', entity.localizationKey);
    }
  } else {
    // Look at a block
    const block = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
    if (block !== undefined && block.isValid) {
      if (
        ![MinecraftBlockTypes.Barrier, MinecraftBlockTypes.StructureVoid].includes(block.typeId as MinecraftBlockTypes)
      ) {
        content.push({ text: '\nLook at ' }, { translate: block.localizationKey });
      }

      if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
        content.push('\nBlock Id: ', block.typeId);
        content.push('\nBlock Localization Key: ', block.localizationKey);
      }
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
