import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { PREFIX_GAMERULE } from '../const';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
const showGameRulesCommand = {
    name: 'nacht:showgamerules',
    description: 'ゲームルールを表示する',
    permissionLevel: CommandPermissionLevel.Admin,
    optionalParameters: [{ name: 'nacht:ruleName', type: CustomCommandParamType.Enum }],
};
/**
 *
 * @param origin
 * @param ruleName
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin, ruleName) => {
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    if (ruleName === undefined) {
        const gamerules = world
            .getDynamicPropertyIds()
            .filter((dpid) => dpid.startsWith(PREFIX_GAMERULE))
            .map((dpid) => [dpid, world.getDynamicProperty(dpid)])
            .filter(([_dpid, dp]) => dp !== undefined)
            .map(([dpid, dp]) => `${dpid.replace(PREFIX_GAMERULE, '')}: ${JSON.stringify(dp)}`);
        player.sendMessage(`ゲームルール一覧\n${gamerules.join('\n')}`);
    }
    else {
        const dp = world.getDynamicProperty(`${PREFIX_GAMERULE}${ruleName}`);
        if (dp === undefined) {
            player.sendMessage(`ゲームルール${ruleName}は設定されていません。`);
        }
        else {
            player.sendMessage(`${ruleName}: ${JSON.stringify(dp)}`);
        }
    }
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(showGameRulesCommand, commandProcess));
