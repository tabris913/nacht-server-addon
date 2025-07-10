import type { Dimension, Entity, Vector3 } from '@minecraft/server';
import { isVector3 } from './TypeGuards';

const buildCommand = (runner: Entity | Dimension, ...args: Array<string | number | boolean | Vector3>) =>
  runner.runCommand(args.map((arg) => (isVector3(arg) ? `${arg.x} ${arg.y} ${arg.z}` : arg)).join(' '));

export default { buildCommand };
