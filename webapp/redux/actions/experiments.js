export const GET_EXPERIMENTS = 'GET_EXPERIMENTS';
export const EDIT_EXPERIMENT = 'EDIT_EXPERIMENT';
export const ADD_EXPERIMENT = 'ADD_EXPERIMENT';
export const REMOVE_EXPERIMENT = 'REMOVE_EXPERIMENT';
export const SET_EXPERIMENTS = 'SET_EXPERIMENTS';
export const CLONE_EXPERIMENT = 'CLONE_EXPERIMENT';
export const VIEW_EXPERIMENTS_RESULTS = 'VIEW_EXPERIMENT_RESULTS';
export const TRIAL_LOAD_MODEL_SPEC = 'TRIAL_LOAD_MODEL_SPEC';
export const OPEN_LAUNCH_DIALOG = 'OPEN_LAUNCH_DIALOG';
export const CLOSE_LAUNCH_DIALOG = 'CLOSE_LAUNCH_DIALOG';

/**
 * Triggers fetching the Experiments from the backend.
 */
export const addExperiment = (details) => ({
  type: ADD_EXPERIMENT,
  payload: details
});

/**
 * Triggers fetching the Experiments from the backend.
 */
 export const removeExperiment = (name) => ({
  type: REMOVE_EXPERIMENT,
  payload: name
});

/**
 * Triggers fetching the Experiments from the backend.
 */
 export const editExperiment = (name, details) => ({
  type: EDIT_EXPERIMENT,
  payload: {
    name,
    details
  }
});

/**
 * Triggers fetching the Experiments from the backend.
 */
 export const getExperiments = () => ({
  type: GET_EXPERIMENTS,
});
/**
 * Set fetched experiments.
 */
export const setExperiments = (payload) => ({
  type: SET_EXPERIMENTS,
  payload,
});

/**
 * View results of selected experiment/trial.
 */
export const viewExperimentResults = (payload) => ({
  type: VIEW_EXPERIMENTS_RESULTS,
  payload,
});

/**
 * Load the model specification of the specified trial.
 */
export const loadTrialModelSpec = (payload) => ({
  type: TRIAL_LOAD_MODEL_SPEC,
  payload,
});

/**
 * Replaces experiment in design & model specification with stored experiment.
 */
export const cloneExperiment = (experimentName) => ({
  type: CLONE_EXPERIMENT,
  payload: { name: experimentName },
});

export const openLaunchDialog = () => ({ type: OPEN_LAUNCH_DIALOG });
export const closeLaunchDialog = () => ({ type: CLOSE_LAUNCH_DIALOG });
