import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  TicksPerSecond,
  Vector3,
} from '@minecraft/server';

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: 'nacht:setparticle',
        description: 'パーティクルを表示する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.Location }],
        optionalParameters: [
          { name: 'seconds', type: CustomCommandParamType.Float },
          { name: 'interval', type: CustomCommandParamType.Integer },
        ],
      },
      ({ sourceEntity }, target: Vector3, seconds: number = 1, interval: number = TicksPerSecond / 2) => {
        try {
          if (seconds <= 0) {
            return {
              message: 'seconds param must be positive',
              status: CustomCommandStatus.Failure,
            };
          }
          if (interval <= 0) {
            return {
              message: 'interval param must be positive',
              status: CustomCommandStatus.Failure,
            };
          }
          if (sourceEntity && sourceEntity.isValid) {
            let count = Math.trunc((seconds * TicksPerSecond) / interval);
            system.runTimeout(async () => {
              while (count--) {
                sourceEntity.dimension.spawnParticle('minecraft:small_flame_particle', target);
                await system.waitTicks(interval);
              }
            }, 1);
          } else {
            return {
              message: 'source entity is undefined or invalid',
              status: CustomCommandStatus.Failure,
            };
          }
        } catch (error) {
          let message = '予期せぬエラーが発生しました';
          if (error instanceof Error) {
            message += `\n${error.message}`;
          }

          return { message, status: CustomCommandStatus.Failure };
        }
      }
    )
  );
