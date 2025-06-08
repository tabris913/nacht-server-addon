import { Logger } from '../utils/logger';
import area from './area';
import border from './border';
import fortune from './fortune';
export default () => {
    Logger.log('set system');
    area();
    border();
    fortune();
};
