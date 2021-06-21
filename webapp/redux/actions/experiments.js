export const GET_EXPERIMENTS = 'GET_EXPERIMENTS';
export const SET_EXPERIMENTS = 'SET_EXPERIMENTS';
export const RESET_EXPERIMENT = 'RESET_EXPERIMENT';
export const CLONE_EXPERIMENT = 'CLONE_EXPERIMENT';
export const VIEW_EXPERIMENTS_RESULTS = 'VIEW_EXPERIMENT_RESULTS';

/**
 * Resets configuration of current Experiment.
 * User can start now with a new Experiment.
 */
export const resetCurrentExperiment = () => ({
  type: RESET_EXPERIMENT,
});

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
 * Replaces experiment in design & model specification with stored experiment.
 */
export const cloneExperiment = (experimentName) => ({
  type: CLONE_EXPERIMENT,
  payload: { name: experimentName },
});
