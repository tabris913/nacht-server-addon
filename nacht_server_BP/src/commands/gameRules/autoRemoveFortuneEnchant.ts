import { CustomCommandStatus, world } from "@minecraft/server";
import { RuleName } from "../gamerule";
import { PREFIX_GAMERULE } from "../../const";

/**
 * 幸運エンチャント自動除去機能のオンオフを設定する
 *
 * @param value オンオフフラグ
 * @returns
 */
export const setAutoRemoveFortuneEnchant = (value: string) => {
  const converted = value.toLowerCase() === "true";

  world.setDynamicProperty(
    PREFIX_GAMERULE + RuleName.autoRemoveFortuneEnchant,
    converted
  );

  return {
    message: `${RuleName.autoRemoveFortuneEnchant}に${converted}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};

/**
 * 幸運エンチャント自動除去機能の実行間隔を設定する
 *
 * @param value インターバル [ticks]
 * @returns
 */
export const setAutoRemoveFortuneEnchantInterval = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: "設定する値は整数でなければなりません。",
      status: CustomCommandStatus.Failure,
    };
  }
  const interval = parseInt(value);

  world.setDynamicProperty(
    PREFIX_GAMERULE + RuleName.autoRemoveFortuneEnchantInterval,
    interval
  );

  return {
    message: `${RuleName.autoRemoveFortuneEnchantInterval}に${interval}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};
