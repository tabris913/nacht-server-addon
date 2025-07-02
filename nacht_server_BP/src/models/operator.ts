import type { Effect, EquipmentSlot } from '@minecraft/server';

export type ItemData = {
  amount: number;
  enchantments?: Array<{ level: number; typeId: string }>;
  nameTag?: string;
  typeId: string;
};

export type OperatorGameMode = {
  effects?: Array<Pick<Effect, 'amplifier' | 'duration' | 'typeId'>>;
  equippable?: Partial<Record<EquipmentSlot, ItemData>>;
  health?: number;
  hunger?: number;
  inventory?: Record<number, ItemData>;
  point: number;
  xp: number;
};
