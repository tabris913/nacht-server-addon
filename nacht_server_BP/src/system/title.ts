import { type Player, system, TicksPerSecond, world } from '@minecraft/server';

import {
  Formatting,
  PREFIX_PLAYERNAME,
  PREFIX_TITLE,
  SCOREBOARD_POINT,
  TAG_OP_DEV,
  TAG_OPERATOR,
  TAG_TITLE_BILLIONAIRE,
  TAG_TITLE_FIRST_BILLIONAIRE,
  TAG_TITLE_FIRST_MILLIONAIRE,
  TAG_TITLE_MILLIONAIRE,
  TAG_TITLE_NACHT_HALO,
  TAG_TITLE_NACHT_LEFT_WING,
  TAG_TITLE_NACHT_RIGHT_WING,
  TAG_TITLE_NACHT_TAIL,
  Titles,
} from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';

const score = (player: Player) => {
  const score = ScoreboardUtils.getScore(player, SCOREBOARD_POINT);
  if (score !== undefined) {
    if (score >= 1_000_000) {
      // 大富豪
      if (!player.hasTag(TAG_TITLE_MILLIONAIRE)) {
        player.addTag(TAG_TITLE_MILLIONAIRE);
        player.onScreenDisplay.setTitle(
          `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_MILLIONAIRE]}${Formatting.Reset}」獲得`
        );
        world.sendMessage(
          `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_MILLIONAIRE]}」を獲得しました。`
        );
      }
      // はじめての大富豪
      if (world.getDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_MILLIONAIRE) === undefined) {
        player.addTag(TAG_TITLE_FIRST_MILLIONAIRE);
        world.setDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_MILLIONAIRE, player.nameTag);
        system.waitTicks(TicksPerSecond * 5).then(() => {
          player.onScreenDisplay.setTitle(
            `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_FIRST_MILLIONAIRE]}${Formatting.Reset}」獲得`
          );
          world.sendMessage(
            `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_FIRST_MILLIONAIRE]}」を獲得しました。`
          );
        });
      }
    }
    if (score >= 1_000_000_000) {
      // 億万長者
      if (!player.hasTag(TAG_TITLE_BILLIONAIRE)) {
        player.addTag(TAG_TITLE_BILLIONAIRE);
        player.onScreenDisplay.setTitle(
          `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_BILLIONAIRE]}${Formatting.Reset}」獲得`
        );
        world.sendMessage(
          `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_BILLIONAIRE]}」を獲得しました。`
        );
      }
      // はじめての億万長者
      if (world.getDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_BILLIONAIRE) === undefined) {
        player.addTag(TAG_TITLE_FIRST_BILLIONAIRE);
        world.setDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_BILLIONAIRE, player.nameTag);
        system.waitTicks(TicksPerSecond * 5).then(() => {
          player.onScreenDisplay.setTitle(
            `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_FIRST_BILLIONAIRE]}${Formatting.Reset}」獲得`
          );
          world.sendMessage(
            `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_FIRST_BILLIONAIRE]}」を獲得しました。`
          );
        });
      }
    }
  }
};

const item = (player: Player) => {
  if (InventoryUtils.hasItem(player, NachtServerAddonItemTypes.NachtHalo) && !player.hasTag(TAG_TITLE_NACHT_HALO)) {
    player.addTag(TAG_TITLE_NACHT_HALO);
    player.onScreenDisplay.setTitle(
      `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_NACHT_HALO]}${Formatting.Reset}」獲得`
    );
    world.sendMessage(
      `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_NACHT_HALO]}」を獲得しました。`
    );
  }
  if (
    InventoryUtils.hasItem(player, NachtServerAddonItemTypes.NachtLeftWing) &&
    !player.hasTag(TAG_TITLE_NACHT_LEFT_WING)
  ) {
    player.addTag(TAG_TITLE_NACHT_LEFT_WING);
    player.onScreenDisplay.setTitle(
      `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_NACHT_LEFT_WING]}${Formatting.Reset}」獲得`
    );
    world.sendMessage(
      `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_NACHT_LEFT_WING]}」を獲得しました。`
    );
  }
  if (
    InventoryUtils.hasItem(player, NachtServerAddonItemTypes.NachtRightWing) &&
    !player.hasTag(TAG_TITLE_NACHT_RIGHT_WING)
  ) {
    player.addTag(TAG_TITLE_NACHT_RIGHT_WING);
    player.onScreenDisplay.setTitle(
      `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_NACHT_RIGHT_WING]}${Formatting.Reset}」獲得`
    );
    world.sendMessage(
      `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_NACHT_RIGHT_WING]}」を獲得しました。`
    );
  }
  if (InventoryUtils.hasItem(player, NachtServerAddonItemTypes.NachtTail) && !player.hasTag(TAG_TITLE_NACHT_TAIL)) {
    player.addTag(TAG_TITLE_NACHT_TAIL);
    player.onScreenDisplay.setTitle(
      `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_NACHT_TAIL]}${Formatting.Reset}」獲得`
    );
    world.sendMessage(
      `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_NACHT_TAIL]}」を獲得しました。`
    );
  }
};

export default () =>
  system.runInterval(() => {
    system.runJob(
      (function* () {
        for (const player of world
          .getAllPlayers()
          .filter((player) => !(player.hasTag(TAG_OPERATOR) && player.hasTag(TAG_OP_DEV)))) {
          score(player);
          item(player);
          yield;
        }
      })()
    );
  }, TicksPerSecond);
