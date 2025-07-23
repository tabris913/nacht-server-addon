import {
  type Entity,
  EntityComponentTypes,
  EntityDamageCause,
  EquipmentSlot,
  TicksPerDay,
  TicksPerSecond,
  world,
} from '@minecraft/server';

import { TAG_DIM_END, TAG_DIM_NETHER, Undead } from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import { GameTime } from '../models/GameTime';
import { MinecraftEffectTypes, MinecraftEntityTypes } from '../types/index';
import SafeZoneUtils from '../utils/SafeZoneUtils';

/**
 *
 * @param maxRate 最大倍率
 * @param term 最大倍率に達するまでの時間
 * @param standardTime 基準時間
 * @param targetTime 算出する時点の時間
 * @returns
 */
const calcRate = (maxRate: number, term: GameTime, standardTime: GameTime, targetTime?: GameTime) => {
  /**
   * 経過時間
   */
  const diff = (targetTime || GameTime.now()).diff(standardTime);

  return Math.min(maxRate - 1, ((maxRate - 1) / term.ticks) * diff.ticks);
};

const calcRateWithTicks = (
  ticks: number,
  maxRate: number,
  range: { from: number; maxFrom: number; maxTo: number; to: number }
) => {
  const newRange = { ...range };
  if (range.maxFrom < range.from) newRange.maxFrom += TicksPerDay;
  if (range.maxTo < range.from) newRange.maxTo += TicksPerDay;
  if (range.to < range.from) newRange.to += TicksPerDay;

  if (ticks < newRange.from || newRange.to < ticks) return 1;

  if (newRange.maxFrom <= ticks) {
    if (ticks <= newRange.maxTo) return maxRate - 1;

    return maxRate - 1 - ((ticks - newRange.maxTo) * (maxRate - 1)) / (newRange.to - newRange.maxTo + 1);
  }

  return maxRate - 1 - ((newRange.maxFrom - ticks) * (maxRate - 1)) / (newRange.maxFrom - newRange.from + 1);
};

const isOverTwoDays = (day: number, timeOfDay: number) => {
  const today = world.getDay();
  if (today - day >= 2) return true;
  if (today - day === 1 && world.getTimeOfDay() >= timeOfDay) return true;

  return false;
};

/**
 * プレイヤーがエンティティにダメージを与えた場合，(システム的には)追加ダメージを与える
 *
 * @param player プレイヤー
 * @param hurtEntity ダメージを受けたエンティティ
 * @param damage ダメージ量
 */
