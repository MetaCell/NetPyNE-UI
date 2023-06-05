// Action Types
export const UPDATE_CONSOLE = 'OPEN_DRAWER_DIALOG_BOX';

// Actions
export const updateConsole = (commands) => ({
  type: UPDATE_CONSOLE,
  payload: commands
});