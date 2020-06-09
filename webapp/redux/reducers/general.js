// import action types
import { 
  UPDATE_CARDS,
  MODEL_LOADED,
  SHOW_NETWORK,
  EDIT_MODEL,
  SIMULATE_NETWORK,
  CREATE_NETWORK,
  CREATE_SIMULATE_NETWORK,
  OPEN_DIALOG,
  CLOSE_DIALOG
} from '../actions/general';
import { MODEL_STATE } from '../../constants';

// Default state for general
export const GENERAL_DEFAULT_STATE = { 
  updates: 0, 
  modelLoaded: false,
  editMode: true,
  modelState: MODEL_STATE.NOT_INSTANTIATED,
  dialogOpen: false,
  dialogTitle: '',
  dialogMessage: ''
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
  case CREATE_NETWORK:
    return { editMode: false, modelState: MODEL_STATE.INSTANTIATED }
  case CREATE_SIMULATE_NETWORK:
    return { editMode: false, modelState: MODEL_STATE.SIMULATED }
  case SIMULATE_NETWORK:
    return { editMode: false, modelState: MODEL_STATE.SIMULATED }
  case EDIT_MODEL:
    return { editMode: true, updates: state.updates + 1, modelState: MODEL_STATE.NOT_INSTANTIATED }
  case OPEN_DIALOG:
    return { dialogOpen: true, dialogTitle: action.payload.title, dialogMessage: action.payload.message }
  case CLOSE_DIALOG:
    return { dialogOpen: false }
  default: {
    return { ...state };
  }
  }
}
