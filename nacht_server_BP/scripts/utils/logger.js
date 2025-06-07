const getDateString = () => new Date().toISOString();
export const Logger = {
    debug: (...data) => {
        console.log(`${`[${getDateString()}]`} | [DEBUG]`, ...data);
    },
    error: (...data) => {
        console.error(`${`[${getDateString()}]`} |`, ...data);
    },
    info: (...data) => {
        console.info(`${`[${getDateString()}]`} |`, ...data);
    },
    log: (...data) => {
        console.info(`${`[${getDateString()}]`} |`, ...data);
    },
    warning: (...data) => {
        console.warn(`${`[${getDateString()}]`} |`, ...data);
    },
};
