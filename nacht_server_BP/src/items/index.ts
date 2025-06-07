import base_flag from "./base_flag";
import nacht_feather from "./nacht_feather";
import { Logger } from "../utils/logger";

export default () => {
  Logger.log("set items");

  base_flag();
  nacht_feather();
};
