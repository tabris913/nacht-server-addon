import { CustomCommandOrigin, CustomCommandSource, Entity } from '@minecraft/server';

import { TAG_OPERATOR } from '../const';
import PlayerUtils from '../utils/PlayerUtils';

import { NachtServerAddonError } from './base';

/**
 * コマンド処理エラー
 */
export class CommandProcessError extends NachtServerAddonError {}

/**
 * パラメータエラー
 */
export class ParameterError extends CommandProcessError {
  constructor(paramName: string, message: string) {
    super(`パラメータが不正です。(名前: ${paramName}, 原因: ${message})`);
  }

  static validateInteger = (paramName: string, value: number, displayName?: string) => {
    if (!Number.isInteger(value)) throw new this(paramName, `${displayName || paramName}が整数ではありません`);
  };

  static validatePositive = (paramName: string, value: number, displayName?: string) => {
    if (value <= 0) throw new this(paramName, `${displayName || paramName}が1以上ではありません`);
  };
}

/**
 * ソースエンティティ・イニシエーターのエラー
 */
export class UndefinedSourceOrInitiatorError extends CommandProcessError {
  constructor() {
    super('コマンドソースまたはイニシエーターが見つかりません。');
  }

  /**
   * 与えられたエンティティが undefined の場合は当エラーを投げる
   *
   * @param sourceEntityOrInitiator エンティティ
   */
  static validate = (sourceEntityOrInitiator?: Entity) => {
    if (sourceEntityOrInitiator === undefined) throw new this();
  };
}

/**
 * コマンドソース種別エラー
 */
export class CommandSourceError extends CommandProcessError {}

export class NonNPCSourceError extends CommandSourceError {
  constructor(source?: CustomCommandSource) {
    super(`このコマンドはNPCのみ実行できます。${source ? `${source}によって実行されました。` : ''}`);
  }

  /**
   * コマンドソース種別が NPC ダイアログでない場合は当エラーを投げる
   *
   * @param origin
   */
  static validate = (origin: CustomCommandOrigin) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue) throw new this(origin.sourceType);
  };
}

export class NonPlayerSourceError extends CommandProcessError {
  constructor(message?: string) {
    super(message || 'このコマンドはプレイヤーのみ実行できます。');
  }

  /**
   * コマンドソース種別がエンティティではない，または有効なプレイヤーが見つからなかった場合は当エラーを投げる
   *
   * @param origin
   * @returns
   */
  static validate = (origin: CustomCommandOrigin) => {
    if (origin.sourceType !== CustomCommandSource.Entity) throw new this();

    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined) throw new this();

    return player;
  };
}

export class NonAdminSourceError extends NonPlayerSourceError {
  constructor(message?: string) {
    super(message || 'このコマンドはオペレーターのみ実行できます。');
  }

  /**
   * コマンドソース種別がエンティティではない，または有効なオペレーターが見つからなかった場合は当エラーを投げる
   *
   * @param origin
   * @returns プレイヤー
   */
  static validate = (origin: CustomCommandOrigin) => {
    if (origin.sourceType !== CustomCommandSource.Entity) throw new this();

    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined || !player.hasTag(TAG_OPERATOR)) throw new this();

    return player;
  };
}
