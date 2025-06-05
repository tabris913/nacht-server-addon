import { NachtServerAddonError } from "./base";
export class DynamicPropertyError extends NachtServerAddonError {
}
export class DynamicPropertyNotFoundError extends DynamicPropertyError {
    constructor(id) {
        super(`${id}というグローバル変数は存在しません。`);
    }
}
