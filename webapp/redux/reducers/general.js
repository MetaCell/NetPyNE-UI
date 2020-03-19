// import action types
import { UPDATE_CARDS, MODEL_LOADED, modelLoaded } from '../actions/general';

// Default state for general
export const GENERAL_DEFAULT_STATE = { 
  updates: 0, 
  modelLoaded: false 
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
  default: {
    return { ...state };
  }
  }
}
