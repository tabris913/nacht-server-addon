import { Logger } from '../utils/logger';
export class NachtServerAddonError extends Error {
    constructor(message, logLevel = 'error', options) {
        super(message, options);
        this.log = () => {
            switch (this._logLevel) {
                case 'error':
                    Logger.error(this);
                    break;
                case 'warning':
                    Logger.warning(this);
                    break;
            }
        };
        this._logLevel = logLevel;
    }
    get logLevel() {
        return this._logLevel;
    }
}
