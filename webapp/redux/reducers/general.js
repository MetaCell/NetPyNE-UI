// import action types
import * as Actions from '../actions/general';
import { MODEL_STATE } from '../../constants';

// Default state for general
export const GENERAL_DEFAULT_STATE = {
  updates: 0,
  editMode: true,
  modelState: MODEL_STATE.NOT_INSTANTIATED,
  dialogOpen: false,
  dialogTitle: '',
  dialogMessage: '',
  confirmationDialogTitle: '',
  confirmationDialogMessage: '',
  confirmationDialogOnConfirm: {},
  automaticSimulation: false,
  automaticInstantiation: false,
  confirmationDialogOpen: false,
  theme: 'gui',
  instances: [],
};

const applySelection = (data, selectedInstances) => {
  const smap = new Map(selectedInstances.map((i) => [i, true]));
  const newData = data.map((item) => ({
    ...item,
    selected: false,
  }));
  const dmap = new Map(newData.map((i) => [i.instancePath, true]));

  smap.forEach((value, key) => {
    const item = dmap.get(key);
    if (!item) {
      newData.push({
        instancePath: key,
        color: undefined,
        selected: true,
      });
    }
  });
  const canvasData = newData.filter((item) => {
    if ((item?.selected !== undefined && item?.selected === false) && item?.color === undefined) {
      return false;
    }
    return true;
  });
  return canvasData;
};

// reducer function
export default function reduceGeneral (state = GENERAL_DEFAULT_STATE, action) {
  switch (action.type) {
    case Actions.UPDATE_CARDS:
      return { ...state, updates: state.updates + 1 };
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
    case Actions.OPEN_CONFIRMATION_DIALOG:
      return {
        ...state,
        confirmationDialogOpen: true,
        confirmationDialogTitle: action.payload.title,
        confirmationDialogMessage: action.payload.message,
        confirmationDialogOnConfirm: action.payload.onConfirm,
      };
    case Actions.CLOSE_CONFIRMATION_DIALOG:
      return {
        ...state, confirmationDialogOpen: false, dialogTitle: '', dialogMessage: '', confirmationDialogOnConfirm: {},
      };
    case Actions.AUTOMATIC_INSTANTIATION: {
      return { ...state, automaticInstantiation: action.payload, automaticSimulation: state.automaticSimulation && action.payload };
    }
    case Actions.AUTOMATIC_SIMULATION: {
      return { ...state, automaticSimulation: action.payload, automaticInstantiation: action.payload || state.automaticInstantiation };
    }
    case Actions.SET_THEME: {
      return { ...state, theme: action.payload };
    }
    case Actions.CHANGE_INSTANCE_COLOR: {
      return { ...state, instances: [...action.data.instance] };
    }
    case Actions.ADD_CANVAS_INSTANCES: {
      return { ...state, instances: [...state.instances, ...action.instances] };
    }
    case Actions.REMOVE_CANVAS_INSTANCES: {
      return { ...state };
    }
    case Actions.SELECT_INSTANCE: {
      const newData = applySelection(action.data.instance, action.data.selectedInstances);
      return { ...state, instances: [...newData] };
    }
    default: {
      return state;
    }
  }
}
