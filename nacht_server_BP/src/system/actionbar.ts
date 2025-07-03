import { DimensionLocation, Player, RawMessage, system, world } from '@minecraft/server';

import { PREFIX_PLAYERNAME } from '../const';
import { MinecraftEntityTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import BaseUtils from '../utils/BaseUtils';

const show = (player: Player) => {
  const entity = player.getEntitiesFromViewDirection({ maxDistance: 10 })[0]?.entity;
  const dimLoc: DimensionLocation = { ...player.location, dimension: player.dimension };
  const base = BaseUtils.findByLocation(dimLoc);
  const content: Array<RawMessage | string> = [
    {
      text:
        '現在地: ' +
        (AreaUtils.isInBaseArea(dimLoc)
          ? '拠点エリア'
          : AreaUtils.isInExploringArea(dimLoc)
            ? '探索エリア'
            : '街エリア'),
    },
    {
      text:
        base !== undefined
          ? `\n拠点: ${base.name} (所有者: ${world.getDynamicProperty(`${PREFIX_PLAYERNAME}${base.owner}`) || base.owner})`
          : '',
    },
  ];
  if (entity !== undefined && entity.isValid) {
    if (entity.typeId === MinecraftEntityTypes.Player) {
      content.push({
        text: `\n${entity.nameTag}: ${world.getDynamicProperty(`${PREFIX_PLAYERNAME}${entity.nameTag}`) || '未設定'}`,
      });
    } else {
      content.push({ text: `\nView at ` }, { translate: entity.localizationKey });
    }
  } else {
    const block = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
    if (block !== undefined && block.isValid) {
      content.push({ text: '\nView at ' }, { translate: block.localizationKey });
    }
  }

  player.onScreenDisplay.setActionBar(content);
};

export default () => {
  system.runInterval(() => {
    system.runJob(
      (function* () {
        for (const player of world.getAllPlayers()) {
          yield show(player);
        }
      })()
    );
  });
};
