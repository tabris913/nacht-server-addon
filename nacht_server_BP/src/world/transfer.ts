import { system, TicksPerSecond, world } from '@minecraft/server';

import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';

import type { TransferHistory } from '../models/point';

export default () =>
  system.runInterval(() => {
    const unsents = DynamicPropertyUtils.retrieveTransferHistories()
      .filter((dp) => !dp.hasSentMessage)
      .reduce(
        (prev, cur) => ({ ...prev, [cur.remittee]: [...(prev[cur.remittee] || []), cur] }),
        {} as Record<string, Array<TransferHistory>>
      );

    Object.entries(unsents).forEach(([remittee, histories]) => {
      PlayerUtils.findPlayer({ isValid: true, nameTag: remittee })?.sendMessage(
        `ポイントが${histories.length}件送られました (計${histories.reduce((prev, cur) => prev + cur.amount, 0)}ポイント)。受け取るためには銀行の窓口までお越しください。`
      );
      histories.forEach((history) =>
        world.setDynamicProperty(
          history.id,
          JSON.stringify({ ...history, hasSentMessage: true } satisfies TransferHistory)
        )
      );
    });
  }, TicksPerSecond * 10);
