import { Logger } from "../utils/logger";
import base from "./base";
import prepare_point from "./prepare_point";
export default () => {
    Logger.log("set world");
    base();
    prepare_point();
};
