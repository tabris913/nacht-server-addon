import {
  CommandPermissionLevel,
  type CommandResult,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  Player,
  system,
} from '@minecraft/server';

import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';

import { registerCommand } from './common';
import { SuccessOrFailure } from './enum';

const addTagCommand: CustomCommand = {
  name: 'nacht:addtag',
  description: 'コマンドの成否によってタグを付与する。',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.EntitySelector },
    { name: 'command', type: CustomCommandParamType.String },
    { name: 'nacht:successOrFailure', type: CustomCommandParamType.Enum },
    { name: 'tag1', type: CustomCommandParamType.String },
  ],
  optionalParameters: [
    { name: 'nacht:successOrFailure', type: CustomCommandParamType.Enum },
    { name: 'tag2', type: CustomCommandParamType.String },
  ],
};

/**
 *
 * @param origin
 * @param command
 * @param successOrFailure1
 * @param tag1
 * @param target
 * @param successOrFailure2
 * @param tag2
 * @returns
 * @throws This function can throw error.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (
  { initiator, sourceEntity, sourceType }: CustomCommandOrigin,
  target: Array<Player>,
  command: string,
  successOrFailure1: SuccessOrFailure,
  tag1: string,
  successOrFailure2?: SuccessOrFailure,
  tag2?: string
): CustomCommandResult => {
  if (sourceType !== CustomCommandSource.NPCDialogue) throw new NonNPCSourceError(sourceType);
  if (sourceEntity === undefined || initiator === undefined) throw new UndefinedSourceOrInitiatorError();

  target.forEach((entity) => {
    system.runTimeout(() => {
      try {
        let res: CommandResult;
        if (command.includes('%es')) {
          res = sourceEntity.runCommand(command.replace('%es', entity.nameTag));
        } else {
          res = sourceEntity.runCommand(command);
        }
        if (res.successCount) {
          // success
          if (successOrFailure1 === SuccessOrFailure.Success) {
            initiator.addTag(tag1);
          }
          if (successOrFailure2 === SuccessOrFailure.Success && tag2) {
            initiator.addTag(tag2);
          }
        } else {
          // failure
          if (successOrFailure1 === SuccessOrFailure.Failure) {
            initiator.addTag(tag1);
          }
          if (successOrFailure2 === SuccessOrFailure.Failure && tag2) {
            initiator.addTag(tag2);
          }
        }
      } catch (error) {
        // failure with error
        if (successOrFailure1 === SuccessOrFailure.Failure) {
          initiator.addTag(tag1);
        }
        if (successOrFailure2 === SuccessOrFailure.Failure && tag2) {
          initiator.addTag(tag2);
        }

        throw error;
      }
    }, 1);
  });

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(addTagCommand, commandProcess));
