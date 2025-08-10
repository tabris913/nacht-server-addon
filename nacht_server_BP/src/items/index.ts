import { Logger } from '../utils/logger';

import base_flag from './base_flag/index';
import elixir from './elixir';
import guide_book from './guide_book/index';
import nacht_feather from './nacht_feather';
import poor_elixir from './poor_elixir';

export default () => {
  Logger.log('Subscribing original items...');

  base_flag();
  elixir();
  guide_book();
  nacht_feather();
  poor_elixir();
};
