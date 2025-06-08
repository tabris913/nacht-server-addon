import { system, TicksPerSecond, world } from '@minecraft/server';
import { RuleName } from '../commands/gamerule';
import { PREFIX_GAMERULE } from '../const';
import InventoryUtils from '../utils/InventoryUtils';
const GAME_RULE_KEY = `${PREFIX_GAMERULE}${RuleName.autoRemoveFortuneEnchant}`;
const GAME_RULE_KEY_INTERVAL = `${PREFIX_GAMERULE}${RuleName.autoRemoveFortuneEnchantInterval}`;
// 幸運エンチャントを除去する
export default () => system.runTimeout(() => system.runInterval(() => {
    if (world.getDynamicProperty(GAME_RULE_KEY) || false) {
        world.getAllPlayers().forEach((player) => InventoryUtils.gatherSlots(player).forEach((slot) => {
            var _a, _b;
            const item = slot.getItem();
            if (item === undefined) {
                return;
            }
            const enchantments = ((_a = item.getComponent('minecraft:enchantable')) === null || _a === void 0 ? void 0 : _a.getEnchantments()) || [];
            if (enchantments.filter((enchantment) => enchantment.type.id === 'fortune').length > 0) {
                // このスロットのアイテムに幸運エンチャントがあり
                (_b = item.getComponent('minecraft:enchantable')) === null || _b === void 0 ? void 0 : _b.removeEnchantment('fortune');
                slot.setItem(item);
                player.sendMessage([
                    item.nameTag || {
                        translate: `item.${item.typeId.replace('minecraft:', '')}.name`,
                    },
                    'から幸運エンチャントを除去しました。',
                ]);
            }
        }));
    }
}, world.getDynamicProperty(GAME_RULE_KEY_INTERVAL) || TicksPerSecond), 1);
