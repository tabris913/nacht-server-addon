import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { registerCommand } from './common';
import { setAutoRemoveFortuneEnchant, setAutoRemoveFortuneEnchantInterval } from './gameRules/autoRemoveFortuneEnchant';
import { setBaseMarketPrice, setBaseMaximumRange } from './gameRules/base';
import { setPrayPrice } from './gameRules/pray';
import {
  setShowAreaBorder,
  setShowAreaBorderInterval,
  setShowAreaBorderRange,
  setShowAreaBorderYRange,
} from './gameRules/showAreaBorder';
import { setTeleportTarget } from './gameRules/teleportTarget';
import { setWatchCrossingArea, setWatchCrossingAreaInterval } from './gameRules/watchCrossingArea';
import { RuleName } from './enum';

const gameruleCommand: CustomCommand = {
  name: 'nacht:gamerule',
  description: 'アドオンで追加したゲームルールを変更する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'nacht:ruleName', type: CustomCommandParamType.Enum },
    { name: 'value', type: CustomCommandParamType.String },
  ],
};

/**
 * ゲームルールを変更するコマンドの処理
 *
 * @param origin
 * @param ruleName
 * @param value
 * @returns
 */
const commandProcess = (origin: CustomCommandOrigin, ruleName: RuleName, value: string): CustomCommandResult => {
  switch (ruleName) {
    case RuleName.autoRemoveFortuneEnchant:
      return setAutoRemoveFortuneEnchant(value);
    case RuleName.autoRemoveFortuneEnchantInterval:
      return setAutoRemoveFortuneEnchantInterval(value);
    case RuleName.baseMarketPrice:
      return setBaseMarketPrice(value);
    case RuleName.baseMaximumRange:
      return setBaseMaximumRange(value);
    case RuleName.prayPrice:
      return setPrayPrice(value);
    case RuleName.showAreaBorder:
      return setShowAreaBorder(value);
    case RuleName.showAreaBorderInterval:
      return setShowAreaBorderInterval(value);
    case RuleName.showAreaBorderRange:
      return setShowAreaBorderRange(value);
    case RuleName.showAreaBorderYRange:
      return setShowAreaBorderYRange(value);
    case RuleName.teleportTargets:
      return setTeleportTarget(value);
    case RuleName.watchCrossingArea:
      return setWatchCrossingArea(value);
    case RuleName.watchCrossingAreaInterval:
      return setWatchCrossingAreaInterval(value);
    default:
      return { status: CustomCommandStatus.Success };
  }
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(gameruleCommand, commandProcess));
