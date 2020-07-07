// Action Types
export const UPDATE_CARDS = 'UPDATE_CARDS';
export const MODEL_LOADED = 'MODEL_LOADED';
export const SHOW_NETWORK = 'SHOW_NETWORK';
export const CREATE_NETWORK = 'CREATE_NETWORK';
export const CREATE_SIMULATE_NETWORK = 'CREATE_SIMULATE_NETWORK';
export const SIMULATE_NETWORK = 'SIMULATE_NETWORK';
export const EDIT_MODEL = 'EDIT_MODEL';
export const PYTHON_CALL = 'PYTHON_CALL'
export const DELETE_NETPARAMS_OBJ = 'DELETE_NETPARAMS_OBJ'
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const LOAD_TUTORIAL = 'LOAD_TUTORIAL';
export const AUTOMATIC_INSTANTIATION = 'AUTOMATIC_INSTANTIATION';
export const AUTOMATIC_SIMULATION = 'AUTOMATIC_SIMULATION';
export const IMPORT_APPLICATION_STATE = 'IMPORT_APPLICATION_STATE';

// Actions
export const updateCards = { type: UPDATE_CARDS };

export const modelLoaded = { type: MODEL_LOADED };

export const createNetwork = { type: CREATE_NETWORK };
export const createAndSimulateNetwork = { type: CREATE_SIMULATE_NETWORK };
export const simulateNetwork = { type: SIMULATE_NETWORK };
export const showNetwork = { type: SHOW_NETWORK };

export const editModel = { type: EDIT_MODEL };

export const pythonCall = (cmd, args) => ({ type: PYTHON_CALL, cmd, args })

export const deleteNetParamsObj = payload => ({ type: DELETE_NETPARAMS_OBJ, payload })

export const closeDialog = { type: CLOSE_DIALOG }
export const openDialog = payload => ({ type: OPEN_DIALOG, payload });


export const loadTutorial = tutFile => ({ type: LOAD_TUTORIAL, payload: tutFile })

export const changeAutomaticInstantiation = payload => ({ type: AUTOMATIC_INSTANTIATION, payload });
export const changeAutomaticSimulation = payload => ({ type: AUTOMATIC_SIMULATION, payload });
