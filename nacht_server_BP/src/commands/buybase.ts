import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  type Entity,
  type Player,
  system,
  TicksPerSecond,
  world,
} from '@minecraft/server';
import { MessageFormData, ModalFormData } from '@minecraft/server-ui';

import { PREFIX_BASE, PREFIX_GAMERULE } from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { BaseAreaInfo } from '../models/location';
import BaseUtils from '../utils/BaseUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';
import { RuleName } from './gamerule';

const buybaseCommand: CustomCommand = {
  name: 'nacht:buybase',
  description: '拠点用地を購入する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

/**
 * 拠点購入コマンドの処理
 *
 * @param origin
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  if (origin.sourceType !== CustomCommandSource.NPCDialogue) {
    throw new NonNPCSourceError();
  }

  const player = PlayerUtils.convertToPlayer(origin.initiator);
  if (player === undefined || origin.sourceEntity === undefined) {
    throw new UndefinedSourceOrInitiatorError();
  }

  const baseDps = BaseUtils.retrieveBases(player.nameTag);
  if (baseDps.some((baseDp) => baseDp.name === undefined)) {
    player.sendMessage('拠点の設定が進行中です。');

    return { status: CustomCommandStatus.Failure };
  }

  const form = new ModalFormData();
  form.title('どんな拠点にするんだい？');
  const maxRange = Math.max(
    51,
    (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.baseMaximumRange) as number | undefined) || 501
  );
  form.slider('サイズ', 51, maxRange, {
    valueStep: 2,
    defaultValue: Math.min(maxRange, 101),
  });
  form.submitButton('決定');

  system.runTimeout(() => {
    form
      .show(player)
      .then((response) => {
        if (response.canceled) {
          Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
          return;
        }

        const size = response.formValues?.[0] as number;
        const price =
          (size - 1) ** 2 *
          ((world.getDynamicProperty(PREFIX_GAMERULE + RuleName.baseMarketPrice) as number | undefined) || 20);
        const count =
          Math.max(
            ...Object.keys(baseDps).map((dpid) => parseInt(dpid.replace(`${PREFIX_BASE}${player.nameTag}_`, '')))
          ) + 1;
        purchase(player, origin.sourceEntity!, size, price, count);
      })
      .catch(() => null);
  }, TicksPerSecond);

  return { status: CustomCommandStatus.Success };
};

const purchase = (player: Player, npc: Entity, size: number, price: number, count: number) => {
  const purchaseForm = new MessageFormData();
  purchaseForm.body(`${price}ポイントになりますがよろしいですか？`);
  purchaseForm.button1('はい');
  purchaseForm.button2('いいえ');

  purchaseForm
    .show(player)
    .then((response) => {
      if (response.canceled) {
        Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
        return;
      }

      if (response.selection === 0) {
        // はい
        marketLogic.purchaseItem(player, npc, NachtServerAddonItemTypes.BaseFlag, 1, price);
        const id = `${PREFIX_BASE}${player.nameTag}_${count}`;
        world.setDynamicProperty(
          id,
          JSON.stringify({
            edgeSize: size,
            fixed: false,
            id,
            index: count,
            owner: player.nameTag,
            participants: [],
            showBorder: true,
          } satisfies BaseAreaInfo)
        );
      }
    })
    .catch(() => null);
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(buybaseCommand, commandProcess));
