import { Logger } from '../utils/logger';

type LogLevel = 'warning' | 'error';

export class NachtServerAddonError extends Error {
  private _logLevel: LogLevel;

  constructor(message?: string, logLevel: LogLevel = 'error', options?: ErrorOptions) {
    super(message, options);

    this._logLevel = logLevel;
  }

  get logLevel() {
    return this._logLevel;
  }

  log = () => {
    switch (this._logLevel) {
      case 'error':
        Logger.error(this);
        break;
      case 'warning':
        Logger.warning(this);
        break;
    }
  };
}
