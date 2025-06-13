import { Logger } from '../utils/logger';

import base from './base';
import prepare_point from './prepare_point';
import transfer from './transfer';
import uneditable from './uneditable';

export default () => {
  Logger.log('set world');

  base();
  prepare_point();
  transfer();
  uneditable();
};
