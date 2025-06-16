import { Logger } from '../utils/logger';

import base from './base';
import entitySpawn from './entitySpawn';
import load from './load';
import transfer from './transfer';
import uneditable from './uneditable';

export default () => {
  Logger.log('set world');

  base();
  entitySpawn();
  load();
  transfer();
  uneditable();
};
