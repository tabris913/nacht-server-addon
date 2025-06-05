// Dynamic Properties
export const PREFIX_BASE = "nacht:base_";
export const PREFIX_GAMERULE = "nacht:gamerule_";
export const PREFIX_LOCATION = "nacht:location_";
// Formatting
export const Formatting = {
    Color: {
        BLACK: "§0",
        DARK_BLUE: "§1",
        DARK_GREEN: "§2",
        DARK_AQUA: "§3",
        DARK_RED: "§4",
        DARK_PURPLE: "§5",
        GOLD: "§6",
        GRAY: "§7",
        DARK_GRAY: "§8",
        BLUE: "§9",
        GREEN: "§a",
        AQUA: "§b",
        RED: "§c",
        LIGHT_PURPLE: "§d",
        YELLOW: "§e",
        WHITE: "§f",
        MINECOIN_GOLD: "§g",
        MATERIAL_QUARTZ: "§h",
        MATERIAL_IRON: "§i",
        MATERIAL_NETHERITE: "§j",
        MATERIAL_REDSTONE: "§m",
        MATERIAL_COPPER: "§n",
        MATERIAL_GOLD: "§p",
        MATERIAL_EMERALD: "§q",
        MATERIAL_DIAMOND: "§s",
        MATERIAL_LAPIS: "§t",
        MATERIAL_AMETHYST: "§u",
    },
    Obfuscated: "§k",
    Bold: "§l",
    Italic: "§o",
    Reset: "§r",
};
export const flatFormatting = Object.entries(Formatting).reduce((prev, [curK, curV]) => curK !== "Color"
    ? Object.assign(Object.assign({}, prev), { [curK.toLowerCase()]: curV }) : Object.assign(Object.assign({}, prev), Object.entries(curV).reduce((prev2, [cur2K, cur2V]) => (Object.assign(Object.assign({}, prev2), { [cur2K.toLowerCase()]: cur2V })), {})), {});
// Game rule
export const COMMAND_MODIFICATION_BLOCK_LIMIT = 32768;
// Location
export const LOC_ERSTE = { x: -10, y: 63, z: 0 };
// Scoreboard
export const SCOREBOARD_POINT = "point";
// Tag
export const TAG_OPERATOR = "OP";
