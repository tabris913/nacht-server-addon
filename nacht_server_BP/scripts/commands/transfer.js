import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { COUNTER_TRANSFER, PREFIX_TRANSFER, SCOREBOARD_POINT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { PointlessError } from '../errors/market';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { registerCommand } from './common';
const transferCommand = {
    name: 'nacht:transfer',
    description: '別プレイヤーにポイントを送る',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'remittee', type: CustomCommandParamType.PlayerSelector },
        { name: 'amount', type: CustomCommandParamType.Integer },
    ],
};
/**
 * ポイントを送るコマンドの処理
 *
 * @param origin
 * @param remittee 送金者
 * @param amount 送金額
 * @returns
 * @throws This function can throw errors.
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link NachtServerAddonError}
 */
const commandProcess = (origin, remittees, amount) => {
    const remitter = PlayerUtils.convertToPlayer(origin.initiator);
    if (remitter === undefined)
        throw new UndefinedSourceOrInitiatorError();
    if (remittees.length === 0)
        throw new NachtServerAddonError('送金先が見つかりませんでした。');
    if (remittees.length > 0)
        throw new NachtServerAddonError('送金先が複数指定されました。');
    const remittee = remittees[0];
    if (amount <= 0)
        throw new NachtServerAddonError('ポイント数が不正です。');
    if (!Number.isSafeInteger(amount))
        throw new NachtServerAddonError('ポイント数が不正です。');
    system.runTimeout(() => {
        const score = ScoreboardUtils.getScoreOrEnable(remitter, SCOREBOARD_POINT);
        if (score < amount)
            throw new PointlessError();
        ScoreboardUtils.addScore(remitter, SCOREBOARD_POINT, -amount);
        if (remittee.isValid) {
            world.sendMessage(`${remitter.nameTag}から${amount}ポイント送られました。受け取るためには銀行の窓口までお越しください。`);
        }
        const index = DynamicPropertyUtils.getNextCounter(COUNTER_TRANSFER);
        const id = `${PREFIX_TRANSFER}${index}`;
        world.setDynamicProperty(id, JSON.stringify({
            amount,
            datetime: new Date().toISOString(),
            hasSentMessage: remittee.isValid,
            id,
            index,
            isWithdrawn: false,
            remittee: remittee.nameTag,
            remitter: remitter.nameTag,
        }));
        DynamicPropertyUtils.countUpCounter(COUNTER_TRANSFER);
    }, 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(transferCommand, commandProcess));
