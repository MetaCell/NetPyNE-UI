// import action types
import React from 'react';
import tutorial_steps from './data/tutorial_steps';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: true,
  tourStep: 0,
  steps: tutorial_steps
};

// reducer
function reduceTutorial (state, action) {
  switch (action.type) {
    case START_TUTORIAL:
      return { tourRunning: true, step: 1 };
    case STOP_TUTORIAL:
      return Object.assign(state, { tourRunning: false, tourStep: state.tourStep });
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