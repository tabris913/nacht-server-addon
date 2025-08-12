import { TicksPerDay, world } from '@minecraft/server';

import { TAG_DIM_END, TAG_DIM_NETHER, TAG_DIM_OW } from '../const';
import { MinecraftDimensionTypes } from '../types/index';

// TODO 死んだときにどうなるか要確認

export default () =>
  world.afterEvents.playerDimensionChange.subscribe((event) => {
    switch (event.toDimension.id) {
      case MinecraftDimensionTypes.Nether:
        event.player.addTag(TAG_DIM_NETHER + `${world.getDay()}_${world.getTimeOfDay()}`);
        break;
      case MinecraftDimensionTypes.Overworld:
        event.player.addTag(TAG_DIM_OW + `${world.getDay()}_${world.getTimeOfDay()}`);
        break;
      case MinecraftDimensionTypes.TheEnd:
        event.player.addTag(TAG_DIM_END + `${world.getDay()}_${world.getTimeOfDay()}`);
    }
    switch (event.fromDimension.id) {
      case MinecraftDimensionTypes.Nether:
        event.player
          .getTags()
          .filter((tag) => tag.startsWith(TAG_DIM_NETHER))
          .forEach((tag) => event.player.removeTag(tag));
        break;
      case MinecraftDimensionTypes.Overworld:
        event.player
          .getTags()
          .filter((tag) => tag.startsWith(TAG_DIM_OW))
          .forEach((tag) => event.player.removeTag(tag));
        break;
      case MinecraftDimensionTypes.TheEnd:
        event.player
          .getTags()
          .filter((tag) => tag.startsWith(TAG_DIM_END))
          .forEach((tag) => event.player.removeTag(tag));
    }
  });
