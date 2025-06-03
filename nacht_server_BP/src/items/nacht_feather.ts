import { system, TicksPerSecond, type Vector3, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Formatting, LOC_ERSTE } from "../const";
import { sendMessageToOps } from "../utils/player";
import { getLocationDps } from "../utils/dp";

// なはとの羽根

type TeleportTarget = {
  displayName: string;
  dimension: string;
  location: Vector3;
};
type TeleportTarget2 = TeleportTarget & { dpId?: string };

export default () =>
  world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.type.id === "nacht:nacht_feather") {
      event.source.sendMessage(
        `${event.source.name}は　なはとの羽根を　ほうりなげた！`
      );
      const tpTargets: Array<TeleportTarget2> = [
        {
          dimension: "overworld",
          displayName: "Erste",
          location: LOC_ERSTE,
        },
      ];
      getLocationDps(event.source.nameTag).forEach((ttId) =>
        tpTargets.push({
          ...JSON.parse(world.getDynamicProperty(ttId) as string),
          dpId: ttId,
        })
      );
      const choices = tpTargets.map((tt) => tt.displayName);

      const form = new ModalFormData();
      form.title("テレポート");
      form.dropdown("転移先", choices, { defaultValueIndex: 0 });
      form.toggle("削除");
      form.submitButton("決定");

      form.show(event.source).then((response) => {
        if (response.canceled) {
          return;
        }
        const selectedIndex = response.formValues?.[0] as number;
        const deleteFlag = response.formValues?.[1] as boolean;
        const target = tpTargets[selectedIndex];
        if (target) {
          if (deleteFlag) {
            if (target.dpId) {
              const deleteForm = new ActionFormData();
              deleteForm.title(`${target.displayName} を削除しますか?`);
              deleteForm.button("はい");
              deleteForm.button("いいえ");

              deleteForm.show(event.source).then((deleteResponse) => {
                if (deleteResponse.canceled) {
                  return;
                }
                switch (deleteResponse.selection) {
                  case 0:
                    // はい
                    world.setDynamicProperty(target.dpId!, undefined);
                    event.source.sendMessage(
                      `${target.displayName}を削除しました`
                    );
                    break;
                  case 1:
                    // いいえ
                    event.source.sendMessage(
                      `${target.displayName}の削除を取り消しました`
                    );
                }
              });
            } else {
              event.source.sendMessage(
                `${Formatting.Color.RED}${target.displayName}は削除できません`
              );
            }
          } else {
            system.runTimeout(
              () =>
                event.source.teleport(target.location, {
                  dimension: world.getDimension(target.dimension),
                }),
              TicksPerSecond / 2
            );
          }
        } else {
          // みつからないよ
          event.source.sendMessage(
            `${Formatting.Color.GOLD}${choices[selectedIndex]}が見つかりませんでした。オペレーターにもメッセージを送りますがログインしてない際は届きません。見落とす場合もあるので対応がない場合は別途ご連絡ください`
          );
          sendMessageToOps(
            `${Formatting.Color.GOLD}${event.source.nameTag}が転移先「${choices[selectedIndex]}」の操作に失敗しました`
          );
        }
      });
    }
  });
