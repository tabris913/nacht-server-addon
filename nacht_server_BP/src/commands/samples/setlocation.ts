import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  Vector3,
  world,
} from '@minecraft/server';

import PlayerUtils from '../../utils/PlayerUtils';

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: 'nacht:setlocation',
        description: '名前をつけて座標を保存します',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          {
            name: 'name',
            type: CustomCommandParamType.String,
          },
          {
            name: 'location',
            type: CustomCommandParamType.Location,
          },
        ],
      },
      (origin, arg1: string, arg2: Vector3) => {
        try {
          world.setDynamicProperty(`nacht:location_${arg1}`, `${arg2.x}_${arg2.y}_${arg2.z}`);

          if (origin.initiator) {
            PlayerUtils.convertToPlayer(origin.initiator)?.sendMessage(
              `nacht:location_${arg1} に ${arg2.x}_${arg2.y}_${arg2.z} が設定されました`
            );
          }

          return {
            message: `nacht:location_${arg1} に ${arg2.x}_${arg2.y}_${arg2.z} が設定されました`,
            status: CustomCommandStatus.Success,
          };
        } catch (error) {
          let message = '予期せぬエラーが発生しました';
          if (error instanceof Error) {
            message += `\n${error.message}`;
          }

          if (origin.initiator) {
            PlayerUtils.convertToPlayer(origin.initiator)?.sendMessage(message);
          }

          return { message, status: CustomCommandStatus.Failure };
        }
      }
    )
  );