const playerDamaging = (player: Entity, hurtEntity: Entity, damage: number) => {
  const equippable = player.getComponent(EntityComponentTypes.Equippable);
  if (equippable === undefined) return;
  const mainhandItemStack = equippable.getEquipment(EquipmentSlot.Mainhand);

  const now = GameTime.now();

  // メインハンドを見ているので武器とは限らない
  switch (mainhandItemStack?.typeId) {
    case NachtServerAddonItemTypes.HolySilverKnife:
    case NachtServerAddonItemTypes.HolySilverPickaxe:
      // 霊銀装備はアンデッドに2倍ダメージ
      if (Undead.includes(hurtEntity.typeId)) {
        hurtEntity.applyDamage(damage);
      }
      break;
    case NachtServerAddonItemTypes.BlazeredSteelSword:
      // ゲーム内時間で2日間ネザーにいると2.5倍ダメージにまで伸びる
      const netherTags = player.getTags().filter((tag) => tag.startsWith(TAG_DIM_NETHER));
      if (netherTags.length > 0) {
        const [day, timeOfDay] = netherTags[0]
          .replace(TAG_DIM_NETHER, '')
          .split('_')
          .map((v) => parseInt(v));
        hurtEntity.applyDamage(Math.floor(calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) * damage));
      }
      break;
    case NachtServerAddonItemTypes.HollowCrystalSword:
      // ゲーム内時間で2日間エンドにいると2.5倍ダメージにまで伸びる
      const endTags = player.getTags().filter((tag) => tag.startsWith(TAG_DIM_END));
      if (endTags.length > 0) {
        const [day, timeOfDay] = endTags[0]
          .replace(TAG_DIM_END, '')
          .split('_')
          .map((v) => parseInt(v));
        hurtEntity.applyDamage(Math.floor(calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) * damage));
      }
      break;
    case NachtServerAddonItemTypes.NocturiumSword:
      // 真夜中には2.5倍ダメージにまで伸びる
      if (now.isNight) {
        // let rate = 0;
        // if (17_000 <= now.timeOfDay) {
        //   if (now.timeOfDay <= 19_000) {
        //     rate = 1.5;
        //   } else {
        //     rate = 1.5 - ((now.timeOfDay - 19_000) * 1.5) / 3300;
        //   }
        // } else {
        //   rate = 1.5 - ((17_000 - now.timeOfDay) * 1.5) / 3300;
        // }
        // hurtEntity.applyDamage(rate * damage);
        hurtEntity.applyDamage(
          Math.floor(
            calcRateWithTicks(now.timeOfDay, 2.5, { from: 13_702, maxFrom: 17_000, maxTo: 19_000, to: 22_299 }) * damage
          )
        );
      }
      break;
    case NachtServerAddonItemTypes.LuminariumSword:
      // 真昼間には2.5倍ダメージにまで伸びる
      if (!now.isNight) {
        // let rate = 0;
        // if (5_000 <= now.timeOfDay) {
        //   if (22_300 <= now.timeOfDay) {
        //     rate = 1.5 - ((29_000 - now.timeOfDay) * 1.5) / 6700;
        //   } else if (now.timeOfDay <= 7_000) {
        //     rate = 1.5;
        //   } else {
        //     rate = 1.5 - ((now.timeOfDay - 7_000) * 1.5) / 6700;
        //   }
        // } else {
        //   rate = 1.5 - ((5_000 - now.timeOfDay) * 1.5) / 6700;
        // }
        // hurtEntity.applyDamage(rate * damage);
        hurtEntity.applyDamage(
          Math.floor(calcRateWithTicks(now.timeOfDay, 2.5, { from: 22_300, maxFrom: 5_000, maxTo: 7_000, to: 13_701 }))
        );
      }
      break;
    case NachtServerAddonItemTypes.TerramagniteSword:
      // 深いほどダメージが上がり，-50以下で2.5倍ダメージにまで伸びる
      if (player.location.y <= 64) {
        // let rate = 0;
        // if (player.location.y <= -50) {
        //   rate = 1.5;
        // } else {
        //   rate = 1.5 - ((player.location.y - -50) * 1.5) / 115;
        // }
        // hurtEntity.applyDamage(rate * damage);
        hurtEntity.applyDamage(
          Math.floor(calcRateWithTicks(player.location.y, 2.5, { from: -64, maxFrom: -64, maxTo: -50, to: 64 }))
        );
      }
      break;
    case NachtServerAddonItemTypes.MagnosSword:
      hurtEntity.setOnFire(5);
      break;
    case NachtServerAddonItemTypes.AedriumSword:
      hurtEntity.addEffect(MinecraftEffectTypes.Levitation, 5 * TicksPerSecond);
      break;
    case NachtServerAddonItemTypes.MagradisSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.Wither:
          hurtEntity.applyDamage(Math.floor(damage * 0.5));
          break;
        case MinecraftEntityTypes.WitherSkeleton:
          hurtEntity.applyDamage(Math.floor(damage));
          break;
      }
      break;
    case NachtServerAddonItemTypes.NexiatiteSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.EnderDragon:
          hurtEntity.applyDamage(Math.floor(damage * 0.5));
          break;
        case MinecraftEntityTypes.Enderman:
        case MinecraftEntityTypes.Endermite:
          hurtEntity.applyDamage(Math.floor(damage));
          break;
      }
      break;
    case NachtServerAddonItemTypes.SolistiteSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.Warden:
          hurtEntity.applyDamage(Math.floor(damage * 0.5));
          break;
      }
      break;
  }
};

/**
 * プレイヤーがエンティティからダメージを受けた場合
 *
 * @param player プレイヤー
 */
const playerHurt = (player: Entity) => {
  const equippable = player.getComponent(EntityComponentTypes.Equippable);
  if (equippable === undefined) return;
  const armorItemStacks = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet].map((es) =>
    equippable.getEquipment(es)
  );
  if (armorItemStacks.every((is) => is?.hasTag('nacht:holy_silver_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:blazered_steel_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:hollow_crystal_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:nocturium_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:luminarium_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:terramagnite_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:magnos_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:aedrium_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:magradis_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:nexiatite_tier'))) {
    //
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:solistite_tier'))) {
    //
  }
};

export default () =>
  world.afterEvents.entityHurt.subscribe((event) => {
    if (event.hurtEntity.typeId === MinecraftEntityTypes.Player) {
      if (
        SafeZoneUtils.isInSafeArea({ ...event.hurtEntity.location, dimension: event.hurtEntity.dimension }) &&
        [EntityDamageCause.entityAttack, EntityDamageCause.entityExplosion, EntityDamageCause.projectile].includes(
          event.damageSource.cause
        )
      ) {
        const health = event.hurtEntity.getComponent(EntityComponentTypes.Health);
        health?.setCurrentValue(Math.min(health.currentValue + event.damage, health.effectiveMax));
      }

      return;
    }

    if (event.damageSource.damagingEntity?.typeId === MinecraftEntityTypes.Player) {
      playerDamaging(event.damageSource.damagingEntity, event.hurtEntity, event.damage);
    } else if (event.hurtEntity.typeId === MinecraftEntityTypes.Player) {
      playerHurt(event.hurtEntity);
    }
  });
