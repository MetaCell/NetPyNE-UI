// import action types
import { UPDATE_CONSOLE } from '../actions/console';

// Default state for general
export const INITIAL_CONSOLE_STATE = { commands: {} };

// reducer function
function consoleReducer (state, action) {
  switch (action.type) {
    case UPDATE_CONSOLE:
      return { commands: action.payload.commands };
    }
}

// reducer
export default (state = INITIAL_CONSOLE_STATE, action) => ({
  ...state,
  ...consoleReducer(state, action),
});
