import { setWidgets } from '@metacell/geppetto-meta-client/common/actions';
import { PYTHON_CONSOLE_WIDGET, WidgetStatus } from '../../constants';

// Action Types
export const UPDATE_CARDS = 'UPDATE_CARDS';
export const MODEL_LOADED = 'NETPYNE_MODEL_LOADED';
export const SHOW_NETWORK = 'SHOW_NETWORK';
export const CREATE_NETWORK = 'CREATE_NETWORK';
export const CREATE_SIMULATE_NETWORK = 'CREATE_SIMULATE_NETWORK';
export const SIMULATE_NETWORK = 'SIMULATE_NETWORK';
export const EDIT_MODEL = 'EDIT_MODEL';
export const RESET_MODEL = 'RESET_MODEL';
export const PYTHON_CALL = 'PYTHON_CALL';
export const DELETE_NETPARAMS_OBJ = 'DELETE_NETPARAMS_OBJ';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const LOAD_TUTORIAL = 'LOAD_TUTORIAL';
export const OPEN_CONFIRMATION_DIALOG = 'OPEN_CONFIRMATION_DIALOG';
export const CLOSE_CONFIRMATION_DIALOG = 'CLOSE_CONFIRMATION_DIALOG';
export const AUTOMATIC_INSTANTIATION = 'AUTOMATIC_INSTANTIATION';
export const AUTOMATIC_SIMULATION = 'AUTOMATIC_SIMULATION';
export const IMPORT_APPLICATION_STATE = 'IMPORT_APPLICATION_STATE';
export const SET_THEME = 'SET_THEME';

export const ADD_CANVAS_INSTANCES = 'ADD_CANVAS_INSTANCES';
export const CHANGE_INSTANCE_COLOR = 'CHANGE_INSTANCE_COLOR';
export const REMOVE_CANVAS_INSTANCES = 'REMOVE_CANVAS_INSTANCES';

// Actions
export const updateCards = { type: UPDATE_CARDS };

export const modelLoaded = { type: MODEL_LOADED };

export const createNetwork = { type: CREATE_NETWORK };
export const createAndSimulateNetwork = { type: CREATE_SIMULATE_NETWORK };
export const simulateNetwork = (allTrials = false) => ({
  type: SIMULATE_NETWORK,
  payload: allTrials,
});

export const showNetwork = { type: SHOW_NETWORK };

export const editModel = { type: EDIT_MODEL };

export const resetModel = { type: RESET_MODEL };

export const pythonCall = (cmd, args) => ({
  type: PYTHON_CALL,
  cmd,
  args,
});

export const deleteNetParamsObj = (payload) => ({
  type: DELETE_NETPARAMS_OBJ,
  payload,
});

export const closeDialog = { type: CLOSE_DIALOG };
export const openDialog = (payload) => ({
  type: OPEN_DIALOG,
  payload,
});

export const openConfirmationDialog = (payload) => ({
  type: OPEN_CONFIRMATION_DIALOG,
  payload,
});

export const closeConfirmationDialog = { type: CLOSE_CONFIRMATION_DIALOG };

export const setTheme = (themeName) => ({
  type: SET_THEME,
  payload: themeName,
});

export const loadTutorial = (tutFile) => ({
  type: LOAD_TUTORIAL,
  payload: tutFile,
});

export const changeAutomaticInstantiation = (payload) => ({
  type: AUTOMATIC_INSTANTIATION,
  payload,
});
export const changeAutomaticSimulation = (payload) => ({
  type: AUTOMATIC_SIMULATION,
  payload,
});

export const setDefaultWidgets = setWidgets({
  [PYTHON_CONSOLE_WIDGET.id]: {
    ...PYTHON_CONSOLE_WIDGET,
    panelName: PYTHON_CONSOLE_WIDGET.defaultPanel,
    status: WidgetStatus.ACTIVE,
  },
});

export const changeInstanceColor = (instance, color) => ({
  type: CHANGE_INSTANCE_COLOR,
  data: {
    instance,
    color,
  },
});

export const addInstancesToCanvas = (instances) => ({
  type: ADD_CANVAS_INSTANCES,
  instances,
});

export const removeInstancesFromCanvas = (instances) => ({
  type: REMOVE_CANVAS_INSTANCES,
  instances,
});
