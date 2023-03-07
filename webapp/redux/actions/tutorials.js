// Action Types
export const START_TUTORIAL = 'START_TUTORIAL';
export const STOP_TUTORIAL = 'STOP_TUTORIAL';
export const INCREMENT_TUTORIAL_STEP = 'INCREMENT_TUTORIAL_STEP';

// Actions
export const startTutorial = (payload, metadata = {}) => ({ type: START_TUTORIAL, payload, metadata });
export const stopTutorial = { type: STOP_TUTORIAL };
export const incrementTutorialStep = { type: INCREMENT_TUTORIAL_STEP };