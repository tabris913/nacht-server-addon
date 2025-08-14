import { CustomCommandStatus, world } from '@minecraft/server';

import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../enum';

export const setMaintenanceMode = (value: string) => {
  const converted = value.toLowerCase() === 'true';

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.isMaintenainceMode, converted);

  return {
    message: `${RuleName.isMaintenainceMode}に${converted}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};
