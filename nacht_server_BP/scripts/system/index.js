import { Logger } from '../utils/logger';
import area from './area';
import base from './base';
import border from './border';
import fortune from './fortune';
export default () => {
    Logger.log('Subscribing original game systems...');
    area();
    base();
    border();
    fortune();
};
