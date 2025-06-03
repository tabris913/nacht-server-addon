import base from "./base";
import prepare_point from "./prepare_point";
export default () => {
    console.log("set world");
    base();
    prepare_point();
};
