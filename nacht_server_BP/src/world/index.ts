import { Logger } from '../utils/logger';

import base from './base';
import entityDie from './entityDie';
import entityHit from './entityHit';
import entitySpawn from './entitySpawn';
import load from './load';
import playerDimensionChange from './playerDimensionChange';
import playerJoin from './playerJoin';
import transfer from './transfer';
import uneditable from './uneditable';

export default () => {
  Logger.log('Subscribing original world events...');

  base();
  entityDie();
  entityHit();
  entitySpawn();
  load();
  playerDimensionChange();
  playerJoin();
  transfer();
  uneditable();
};
