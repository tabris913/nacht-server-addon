import areaparticle from "./areaparticle";
import buy from "./buy";
import cleardp from "./cleardp";
import fill from "./fill";
import message from "./message";
import messageop from "./messageop";
import registertptarget from "./registertptarget";
import sell from "./sell";
import setdp from "./setdp";
import setlocation from "./setlocation";
import setparticle from "./setparticle";
import testparams from "./testparams";

export default () => {
  console.log("set commands");

  areaparticle();
  buy();
  cleardp();
  fill();
  message();
  messageop();
  registertptarget();
  sell();
  setdp();
  setparticle();
  setlocation();
  testparams();
};
