import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from "@minecraft/server";
import { Formatting } from "../const";
import { format } from "../utils/misc";
/**
 * 登録する
 *
 * @param entity 操作者
 * @param name 地点名
 * @param displayName 地点表示名
 * @returns
 */
const register = (entity, name, displayName) => {
    const prefix = `LOC_${entity.nameTag}_`;
    const locationName = `${prefix}${name}`;
    const dpIds = world.getDynamicPropertyIds();
    if (dpIds.includes(locationName)) {
        return `${Formatting.Color.RED}その名前は既に使用されています${Formatting.Reset}`;
    }
    if (dpIds.filter((dpId) => dpId.startsWith(prefix)).length === 6) {
        return `${Formatting.Color.RED}すでにテレポート先が6件登録されています${Formatting.Reset}`;
    }
    world.setDynamicProperty(locationName, JSON.stringify({
        displayName: format(displayName),
        dimension: entity.dimension.id,
        location: entity.location,
    }));
    return null;
};
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: "nacht:registertptarget",
    description: "なはとの羽根に転移先を登録する",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: "name", type: CustomCommandParamType.String },
        { name: "displayName", type: CustomCommandParamType.String },
    ],
}, (origin, name, displayName) => {
    try {
        let msg;
        if (origin.initiator) {
            // called by NPC
            msg = register(origin.initiator, name, displayName);
        }
        else if (origin.sourceEntity) {
            msg = register(origin.sourceEntity, name, displayName);
        }
        return {
            message: msg !== null && msg !== void 0 ? msg : undefined,
            status: msg === null
                ? CustomCommandStatus.Success
                : CustomCommandStatus.Failure,
        };
    }
    catch (error) {
        let message = "予期せぬエラーが発生しました";
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        return { message, status: CustomCommandStatus.Failure };
    }
}));
