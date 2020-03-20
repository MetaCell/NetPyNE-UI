// import action types
import { UPDATE_CARDS, MODEL_LOADED, SHOW_NETWORK, EDIT_MODEL } from '../actions/general';

// Default state for general
export const GENERAL_DEFAULT_STATE = { 
  updates: 0, 
  modelLoaded: false,
  editMode: true
};

// reducer
export default ( state = GENERAL_DEFAULT_STATE, action ) => ({ 
  ...state, 
  ...reduceGeneral(state, action) 
});


// reducer function
function reduceGeneral (state, action) {
  switch (action.type) {
  case UPDATE_CARDS:
    return { updates: state.updates + 1 }
  case MODEL_LOADED: 
    return { modelLoaded: true }
  case SHOW_NETWORK:
    return { editMode: false }
  case EDIT_MODEL:
    return { editMode: true }
  default: {
    return { ...state };
  }
  }
}
