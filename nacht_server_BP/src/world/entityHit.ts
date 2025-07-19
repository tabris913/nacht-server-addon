import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, world } from '@minecraft/server';

import { Undead } from '../const';
import { MinecraftEntityTypes } from '../types/index';
import SafeZoneUtils from '../utils/SafeZoneUtils';

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

    const damagingEntity = event.damageSource.damagingEntity;
    if (damagingEntity?.typeId === MinecraftEntityTypes.Player) {
      const mainhandItemStack = damagingEntity
        .getComponent(EntityComponentTypes.Equippable)
        ?.getEquipment(EquipmentSlot.Mainhand);
      if (mainhandItemStack?.hasTag('nacht:holy_silver_tier')) {
        if (Undead.includes(event.hurtEntity.typeId)) {
          // 霊銀装備はアンデッドに2倍ダメージ
          event.hurtEntity.applyDamage(event.damage);
        }
      } else if (mainhandItemStack?.hasTag('nacht:blazered_steel_tier')) {
        //
      } else if (mainhandItemStack?.hasTag('nacht:holly_crystal_tier')) {
        //
      }
    }
  });
