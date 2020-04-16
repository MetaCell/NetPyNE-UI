// import action types
import { OPEN_TOPBAR_DIALOG, CLOSE_TOPBAR_DIALOG, CHANGE_PAGE_TRANSITION_MODE } from '../actions/topbar';
import { TOPBAR_CONSTANTS } from '../../constants'

// Default state for general
export const TOPBAR_DEFAULT_STATE = { 
  dialogOpen: false,
  dialogName: '',
  pageTransitionMode: TOPBAR_CONSTANTS.CREATE_NETWORK
};

// reducer
export default ( state = TOPBAR_DEFAULT_STATE, action ) => ({ 
  ...state, 
  ...reduceError(state, action) 
});


// reducer function
function reduceError (state, action) {
  switch (action.type) {
  case OPEN_TOPBAR_DIALOG:
    return { dialogOpen: true, dialogName: action.payload }
  case CLOSE_TOPBAR_DIALOG:
    return TOPBAR_DEFAULT_STATE
  case CHANGE_PAGE_TRANSITION_MODE:
    return { pageTransitionMode: action.payload }
  default: {
    return { ...state };
  }
  }
}
