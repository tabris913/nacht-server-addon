const getDateString = () => new Date().toISOString();

export const Logger = {
  error: (...data: Array<any>) => {
    console.error(`${`[${getDateString()}]`} |`, ...data);
  },
  info: (...data: Array<any>) => {
    console.info(`${`[${getDateString()}]`} |`, ...data);
  },
  log: (...data: Array<any>) => {
    console.info(`${`[${getDateString()}]`} |`, ...data);
  },
  warning: (...data: Array<any>) => {
    console.warn(`${`[${getDateString()}]`} |`, ...data);
  },
};
