var _a, _b, _c, _d, _e;
import { CustomCommandSource } from '@minecraft/server';
import { TAG_OPERATOR } from '../const';
import PlayerUtils from '../utils/PlayerUtils';
import { NachtServerAddonError } from './base';
/**
 * コマンド処理エラー
 */
export class CommandProcessError extends NachtServerAddonError {
}
/**
 * パラメータエラー
 */
export class ParameterError extends CommandProcessError {
    constructor(paramName, message) {
        super(`パラメータが不正です。(名前: ${paramName}, 原因: ${message})`);
    }
}
_a = ParameterError;
ParameterError.validateInteger = (paramName, value, displayName) => {
    if (!Number.isInteger(value))
        throw new _a(paramName, `${displayName || paramName}が整数ではありません`);
};
ParameterError.validatePositive = (paramName, value, displayName) => {
    if (value <= 0)
        throw new _a(paramName, `${displayName || paramName}が1以上ではありません`);
};
/**
 * ソースエンティティ・イニシエーターのエラー
 */
export class UndefinedSourceOrInitiatorError extends CommandProcessError {
    constructor() {
        super('コマンドソースまたはイニシエーターが見つかりません。');
    }
}
_b = UndefinedSourceOrInitiatorError;
/**
 * 与えられたエンティティが undefined の場合は当エラーを投げる
 *
 * @param sourceEntityOrInitiator エンティティ
 */
UndefinedSourceOrInitiatorError.validate = (sourceEntityOrInitiator) => {
    if (sourceEntityOrInitiator === undefined)
        throw new _b();
};
/**
 * コマンドソース種別エラー
 */
export class CommandSourceError extends CommandProcessError {
}
export class NonNPCSourceError extends CommandSourceError {
    constructor(source) {
        super(`このコマンドはNPCのみ実行できます。${source ? `${source}によって実行されました。` : ''}`);
    }
}
_c = NonNPCSourceError;
/**
 * コマンドソース種別が NPC ダイアログでない場合は当エラーを投げる
 *
 * @param origin
 */
NonNPCSourceError.validate = (origin) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue)
        throw new _c(origin.sourceType);
};
export class NonPlayerSourceError extends CommandProcessError {
    constructor(message) {
        super(message || 'このコマンドはプレイヤーのみ実行できます。');
    }
}
_d = NonPlayerSourceError;
/**
 * コマンドソース種別がエンティティではない，または有効なプレイヤーが見つからなかった場合は当エラーを投げる
 *
 * @param origin
 * @returns
 */
NonPlayerSourceError.validate = (origin) => {
    if (origin.sourceType !== CustomCommandSource.Entity)
        throw new _d();
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new _d();
    return player;
};
export class NonAdminSourceError extends NonPlayerSourceError {
    constructor(message) {
        super(message || 'このコマンドはオペレーターのみ実行できます。');
    }
}
_e = NonAdminSourceError;
/**
 * コマンドソース種別がエンティティではない，または有効なオペレーターが見つからなかった場合は当エラーを投げる
 *
 * @param origin
 * @returns プレイヤー
 */
NonAdminSourceError.validate = (origin) => {
    if (origin.sourceType !== CustomCommandSource.Entity)
        throw new _e();
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined || !player.hasTag(TAG_OPERATOR))
        throw new _e();
    return player;
};
