import { NachtServerAddonError } from './base';

export class LocationError extends NachtServerAddonError {}

export class LengthError extends LocationError {
  constructor(variableName: string) {
    super(`${variableName} は0より大きい必要があります。`);
  }
}
