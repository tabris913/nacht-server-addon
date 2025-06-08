import { system, TicksPerSecond, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { Formatting, LOC_ERSTE } from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import { MinecraftDimensionTypes } from '../types/index';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
// なはとの羽根
export default () => world.afterEvents.itemUse.subscribe((event) => {
    try {
        if (event.itemStack.type.id === NachtServerAddonItemTypes.NachtFeather) {
            event.source.sendMessage(`${event.source.name}は　なはとの羽根を　ほうりなげた！`);
            const tpTargets = [
                {
                    dimension: MinecraftDimensionTypes.Overworld,
                    displayName: 'Erste',
                    id: '',
                    location: LOC_ERSTE,
                    name: '',
                    owner: '',
                },
            ];
            DynamicPropertyUtils.retrieveLocations(event.source.nameTag).forEach((locationInfo) => tpTargets.push(locationInfo));
            const choices = tpTargets.map((tt) => tt.displayName);
            const form = new ModalFormData();
            form.title('テレポート');
            form.dropdown('転移先', choices, { defaultValueIndex: 0 });
            form.toggle('削除');
            form.submitButton('決定');
            form.show(event.source).then((response) => {
                var _a, _b;
                if (response.canceled) {
                    Logger.log(`[${event.source.nameTag}] canceled: ${response.cancelationReason}`);
                    return;
                }
                const selectedIndex = (_a = response.formValues) === null || _a === void 0 ? void 0 : _a[0];
                const deleteFlag = (_b = response.formValues) === null || _b === void 0 ? void 0 : _b[1];
                const target = tpTargets[selectedIndex];
                if (target) {
                    if (deleteFlag) {
                        if (target.id !== '') {
                            const deleteForm = new ActionFormData();
                            deleteForm.title(`${target.displayName} を削除しますか?`);
                            deleteForm.button('はい');
                            deleteForm.button('いいえ');
                            deleteForm.show(event.source).then((deleteResponse) => {
                                if (deleteResponse.canceled) {
                                    Logger.log(`[${event.source.nameTag}] canceled: ${deleteResponse.cancelationReason}`);
                                    return;
                                }
                                switch (deleteResponse.selection) {
                                    case 0:
                                        // はい
                                        world.setDynamicProperty(target.id, undefined);
                                        event.source.sendMessage(`${target.displayName}を削除しました`);
                                        break;
                                    case 1:
                                        // いいえ
                                        event.source.sendMessage(`${target.displayName}の削除を取り消しました`);
                                }
                            });
                        }
                        else {
                            event.source.sendMessage(`${Formatting.Color.RED}${target.displayName}は削除できません`);
                        }
                    }
                    else {
                        system.runTimeout(() => event.source.teleport(target.location, { dimension: world.getDimension(target.dimension) }), TicksPerSecond / 2);
                    }
                }
                else {
                    // みつからないよ
                    event.source.sendMessage(`${Formatting.Color.GOLD}${choices[selectedIndex]}が見つかりませんでした。オペレーターにもメッセージを送りますがログインしてない際は届きません。見落とす場合もあるので対応がない場合は別途ご連絡ください`);
                    PlayerUtils.sendMessageToOps(`${Formatting.Color.GOLD}${event.source.nameTag}が転移先「${choices[selectedIndex]}」の操作に失敗しました`);
                }
            });
        }
    }
    catch (error) {
        Logger.error(error);
    }
});
