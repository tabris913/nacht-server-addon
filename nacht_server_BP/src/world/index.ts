import { Logger } from '../utils/logger';

import base from './base';
import load from './load';
import transfer from './transfer';
import uneditable from './uneditable';

export default () => {
  Logger.log('set world');

  base();
  load();
  transfer();
  uneditable();
};
