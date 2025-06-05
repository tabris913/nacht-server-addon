import { type Entity, Player, world } from "@minecraft/server";

/**
 * 与えられたエンティティをプレイヤーに変換する
 *
 * @param entityOrPlayer エンティティまたはプレイヤー
 * @returns 与えられたエンティティと ID が一致するプレイヤー
 */
export const convertToPlayer = (entityOrPlayer?: Entity | Player) => {
  try {
    if (entityOrPlayer === undefined) {
      console.warn(
        "A given entity/player cannot be converted because it is undefined."
      );

      return undefined;
    }

    if (entityOrPlayer instanceof Player) {
      console.log("A given entity/player is already player.");

      return entityOrPlayer;
    }

    return world
      .getAllPlayers()
      .filter((player) => player.id === entityOrPlayer.id)
      .at(0);
  } catch (error) {
    console.error(
      "Failed to convert a given entity to a player who has the same id."
    );

    throw error;
  }
};

export default { convertToPlayer };
