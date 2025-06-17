import { Logger } from '../utils/logger';
import base from './base';
import entityDie from './entityDie';
import entitySpawn from './entitySpawn';
import load from './load';
import playerJoin from './playerJoin';
import transfer from './transfer';
import uneditable from './uneditable';
export default () => {
    Logger.log('Subscribing original world events...');
    base();
    entityDie();
    entitySpawn();
    load();
    playerJoin();
    transfer();
    uneditable();
};
