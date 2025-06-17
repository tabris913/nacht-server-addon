import { system } from '@minecraft/server';
export var DimensionTypes;
(function (DimensionTypes) {
    DimensionTypes["Overworld"] = "overworld";
    DimensionTypes["Nether"] = "nether";
    DimensionTypes["TheEnd"] = "the_end";
})(DimensionTypes || (DimensionTypes = {}));
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
        DimensionTypes.Nether,
        DimensionTypes.Overworld,
        DimensionTypes.TheEnd,
    ]);
});
