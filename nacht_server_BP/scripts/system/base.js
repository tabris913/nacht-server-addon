import { system, TicksPerDay } from "@minecraft/server";
export default () => system.runInterval(() => {
    //
}, TicksPerDay);
