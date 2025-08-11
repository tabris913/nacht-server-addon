import { flatFormatting, Formatting } from '../const';

import { Logger } from './logger';

import type { RawMessage } from '@minecraft/server';

/**
 * 文字列を装飾文字でフォーマットする
 *
 * @param message 文字列
 * @returns 装飾された文字列
 */
export const format = (message: string) => {
  try {
    return Object.entries(flatFormatting).reduce((prev, [curK, curV]) => prev.replace(`<${curK}>`, curV), message);
  } catch (error) {
    Logger.error('Failed to format the message because of', error);

    return message;
  }
};

export const formatRaw = (fmt: string, raw: RawMessage | string): RawMessage => ({
  rawtext: [{ text: fmt }, typeof raw === 'string' ? { text: raw } : raw, { text: Formatting.Reset }],
});

export const makeRawMessage = (...args: Array<string | RawMessage>): RawMessage => ({
  rawtext: args.map((arg) => (typeof arg === 'string' ? { text: arg } : arg)),
});

export const obfuscate = (message: string) => Formatting.Obfuscated + message + Formatting.Reset;

const StringUtils = { format, obfuscate };

export default StringUtils;
