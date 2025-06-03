import { Entity, world } from "@minecraft/server";
import { TAG_OPERATOR } from "../const";

export const getOperators = () => world.getPlayers({ tags: [TAG_OPERATOR] });

export const sendMessageToOps = (msg: string) =>
  getOperators().forEach((op) => op.sendMessage(msg));

export const getPlayer = (entity: Entity) =>
  world.getPlayers({ name: entity.nameTag })[0];
