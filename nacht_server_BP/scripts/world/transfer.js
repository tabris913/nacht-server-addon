import { system, TicksPerSecond, world } from '@minecraft/server';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';
export default () => system.runInterval(() => {
    const unsents = DynamicPropertyUtils.retrieveTransferHistories()
        .filter((dp) => !dp.hasSentMessage)
        .reduce((prev, cur) => (Object.assign(Object.assign({}, prev), { [cur.remittee]: [...(prev[cur.remittee] || []), cur] })), {});
    Object.entries(unsents).forEach(([remittee, histories]) => {
        var _a;
        (_a = PlayerUtils.findPlayer({ isValid: true, nameTag: remittee })) === null || _a === void 0 ? void 0 : _a.sendMessage(`ポイントが${histories.length}件送られました (計${histories.reduce((prev, cur) => prev + cur.amount, 0)}ポイント)。受け取るためには銀行の窓口までお越しください。`);
        histories.forEach((history) => world.setDynamicProperty(history.id, JSON.stringify(Object.assign(Object.assign({}, history), { hasSentMessage: true }))));
    });
}, TicksPerSecond * 10);
