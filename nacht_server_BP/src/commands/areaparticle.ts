import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  TicksPerSecond,
  type Vector3,
} from "@minecraft/server";

/**
 *
 * @param from
 * @param to
 */
const getLocationBetween = (from: Vector3, to: Vector3) => {
  const locations = [from];
  if (from.x !== to.x) {
    const minX = Math.min(from.x, to.x);
    const distance = Math.abs(from.x - to.x) - 1;
    Array(distance)
      .fill(null)
      .forEach((_, index) =>
        locations.push({ x: minX + index + 1, y: from.y, z: from.z })
      );
  } else if (from.y !== to.y) {
    const minY = Math.min(from.y, to.y);
    const distance = Math.abs(from.y - to.y) - 1;
    Array(distance)
      .fill(null)
      .forEach((_, index) =>
        locations.push({ x: from.x, y: minY + index + 1, z: from.z })
      );
  } else {
    const minZ = Math.min(from.z, to.z);
    const distance = Math.abs(from.z - to.z) - 1;
    Array(distance)
      .fill(null)
      .forEach((_, index) =>
        locations.push({ x: from.x, y: from.y, z: minZ + index + 1 })
      );
  }

  return locations.concat(to);
};

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:areaparticle",
        description: "範囲の外枠にパーティクルを表示する",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          { name: "from", type: CustomCommandParamType.Location },
          { name: "to", type: CustomCommandParamType.Location },
        ],
        optionalParameters: [
          { name: "seconds", type: CustomCommandParamType.Float },
          { name: "interval", type: CustomCommandParamType.Integer },
        ],
      },
      (
        { sourceEntity },
        from: Vector3,
        to: Vector3,
        seconds: number = 1,
        interval = TicksPerSecond / 2
      ) => {
        try {
          if (seconds <= 0) {
            return {
              message: "seconds param must be positive",
              status: CustomCommandStatus.Failure,
            };
          }
          if (interval <= 0) {
            return {
              message: "interval param must be positive",
              status: CustomCommandStatus.Failure,
            };
          }
          if (sourceEntity && sourceEntity.isValid) {
            const minVertex: Vector3 = {
              x: Math.min(from.x, to.x) - 1,
              y: Math.min(from.y, to.y) - 1,
              z: Math.min(from.z, to.z) - 1,
            };
            const maxVertex: Vector3 = {
              x: Math.max(from.x, to.x) + 1,
              y: Math.max(from.y, to.y) + 1,
              z: Math.max(from.z, to.z) + 1,
            };
            const vertices: Array<Vector3> = [
              maxVertex,
              { x: minVertex.x, y: maxVertex.y, z: maxVertex.z },
              { x: minVertex.x, y: maxVertex.y, z: minVertex.z },
              { x: maxVertex.x, y: maxVertex.y, z: minVertex.z },
              minVertex,
              { x: maxVertex.x, y: minVertex.y, z: minVertex.z },
              { x: maxVertex.x, y: minVertex.y, z: maxVertex.z },
              { x: minVertex.x, y: minVertex.y, z: maxVertex.z },
            ];
            const edges = [
              [vertices[0], vertices[1]],
              [vertices[1], vertices[2]],
              [vertices[2], vertices[3]],
              [vertices[3], vertices[0]],
              [vertices[0], vertices[6]],
              [vertices[1], vertices[7]],
              [vertices[2], vertices[4]],
              [vertices[3], vertices[5]],
              [vertices[4], vertices[5]],
              [vertices[5], vertices[6]],
              [vertices[6], vertices[7]],
              [vertices[7], vertices[4]],
            ];

            let count = Math.trunc((seconds * TicksPerSecond) / interval);
            system.runTimeout(async () => {
              while (count--) {
                edges.forEach(([start, end]) =>
                  getLocationBetween(start, end).forEach((loc) =>
                    sourceEntity.dimension.spawnParticle(
                      "minecraft:small_flame_particle",
                      loc
                    )
                  )
                );
                await system.waitTicks(interval);
              }
            }, 1);
          } else {
            return {
              message: "source entity is undefined or invalid",
              status: CustomCommandStatus.Failure,
            };
          }

          return { status: CustomCommandStatus.Success };
        } catch (error) {
          let message = "予期せぬエラーが発生しました";
          if (error instanceof Error) {
            message += `\n${error.message}`;
          }

          return { message, status: CustomCommandStatus.Failure };
        }
      }
    )
  );
