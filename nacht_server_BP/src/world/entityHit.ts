import {
  type Entity,
  EntityComponentTypes,
  EntityDamageCause,
  EntityHealthComponent,
  EquipmentSlot,
  TicksPerSecond,
  world,
} from '@minecraft/server';

import { TAG_DIM_END, TAG_DIM_NETHER, Undead } from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import { GameTime } from '../models/GameTime';
import { MinecraftEffectTypes, MinecraftEntityTypes } from '../types/index';
import { Logger } from '../utils/logger';
import SafeZoneUtils from '../utils/SafeZoneUtils';
import TicksUtils from '../utils/TicksUtils';

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
        // Logger.info(`Additional damage: ${damage}`);
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
        const dmg = calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) * damage;
        // Logger.info(`Additional damage: ${dmg}`);
        hurtEntity.applyDamage(dmg);
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
        const dmg = calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) * damage;
        // Logger.info(`Additional damage: ${dmg}`);
        hurtEntity.applyDamage(dmg);
      }
      break;
    case NachtServerAddonItemTypes.NocturiumSword:
      // 真夜中には2.5倍ダメージにまで伸びる
      if (now.isNight) {
        const dmg =
          TicksUtils.calcRateWithTicks(now.timeOfDay, 2.5, {
            from: 13_702,
            maxFrom: 17_000,
            maxTo: 19_000,
            to: 22_299,
          }) * damage;
        // Logger.info(`Additional damage: ${dmg}`);
        hurtEntity.applyDamage(dmg);
      }
      break;
    case NachtServerAddonItemTypes.LuminariumSword:
      // 真昼間には2.5倍ダメージにまで伸びる
      if (!now.isNight) {
        const dmg =
          TicksUtils.calcRateWithTicks(now.timeOfDay, 2.5, {
            from: 22_300,
            maxFrom: 5_000,
            maxTo: 7_000,
            to: 13_701,
          }) * damage;
        // Logger.info(`Additional damage: ${dmg}`);
        hurtEntity.applyDamage(dmg);
      }
      break;
    case NachtServerAddonItemTypes.TerramagniteSword:
      // 深いほどダメージが上がり，-50以下で2.5倍ダメージにまで伸びる
      if (player.location.y <= 64) {
        const dmg =
          TicksUtils.calcRateWithTicks(player.location.y, 2.5, {
            from: -64,
            maxFrom: -64,
            maxTo: -50,
            to: 64,
          }) * damage;
        // Logger.info(`Additional damage: ${dmg}`);
        hurtEntity.applyDamage(dmg);
      }
      break;
    case NachtServerAddonItemTypes.MagnosSword:
      // 5秒間火を付与する
      hurtEntity.setOnFire(5);
      break;
    case NachtServerAddonItemTypes.AedriumSword:
      // 5秒間浮遊を付与する
      hurtEntity.addEffect(MinecraftEffectTypes.Levitation, 5 * TicksPerSecond);
      break;
    case NachtServerAddonItemTypes.MagradisSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.Wither:
          const dmg = damage * 0.5;
          // Logger.info(`Additional damage: ${dmg}`);
          hurtEntity.applyDamage(dmg);
          break;
        case MinecraftEntityTypes.WitherSkeleton:
          // Logger.info(`Additional damage: ${damage}`);
          hurtEntity.applyDamage(damage);
          break;
      }
      break;
    case NachtServerAddonItemTypes.NexiatiteSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.EnderDragon:
          const dmg = damage * 0.5;
          // Logger.info(`Additional damage: ${dmg}`);
          hurtEntity.applyDamage(dmg);
          break;
        case MinecraftEntityTypes.Enderman:
        case MinecraftEntityTypes.Endermite:
          // Logger.info(`Additional damage: ${damage}`);
          hurtEntity.applyDamage(damage);
          break;
      }
      break;
    case NachtServerAddonItemTypes.SolistiteSword:
      switch (hurtEntity.typeId) {
        case MinecraftEntityTypes.Warden:
          const dmg = damage * 0.5;
          // Logger.info(`Additional damage: ${dmg}`);
          hurtEntity.applyDamage(dmg);
          break;
      }
      break;
  }
};

const reduceDamage = (health: EntityHealthComponent, reduction: number) => {
  const reduced = Math.min(health.effectiveMax, health.currentValue + reduction);
  // Logger.info(`current: ${health.currentValue}; recovered: ${reduced}`);
  health.setCurrentValue(reduced);
};

/**
 * プレイヤーがダメージを受けた場合
 *
 * @param player プレイヤー
 */
