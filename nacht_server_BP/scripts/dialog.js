import { ModalFormData } from "@minecraft/server-ui";
export const show_confirm = (player) => {
    const form = new ModalFormData();
    form.title("");
    form.textField("なはとへの愛のメッセージ", "");
    form.slider("好き度", 0, 100, { defaultValue: 50, valueStep: 1 });
    form.dropdown("好き度", ["愛してる", "大好き", "好き"]);
    form.toggle("好き");
    form.submitButton("愛を伝える");
    form.show(player).then((response) => {
        var _a, _b, _c, _d;
        if (response.canceled) {
            return;
        }
        player.runCommand(`tell nacht9480 ${String((_a = response.formValues) === null || _a === void 0 ? void 0 : _a[0])}`);
        player.runCommand(`tell nacht9480 好き度: ${String((_b = response.formValues) === null || _b === void 0 ? void 0 : _b[1])}`);
        player.runCommand(`tell nacht9480 ${String((_c = response.formValues) === null || _c === void 0 ? void 0 : _c[2])}`);
        player.runCommand(`tell nacht9480 ${String((_d = response.formValues) === null || _d === void 0 ? void 0 : _d[3])}`);
    });
};
