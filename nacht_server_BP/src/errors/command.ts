import { NachtServerAddonError } from './base';

export class CommandProcessError extends NachtServerAddonError {}

export class UndefinedSourceOrInitiatorError extends CommandProcessError {
  constructor() {
    super('コマンドソースまたはイニシエーターが見つかりません。');
  }
}

export class CommandSourceError extends CommandProcessError {}
export class NonNPCSourceError extends CommandSourceError {
  constructor() {
    super('このコマンドはNPCのみ実行できます。');
  }
}
export class NonAdminSourceError extends CommandSourceError {
  constructor() {
    super('このコマンドはオペレーターのみ実行できます。');
  }
}
