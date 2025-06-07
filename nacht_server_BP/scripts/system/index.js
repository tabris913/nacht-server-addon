import { Logger } from "../utils/logger";
import area from "./area";
import fortune from "./fortune";
export default () => {
    Logger.log("set system");
    area();
    fortune();
};
