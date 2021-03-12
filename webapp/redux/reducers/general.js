// import action types
import * as Actions from '../actions/general';
import { MODEL_STATE } from '../../constants';

// Default state for general
export const GENERAL_DEFAULT_STATE = {
  updates: 0,
  modelLoaded: false,
  editMode: true,
  modelState: MODEL_STATE.NOT_INSTANTIATED,
  dialogOpen: false,
  dialogTitle: '',
  dialogMessage: '',
  automaticSimulation: false,
  automaticInstantiation: true,
  theme: 'gui',
};

// reducer function
export default function reduceGeneral (state = GENERAL_DEFAULT_STATE, action) {
  switch (action.type) {
    case Actions.UPDATE_CARDS:
      return { ...state, updates: state.updates + 1 };
    case Actions.MODEL_LOADED:
      return { ...state, modelLoaded: true };
    case Actions.SHOW_NETWORK:
      return { ...state, editMode: false };
    case Actions.CREATE_NETWORK:
      return { ...state, editMode: false, modelState: MODEL_STATE.INSTANTIATED };
    case Actions.CREATE_SIMULATE_NETWORK:
      return { ...state, editMode: false, modelState: MODEL_STATE.SIMULATED };
    case Actions.SIMULATE_NETWORK:
      return { ...state, editMode: false, modelState: MODEL_STATE.SIMULATED };
    case Actions.EDIT_MODEL:
      return { ...state, editMode: true, updates: state.updates + 1 };
    case Actions.RESET_MODEL:
      return GENERAL_DEFAULT_STATE;
    case Actions.OPEN_DIALOG:
      return {
        ...state, dialogOpen: true, dialogTitle: action.payload.title, dialogMessage: action.payload.message,
      };
    case Actions.CLOSE_DIALOG:
      return { ...state, dialogOpen: false };
    case Actions.AUTOMATIC_INSTANTIATION: {
      return { ...state, automaticInstantiation: action.payload, automaticSimulation: state.automaticSimulation && action.payload };
    }
    case Actions.AUTOMATIC_SIMULATION: {
      return { ...state, automaticSimulation: action.payload, automaticInstantiation: action.payload || state.automaticInstantiation };
    }
    case Actions.SET_THEME: {
      return { ...state, theme: action.payload };
    }
    default: {
      return state;
    }
  }
}
