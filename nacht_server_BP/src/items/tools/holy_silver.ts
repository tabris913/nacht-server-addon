import { system, world } from '@minecraft/server';

export default () => {
  world.afterEvents.entityHurt.subscribe(event => event.damageSource)
};
