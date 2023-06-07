// Action Types
export const UPDATE_CONSOLE = 'UPDATE_CONSOLE';

// Actions
export const updateConsole = (commands) => ({
  type: UPDATE_CONSOLE,
  payload: commands
});