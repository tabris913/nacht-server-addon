import buy from "./buy";
import cleardp from "./cleardp";
import message from "./message";
import messageop from "./messageop";
import registertptarget from "./registertptarget";
import sell from "./sell";
import setdp from "./setdp";
import setlocation from "./setlocation";

export default () => {
  console.log("set commands");

  buy();
  cleardp();
  message();
  messageop();
  registertptarget();
  sell();
  setdp();
  setlocation();
};
