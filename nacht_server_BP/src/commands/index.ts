import { Logger } from '../utils/logger';

import buy from './buy';
import buybase from './buybase';
import cleardp from './cleardp';
import fill from './fill';
import gamerule from './gamerule';
import getdp from './getdp';
import message from './message';
import messageop from './messageop';
import migrate from './migrate';
import registertptarget from './registertptarget';
import renamedp from './renamedp';
import sell from './sell';
import setdp from './setdp';

export default () => {
  Logger.log('set commands');

  buy();
  buybase();
  cleardp();
  fill();
  gamerule();
  getdp();
  migrate();
  message();
  messageop();
  registertptarget();
  renamedp();
  sell();
  setdp();
};
