// Action Types
export const RECORD_COMMAND = 'RECORD_COMMAND';
export const DROP_LAST_COMMAND = 'DROP_LAST_COMMAND';
export const DROP_FROM_INDEX = 'DROP_FROM_INDEX';
export const FLUSH_COMMANDS = 'FLUSH_COMMANDS';

// Actions
export const recordCommand = (kernelID, command) => ({
    type: RECORD_COMMAND,
    payload: {
        kernel: kernelID,
        command: command
    }
});

export const dropLastCommand = (kernelID) => ({
    type: DROP_LAST_COMMAND,
    payload: {
        kernel: kernelID
    }
})

export const dropFromIndex = (kernelID, index) => ({
    type: DROP_FROM_INDEX,
    payload: {
        kernel: kernelID,
        index: index
    }
})

export const flushCommands = (kernelID) => ({
    type: FLUSH_COMMANDS,
    payload: {
        kernel: kernelID
    }
})