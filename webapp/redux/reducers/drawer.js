// import action types
import { OPEN_DRAWER_DIALOG_BOX, CLOSE_DRAWER_DIALOG_BOX } from '../actions/drawer';

// Default state for general
export const DRAWER_DEFAULT_STATE = { dialogBoxOpen: false };

// reducer
export default (state = DRAWER_DEFAULT_STATE, action) => ({
  ...state,
  ...reduceError(state, action),
});

// reducer function
function reduceError (state, action) {
  switch (action.type) {
    case OPEN_DRAWER_DIALOG_BOX:
      return { dialogBoxOpen: true };
    case CLOSE_DRAWER_DIALOG_BOX:
      return { ...DRAWER_DEFAULT_STATE };
    default: {
      return { ...state };
    }
  }
}
