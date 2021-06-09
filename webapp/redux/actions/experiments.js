export const VIEW_EXPERIMENT = 'VIEW_EXPERIMENT';
export const GET_EXPERIMENTS = 'GET_EXPERIMENTS';
export const SET_EXPERIMENTS = 'SET_EXPERIMENTS';
export const RESET_EXPERIMENT = 'RESET_EXPERIMENT';
export const CLONE_EXPERIMENT = 'CLONE_EXPERIMENT';

/**
 * Resets configuration of current Experiment.
 * User can start now with a new Experiment.
 */
export const resetCurrentExperiment = () => ({
  type: RESET_EXPERIMENT,
});

export const getExperiments = () => ({ type: GET_EXPERIMENTS });

/**
 * Set fetched experiments.
 */
export const setExperiments = (payload) => ({
  type: SET_EXPERIMENTS,
  payload,
});

/**
 * Replaces current experiment with selected trial.
 */
export const loadTrial = () => {

};

/**
 * Opens Model>Explore view and loads results of selected trial.
 */
export const viewTrialResults = () => {

};

/**
 * Replaces experiment in design & model specification with stored experiment.
 */
export const cloneExperiment = (experimentName) => ({
  type: CLONE_EXPERIMENT,
  payload: { name: experimentName },
});
