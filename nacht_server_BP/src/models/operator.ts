import type { Effect, EquipmentSlot } from '@minecraft/server';

export type OperatorGameMode = {
  effects: Array<Pick<Effect, 'amplifier' | 'duration' | 'typeId'>>;
  equippable: Partial<Record<EquipmentSlot, string>>;
  health?: number;
  hunger?: number;
  point: number;
  xp: number;
};
