export class NachtServerAddonError extends Error {
    constructor(message, logLevel = "error", options) {
        super(message, options);
        this.log = () => {
            switch (this._logLevel) {
                case "error":
                    console.error(this);
                    break;
                case "warning":
                    console.warn(this);
                    break;
            }
        };
        this._logLevel = logLevel;
    }
    get logLevel() {
        return this._logLevel;
    }
}
