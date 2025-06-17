import { Logger } from '../utils/logger';

import base_flag from './base_flag/index';
import nacht_feather from './nacht_feather';

export default () => {
  Logger.log('Subscribing original items...');

  base_flag();
  nacht_feather();
};
