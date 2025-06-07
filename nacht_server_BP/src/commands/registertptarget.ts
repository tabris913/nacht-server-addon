import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  type Entity,
  system,
  world,
} from "@minecraft/server";
import { PREFIX_GAMERULE, PREFIX_LOCATION } from "../const";
import {
  CommandProcessError,
  UndefinedSourceOrInitiatorError,
} from "../errors/command";
import type { LocationInfo } from "../models/location";
import StringUtils from "../utils/StringUtils";
import { registerCommand } from "./common";
import { RuleName } from "./gamerule";

const registerTeleportTargetCommand: CustomCommand = {
  name: "nacht:registertptarget",
  description: "なはとの羽根に転移先を登録する",
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: "name", type: CustomCommandParamType.String },
    { name: "displayName", type: CustomCommandParamType.String },
  ],
};

/**
 * テレポート転移先を登録するコマンドの処理
 *
 * @param origin
 * @param name
 * @param displayName
 * @returns
 * @throws This function can throw errors.
 *
 * {@link CommandProcessError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (
  origin: CustomCommandOrigin,
  name: string,
  displayName: string
) => {
  if (origin.initiator) {
    // called by NPC
    register(origin.initiator, name, displayName);
  } else if (origin.sourceEntity) {
    register(origin.sourceEntity, name, displayName);
  } else {
    throw new UndefinedSourceOrInitiatorError();
  }

  return { status: CustomCommandStatus.Success };
};

/**
 * 登録する
 *
 * @param entity 操作者
 * @param name 地点名
 * @param displayName 地点表示名
 * @throws This function can throw errors
 *
 * {@link CommandProcessError}
 */
const register = (entity: Entity, name: string, displayName: string) => {
  const prefix = `${PREFIX_LOCATION}${entity.nameTag}_`;
  const locationName = `${prefix}${name}`;
  const dpIds = world.getDynamicPropertyIds();
  if (dpIds.includes(locationName)) {
    throw new CommandProcessError("その名前は既に使用されています。");
  }
  const num = world.getDynamicProperty(
    `${PREFIX_GAMERULE}${RuleName.teleportTargets}`
  );
  if (dpIds.filter((dpId) => dpId.startsWith(prefix)).length === num) {
    throw new CommandProcessError(
      `すでにテレポート先が${num}件登録されています`
    );
  }

  world.setDynamicProperty(
    locationName,
    JSON.stringify({
      displayName: StringUtils.format(displayName),
      dimension: entity.dimension.id,
      id: locationName,
      location: entity.location,
      name,
      owner: entity.nameTag,
    } satisfies LocationInfo)
  );
};

export default () =>
  system.beforeEvents.startup.subscribe(
    registerCommand(registerTeleportTargetCommand, commandProcess)
  );
