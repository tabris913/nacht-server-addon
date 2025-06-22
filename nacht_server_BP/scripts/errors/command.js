import { NachtServerAddonError } from './base';
export class CommandProcessError extends NachtServerAddonError {
}
export class UndefinedSourceOrInitiatorError extends CommandProcessError {
    constructor() {
        super('コマンドソースまたはイニシエーターが見つかりません。');
    }
}
export class CommandSourceError extends CommandProcessError {
}
export class NonNPCSourceError extends CommandSourceError {
    constructor(source) {
        super(`このコマンドはNPCのみ実行できます。${source ? `${source}によって実行されました。` : ''}`);
    }
}
export class NonAdminSourceError extends CommandSourceError {
    constructor() {
        super('このコマンドはオペレーターのみ実行できます。');
    }
}
