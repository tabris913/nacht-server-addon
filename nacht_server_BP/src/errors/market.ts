import { NachtServerAddonError } from './base';

export class PointlessError extends NachtServerAddonError {
  constructor() {
    super('ポイントが足りません。');
  }
}
