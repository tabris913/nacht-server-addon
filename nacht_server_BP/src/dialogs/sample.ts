import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

export const show_confirm = (player: Player) => {
  const form = new ModalFormData();

  form.title("");
  form.textField("なはとへの愛のメッセージ", "");
  form.slider("好き度", 0, 100, { defaultValue: 50, valueStep: 1 });
  form.dropdown("好き度", ["愛してる", "大好き", "好き"]);
  form.toggle("好き");
  form.submitButton("愛を伝える");

  form.show(player).then((response) => {
    if (response.canceled) {
      return;
    }
    player.runCommand(`tell nacht9480 ${String(response.formValues?.[0])}`);
    player.runCommand(
      `tell nacht9480 好き度: ${String(response.formValues?.[1])}`
    );
    player.runCommand(`tell nacht9480 ${String(response.formValues?.[2])}`);
    player.runCommand(`tell nacht9480 ${String(response.formValues?.[3])}`);
  });
};
