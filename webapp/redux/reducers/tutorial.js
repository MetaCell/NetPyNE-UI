// import action types
import React from 'react';
import tutorial_steps from './data/tutorial_steps';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP, ADD_DISCOVERED_STEP, RUN_CONTROLLED_STEP_BY_ELEMENT_ID } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: false,
  tourStep: 0,
  discoveredSteps: [],
  steps: tutorial_steps,
  renderedSteps: []
};

// reducer
function reduceTutorial (state, action) {
  switch (action.type) {
    case START_TUTORIAL:
      return { tourRunning: true, step: 1 };
    case STOP_TUTORIAL:
      return Object.assign(state, { tourRunning: false, tourStep: state.tourStep });
    case ADD_DISCOVERED_STEP:
    {
      const currentSteps = state.discoveredSteps ;
      action.payload.nodeIdList.forEach( n => {
        if (currentSteps.indexOf(n) == -1)
          currentSteps.push(n);
      })
      return Object.assign(state, { discoveredSteps: currentSteps });
    }
    case RUN_CONTROLLED_STEP_BY_ELEMENT_ID:
    {
      const stepIndex = state.steps.findIndex( step => step.target == action.payload)
      return stepIndex > -1 ? Object.assign(state, { tourRunning: true, tourStep: stepIndex+1 }) : state ;
    }
    case INCREMENT_TUTORIAL_STEP:
      return Object.assign(state, { tourStep: state.tourStep +1 });
    case RUN_CONTROLLED_STEP:
      return Object.assign(state, { tourRunning: true, tourStep: action.payload });
    default: {
      return { ...state };
    }
  }
}

export default (state = { ...TUTORIAL_DEFAULT_STATE }, action) => ({
  ...state,
  ...reduceTutorial(state, action),
});