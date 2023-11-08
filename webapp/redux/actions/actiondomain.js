// Action Types
export const RECORD_COMMAND = 'RECORD_COMMAND';
export const REPLAY_COMMANDS = 'REPLAY_COMMANDS';

// Actions
export const recordCommand = (kernelID, command) => ({
    type: RECORD_COMMAND,
    payload: {
        kernel: kernelID,
        command: command
    }
});

export const replayCommands = (kernelID) => ({
    type: REPLAY_COMMANDS,
    payload: {
        kernel: kernelID
    }
})