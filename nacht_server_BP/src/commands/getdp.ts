import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandSource,
  CustomCommandStatus,
  system,
  world,
} from '@minecraft/server';

import { NonAdminSourceError } from '../errors/command';

import { registerCommand } from './common';

const getDynamicPropertyCommand: CustomCommand = {
  name: 'nacht:getdp',
  description: 'Dynamic Propertyを取得する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  optionalParameters: [{ name: 'filter', type: CustomCommandParamType.String }],
};

/**
 * グローバル変数を取得するコマンドの処理
 *
 * @param origin
 * @param filter
 * @returns
 * @throws This function can throw error.
 *
 * {@link NonAdminSourceError}
 */
const commandProcess = (origin: CustomCommandOrigin, filter?: string) => {
  if ([CustomCommandSource.Block, CustomCommandSource.NPCDialogue].includes(origin.sourceType)) {
    throw new NonAdminSourceError();
  }

  const message = world
    .getDynamicPropertyIds()
    .filter((dpId) => dpId.includes(filter || ''))
    .map((dpId) => `${dpId}: ${JSON.stringify(world.getDynamicProperty(dpId))}`)
    .join('\n');

  return {
    message: `ダイナミックプロパティ一覧 (フィルター: ${filter || 'なし'})\n${message}`,
    status: CustomCommandStatus.Success,
  };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(getDynamicPropertyCommand, commandProcess));
