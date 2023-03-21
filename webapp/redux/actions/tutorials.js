// Action Types
export const START_TUTORIAL = 'START_TUTORIAL';
export const STOP_TUTORIAL = 'STOP_TUTORIAL';
export const INCREMENT_TUTORIAL_STEP = 'INCREMENT_TUTORIAL_STEP';
export const RUN_CONTROLLED_STEP = 'RUN_CONTROLLED_STEP'; 
export const ADD_DISCOVERED_STEP = 'ADD_DISCOVERED_STEP'; 

// Actions
export const startTutorial         = (payload, metadata = {}) => ({ type: START_TUTORIAL, payload, metadata });
export const stopTutorial          = (payload, metadata = {}) => ({ type: STOP_TUTORIAL, metadata });
export const incrementTutorialStep = (payload, metadata = {}) => ({ type: INCREMENT_TUTORIAL_STEP, payload, metadata });;
export const runControlledStep     = (payload, metadata = {}) => ({ type: RUN_CONTROLLED_STEP, payload, metadata })
export const addDiscoveredStep     = (payload, metadata = {}) => ({ type: ADD_DISCOVERED_STEP, payload, metadata })