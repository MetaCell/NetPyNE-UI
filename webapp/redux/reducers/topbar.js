// import action types
import { OPEN_TOPBAR_DIALOG, CLOSE_TOPBAR_DIALOG, CHANGE_PAGE_TRANSITION_MODE } from '../actions/topbar';
import { TOPBAR_CONSTANTS } from '../../constants';
import { CLOSE_BACKEND_ERROR_DIALOG } from '../actions/errors';
import { CLOSE_DRAWER_DIALOG_BOX } from '../actions/drawer';

// Default state for general
export const TOPBAR_DEFAULT_STATE = {
  dialogOpen: false,
  dialogName: '',
  pageTransitionMode: TOPBAR_CONSTANTS.CREATE_NETWORK,
};

// reducer
function reduceTopbar (state, action) {
  switch (action.type) {
    case OPEN_TOPBAR_DIALOG:
      return { dialogOpen: true, dialogName: action.payload, dialogMetadata: action.metadata };
    case CLOSE_TOPBAR_DIALOG:
    case CLOSE_BACKEND_ERROR_DIALOG:
    case CLOSE_DRAWER_DIALOG_BOX:
      return { ...TOPBAR_DEFAULT_STATE };
    case CHANGE_PAGE_TRANSITION_MODE:
      return { pageTransitionMode: action.payload };
    default: {
      return { ...state };
    }
  }
}

export default (state = { ...TOPBAR_DEFAULT_STATE }, action) => ({
  ...state,
  ...reduceTopbar(state, action),
});
// reducer function
