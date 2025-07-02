import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, EnchantmentType, EntityComponentTypes, EquipmentSlot, GameMode, ItemComponentTypes, ItemStack, system, world, } from '@minecraft/server';
import { PREFIX_OPGAMEMODE, SCOREBOARD_POINT, TAG_OP_DEV, TAG_OP_PLAY } from '../const';
import { CommandProcessError, NonAdminSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { registerCommand } from './common';
import { OpGameMode } from './enum';
const gamemodeOpCommand = {
    name: 'nacht:gamemodeop',
    description: '',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ name: 'nacht:OpGameMode', type: CustomCommandParamType.Enum }],
};
/**
 *
 * @param origin
 * @param name
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonAdminSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link CommandProcessError}
 */
const commandProcess = (origin, name) => {
    if (origin.sourceType !== CustomCommandSource.Entity)
        throw new NonAdminSourceError();
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    const dpid = `${PREFIX_OPGAMEMODE}${player.nameTag}`;
    let tagToAdd, tagToRemove, gamemode;
    switch (name) {
        case OpGameMode.development:
            if (player.hasTag(TAG_OP_DEV))
                throw new CommandProcessError('すでに開発モードです。');
            tagToAdd = TAG_OP_DEV;
            tagToRemove = TAG_OP_PLAY;
            gamemode = GameMode.Creative;
            break;
        case OpGameMode.play:
            if (player.hasTag(TAG_OP_PLAY))
                throw new CommandProcessError('すでにプレイモードです。');
            tagToAdd = TAG_OP_PLAY;
            tagToRemove = TAG_OP_DEV;
            gamemode = GameMode.Survival;
            break;
    }
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    const health = player.getComponent(EntityComponentTypes.Health);
    const hunger = player.getComponent(EntityComponentTypes.Hunger);
    system.run(() => {
        var _a, _b, _c;
        player.addTag(tagToAdd);
        player.removeTag(tagToRemove);
        player.setGameMode(gamemode);
        // save
        const gameData = {
            point: ScoreboardUtils.getScore(player, SCOREBOARD_POINT) || 0,
            xp: player.getTotalXp(),
        };
        const effects = player.getEffects();
        if (effects.length > 0) {
            gameData.effects = effects.map((effect) => ({
                amplifier: effect.amplifier,
                duration: effect.duration,
                typeId: effect.typeId,
            }));
        }
        if (equippable) {
            gameData.equippable = [
                EquipmentSlot.Body,
                EquipmentSlot.Chest,
                EquipmentSlot.Feet,
                EquipmentSlot.Head,
                EquipmentSlot.Legs,
                EquipmentSlot.Offhand,
            ].reduce((prev, cur) => {
                const equipment = equippable === null || equippable === void 0 ? void 0 : equippable.getEquipment(cur);
                if (equipment === undefined)
                    return prev;
                const obj = { amount: equipment.amount, typeId: equipment.typeId };
                if (equipment.nameTag)
                    Object.assign(obj, { nameTag: equipment.nameTag });
                const enchantable = equipment.getComponent(ItemComponentTypes.Enchantable);
                if (enchantable) {
                    const enchantments = enchantable.getEnchantments();
                    if (enchantments.length > 0) {
                        Object.assign(obj, {
                            enchantments: enchantments.map((enchantment) => ({
                                level: enchantment.level,
                                typeId: enchantment.type.id,
                            })),
                        });
                    }
                }
                return Object.assign(Object.assign({}, prev), { [cur]: obj });
            }, {});
        }
        if (health)
            gameData.health = health.currentValue;
        if (hunger)
            gameData.hunger = hunger.currentValue;
        const inventory = InventoryUtils.gatherSlots(player, undefined, false).reduce((prev, cur, index) => {
            var _a;
            if (!cur.hasItem())
                return prev;
            const obj = { amount: cur.amount, typeId: cur.typeId };
            if (cur.nameTag)
                Object.assign(obj, { nameTag: cur.nameTag });
            const enchantable = (_a = cur.getItem()) === null || _a === void 0 ? void 0 : _a.getComponent(ItemComponentTypes.Enchantable);
            if (enchantable) {
                const enchantments = enchantable.getEnchantments();
                if (enchantments.length > 0) {
                    Object.assign(obj, {
                        enchantments: enchantments.map((enchantment) => ({
                            level: enchantment.level,
                            typeId: enchantment.type.id,
                        })),
                    });
                }
            }
            return Object.assign(Object.assign({}, prev), { [index]: obj });
        }, {});
        if (Object.keys(inventory).length > 0)
            gameData.inventory = inventory;
        const dp = world.getDynamicProperty(dpid);
        if (dp) {
            const parsed = JSON.parse(dp);
            player.resetLevel();
            player.addExperience(parsed.xp);
            Logger.debug(`addExperience: ${parsed.xp}`);
            ScoreboardUtils.setScore(player, SCOREBOARD_POINT, parsed.point);
            Logger.debug(`setScore: ${parsed.point}`);
            player.getEffects().forEach((effect) => player.removeEffect(effect.typeId));
            (_a = parsed.effects) === null || _a === void 0 ? void 0 : _a.forEach((effect) => player.addEffect(effect.typeId, effect.duration, { amplifier: effect.amplifier }));
            [
                EquipmentSlot.Body,
                EquipmentSlot.Chest,
                EquipmentSlot.Feet,
                EquipmentSlot.Head,
                EquipmentSlot.Legs,
                EquipmentSlot.Offhand,
            ].forEach((slot) => equippable === null || equippable === void 0 ? void 0 : equippable.setEquipment(slot, undefined));
            Object.entries(parsed.equippable || {}).forEach(([eqSlot, eqItem]) => {
                const itemStack = new ItemStack(eqItem.typeId, eqItem.amount);
                itemStack.nameTag = eqItem.nameTag;
                if (eqItem.enchantments) {
                    const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
                    if (enchantable) {
                        enchantable.addEnchantments(eqItem.enchantments.map((enchantment) => ({
                            level: enchantment.level,
                            type: new EnchantmentType(enchantment.typeId),
                        })));
                    }
                }
                equippable === null || equippable === void 0 ? void 0 : equippable.setEquipment(eqSlot, itemStack);
            });
            if (health && parsed.health) {
                health.setCurrentValue(parsed.health);
            }
            if (hunger && parsed.hunger) {
                hunger.setCurrentValue(parsed.hunger);
            }
            (_b = player.getComponent(EntityComponentTypes.Inventory)) === null || _b === void 0 ? void 0 : _b.container.clearAll();
            InventoryUtils.gatherSlots(player, undefined, false).forEach((slot, index) => {
                var _a;
                const slotItem = (_a = parsed.inventory) === null || _a === void 0 ? void 0 : _a[index];
                if (slotItem === undefined)
                    return;
                const itemStack = new ItemStack(slotItem.typeId, slotItem.amount);
                itemStack.nameTag = slotItem.nameTag;
                if (slotItem.enchantments) {
                    const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
                    if (enchantable) {
                        enchantable.addEnchantments(slotItem.enchantments.map((enchantment) => ({
                            level: enchantment.level,
                            type: new EnchantmentType(enchantment.typeId),
                        })));
                    }
                }
                slot.setItem(itemStack);
            });
        }
        else {
            player.resetLevel();
            ScoreboardUtils.setScore(player, SCOREBOARD_POINT, 0);
            player.getEffects().forEach((effect) => player.removeEffect(effect.typeId));
            [
                EquipmentSlot.Body,
                EquipmentSlot.Chest,
                EquipmentSlot.Feet,
                EquipmentSlot.Head,
                EquipmentSlot.Legs,
                EquipmentSlot.Offhand,
            ].forEach((slot) => equippable === null || equippable === void 0 ? void 0 : equippable.setEquipment(slot, undefined));
            (_c = player.getComponent(EntityComponentTypes.Inventory)) === null || _c === void 0 ? void 0 : _c.container.clearAll();
        }
        world.setDynamicProperty(dpid, JSON.stringify(gameData));
    });
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(gamemodeOpCommand, commandProcess));