const playerHurt = (player: Entity, damageSource: EntityDamageCause, damagingEntity?: Entity, damage: number = 0) => {
  const equippable = player.getComponent(EntityComponentTypes.Equippable);
  if (equippable === undefined) {
    return;
  }
  const armorItemStacks = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet].map((es) =>
    equippable.getEquipment(es)
  );
  const health = player.getComponent(EntityComponentTypes.Health);
  if (health === undefined) {
    return;
  }

  const now = GameTime.now();

  if (armorItemStacks.every((is) => is?.hasTag('nacht:holy_silver_tier')) && damagingEntity) {
    // アンデッドからのダメージを半減する
    if (Undead.includes(damagingEntity.typeId)) {
      reduceDamage(health, damage / 2);
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:blazered_steel_tier'))) {
    // ゲーム内時間で2日間ネザーにいると2.5倍ダメージにまで伸びる
    const netherTags = player.getTags().filter((tag) => tag.startsWith(TAG_DIM_NETHER));
    if (netherTags.length > 0) {
      const [day, timeOfDay] = netherTags[0]
        .replace(TAG_DIM_NETHER, '')
        .split('_')
        .map((v) => parseInt(v));
      reduceDamage(health, (1 - 1 / (calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) + 1)) * damage);
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:hollow_crystal_tier'))) {
    // ゲーム内時間で2日間エンドにいると2.5倍ダメージにまで伸びる
    const endTags = player.getTags().filter((tag) => tag.startsWith(TAG_DIM_END));
    if (endTags.length > 0) {
      const [day, timeOfDay] = endTags[0]
        .replace(TAG_DIM_END, '')
        .split('_')
        .map((v) => parseInt(v));
      reduceDamage(health, (1 - 1 / (calcRate(2.5, new GameTime(2), new GameTime(day, timeOfDay), now) + 1)) * damage);
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:nocturium_tier'))) {
    const dmg =
      (1 -
        1 /
          (1 +
            TicksUtils.calcRateWithTicks(now.timeOfDay, 2, {
              from: 13_702,
              maxFrom: 17_000,
              maxTo: 19_000,
              to: 22_299,
            }))) *
      damage;
    // Logger.info(`Additional damage: ${dmg}`);
    reduceDamage(health, dmg);
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:luminarium_tier'))) {
    const dmg =
      (1 -
        1 /
          (1 +
            TicksUtils.calcRateWithTicks(now.timeOfDay, 2, {
              from: 22_300,
              maxFrom: 5_000,
              maxTo: 7_000,
              to: 13_701,
            }))) *
      damage;
    // Logger.info(`Additional damage: ${dmg}`);
    reduceDamage(health, dmg);
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:terramagnite_tier'))) {
    const dmg =
      (1 -
        1 /
          (1 +
            TicksUtils.calcRateWithTicks(player.location.y, 2.5, {
              from: -64,
              maxFrom: -64,
              maxTo: -50,
              to: 64,
            }))) *
      damage;
    // Logger.info(`Additional damage: ${dmg}`);
    reduceDamage(health, dmg);
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:magnos_tier'))) {
    // 炎無効
    switch (damageSource) {
      case EntityDamageCause.campfire:
      case EntityDamageCause.fire:
      case EntityDamageCause.fireTick:
      case EntityDamageCause.lava:
      case EntityDamageCause.magma:
      case EntityDamageCause.soulCampfire:
        reduceDamage(health, damage);
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:aedrium_tier'))) {
    // 落下ダメージ無効
    switch (damageSource) {
      case EntityDamageCause.fall:
        reduceDamage(health, damage);
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:magradis_tier')) && damagingEntity) {
    // ウィザースケルトン無効、ウィザー半減
    switch (damagingEntity.typeId) {
      case MinecraftEntityTypes.WitherSkeleton:
        reduceDamage(health, damage);
        break;
      case MinecraftEntityTypes.Wither:
        reduceDamage(health, damage * 0.5);
        break;
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:nexiatite_tier')) && damagingEntity) {
    // エンダーマン無効、エンダードラゴン半減
    switch (damagingEntity.typeId) {
      case MinecraftEntityTypes.Enderman:
      case MinecraftEntityTypes.Endermite:
        reduceDamage(health, damage);
        break;
      case MinecraftEntityTypes.EnderDragon:
        reduceDamage(health, damage * 0.5);
        break;
    }
  } else if (armorItemStacks.every((is) => is?.hasTag('nacht:solistite_tier')) && damagingEntity) {
    // ウォーデン半減
    switch (damagingEntity.typeId) {
      case MinecraftEntityTypes.Warden:
        reduceDamage(health, damage * 0.5);
    }
  }
};

export default () =>
  world.afterEvents.entityHurt.subscribe((event) => {
    // Logger.info(`Base damage: ${event.damage}`);
    // 安全地帯
    if (event.hurtEntity.typeId === MinecraftEntityTypes.Player) {
      if (
        SafeZoneUtils.isInSafeArea({ ...event.hurtEntity.location, dimension: event.hurtEntity.dimension }) &&
        [EntityDamageCause.entityAttack, EntityDamageCause.entityExplosion, EntityDamageCause.projectile].includes(
          event.damageSource.cause
        )
      ) {
        const health = event.hurtEntity.getComponent(EntityComponentTypes.Health);
        health?.setCurrentValue(Math.min(health.currentValue + event.damage, health.effectiveMax));
      } else {
        playerHurt(event.hurtEntity, event.damageSource.cause, event.damageSource.damagingEntity, event.damage);
      }
    } else if (event.damageSource.damagingEntity?.typeId === MinecraftEntityTypes.Player) {
      playerDamaging(event.damageSource.damagingEntity, event.hurtEntity, event.damage);
    }
  });
