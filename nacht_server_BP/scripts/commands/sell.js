import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, } from '@minecraft/server';
import { SCOREBOARD_POINT } from '../const';
import { CommandProcessError, NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import InventoryUtils from '../utils/InventoryUtils';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { registerCommand } from './common';
const sellCommand = {
    name: 'nacht:sell',
    description: 'アイテム売却コマンド',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'item', type: CustomCommandParamType.ItemType },
        { name: 'amount', type: CustomCommandParamType.Integer },
        { name: 'point', type: CustomCommandParamType.Integer },
    ],
    optionalParameters: [
        { name: 'data', type: CustomCommandParamType.Integer },
        { name: 'itemless_msg', type: CustomCommandParamType.String },
        { name: 'after_msg', type: CustomCommandParamType.String },
    ],
};
/**
 * アイテムを売却するコマンドの処理
 *
 * @param origin
 * @param item
 * @param amount
 * @param point
 * @param data
 * @param itemless_msg
 * @param after_msg
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin, item, amount, point, itemless_msg, after_msg) => {
    var _a;
    if (origin.sourceType !== CustomCommandSource.NPCDialogue) {
        throw new NonNPCSourceError();
    }
    const player = PlayerUtils.convertToPlayer(origin.initiator);
    if (player === undefined) {
        throw new UndefinedSourceOrInitiatorError();
    }
    // called by NPC
    ScoreboardUtils.getScoreOrEnable(player, SCOREBOARD_POINT);
    const npcName = ((_a = origin.sourceEntity) === null || _a === void 0 ? void 0 : _a.nameTag) || 'NPC';
    if (InventoryUtils.hasItem(player, item.id, { max: amount - 1 })) {
        player.sendMessage(`[${npcName}] ${itemless_msg || 'アイテムが足りません'}`);
        throw new CommandProcessError('アイテムが足りません');
    }
    // 必要なポイントを持っている
    system.runTimeout(() => {
        InventoryUtils.removeItem(player, item.id, amount);
        ScoreboardUtils.addScore(player, SCOREBOARD_POINT, point);
        player.sendMessage(`[${npcName}] ${after_msg || 'まいどあり！'}`);
    }, 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(sellCommand, commandProcess));
