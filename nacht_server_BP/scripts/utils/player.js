import { world } from "@minecraft/server";
import { TAG_OPERATOR } from "../const";
export const getOperators = () => world.getPlayers({ tags: [TAG_OPERATOR] });
export const sendMessageToOps = (msg) => getOperators().forEach((op) => op.sendMessage(msg));
export const getPlayer = (entity) => world.getPlayers({ name: entity.nameTag })[0];
