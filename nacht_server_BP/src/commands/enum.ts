import { system } from '@minecraft/server';

export enum DimensionTypes {
  Overworld = 'overworld',
  Nether = 'nether',
  TheEnd = 'the_end',
}

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
      DimensionTypes.Nether,
      DimensionTypes.Overworld,
      DimensionTypes.TheEnd,
    ]);
  });
