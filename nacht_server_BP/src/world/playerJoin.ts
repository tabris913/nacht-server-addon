import { GameMode, type Player, type PlayerSpawnAfterEventSignal, world } from '@minecraft/server';

import {
  CURRENT_VERSION,
  SCOREBOARD_POINT,
  TAG_AREA_BASE,
  TAG_AREA_EXPL,
  TAG_AREA_TOWN,
  TAG_ITEM,
  TAG_OP_DEV,
  TAG_OP_PLAY,
  TAG_OPERATOR,
  TAG_VERSION,
} from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { compareVersion } from '../utils/version';

const playerJoinEvent: Parameters<PlayerSpawnAfterEventSignal['subscribe']>[0] = (event) => {
  Logger.info(`${event.player.name} is joined.`);
  // world.sendMessage(`${event.playerName} さんが参加しました`);

  const player = event.player;
  if (player) {
    // ポイント有効化
    const score = ScoreboardUtils.getScore(player, SCOREBOARD_POINT);
    if (score === undefined) {
      ScoreboardUtils.setScore(player, SCOREBOARD_POINT, 0);
      Logger.log(`${player.nameTag}'s scoreboard ${SCOREBOARD_POINT} is enabled.`);
    } else {
      Logger.log(`${player.nameTag}'s scoreboard ${SCOREBOARD_POINT} has already enabled.`);
    }

    // エリアタグ
    if (!(player.hasTag(TAG_AREA_BASE) || player.hasTag(TAG_AREA_EXPL) || player.hasTag(TAG_AREA_TOWN))) {
      player.addTag(TAG_AREA_TOWN);
    }

    // バージョンタグ
    checkVersionTag(player);

    // その他
    if (player.hasTag(TAG_ITEM + 'nexiatitie_tier')) {
      // ネクシアイトティアタグ誤字修正
      player.removeTag(TAG_ITEM + 'nexiatitie_tier');
      player.addTag(TAG_ITEM + 'nexiatite_tier');
    }

    // オペレーターゲームモード
    if (player.hasTag(TAG_OPERATOR) && !(player.hasTag(TAG_OP_DEV) || player.hasTag(TAG_OP_PLAY))) {
      switch (player?.getGameMode()) {
        case GameMode.Adventure:
        case GameMode.Survival:
          player.addTag(TAG_OP_PLAY);
          Logger.log(`${player.nameTag} is initialized to play mode.`);
          break;
        case GameMode.Creative:
        case GameMode.Spectator:
          player.addTag(TAG_OP_DEV);
          Logger.log(`${player.nameTag} is initialized to development mode.`);
          break;
      }
    }
  } else {
    Logger.warning(`Entity ${event.player.id} cannot be gotten.`);
  }
};

const checkVersionTag = (entity: Player) => {
  const versionTag = entity.getTags().find((tag) => tag.startsWith(TAG_VERSION));
  const thisVersion = TAG_VERSION + CURRENT_VERSION.join('.');
  Logger.info(`${versionTag} ${thisVersion}`);
  if (versionTag === undefined || versionTag !== thisVersion) {
    if (versionTag) entity.removeTag(versionTag);
    entity.addTag(thisVersion);

    dispatchVersionChangeEvent(entity, {
      oldVersion: versionTag
        ?.replace(TAG_VERSION, '')
        .split('.')
        .map((v) => parseInt(v)) as [number, number, number],
    });
  }
};

const dispatchVersionChangeEvent = (player: Player, { oldVersion }: { oldVersion?: [number, number, number] }) => {
  if (oldVersion === undefined || compareVersion(oldVersion, [1, 1, 2]) < 0) {
    // 鉱石追加
    InventoryUtils.giveItem(player, NachtServerAddonItemTypes.GuideBookOres);
  }
};

export default () => world.afterEvents.playerSpawn.subscribe(playerJoinEvent);
