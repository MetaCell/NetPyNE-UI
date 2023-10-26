// import action types
import tutorial_steps from './data/tutorial_steps';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP, VALIDATE_TUTORIAL_STEP, CHECK_BUBBLE_RENDER } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: false,
  requestedTourStep: 0,
  lastCheckRender: 0,
  tourStep: 0,
  steps: tutorial_steps,
  renderedSteps: []
};

// reducer
export default (state = TUTORIAL_DEFAULT_STATE, action) => {
  switch (action.type) {
    case START_TUTORIAL:
      return {...state, tourRunning: true, requestedTourStep: 1, steps: action.payload }
    case STOP_TUTORIAL:
      return {...state, tourRunning: false, tourStep: 0 }
    case INCREMENT_TUTORIAL_STEP:
      return {...state, requestedTourStep: state.tourStep + 1 }
    case RUN_CONTROLLED_STEP:
      return {...state, tourRunning: true, tourStep: action.payload }
    case VALIDATE_TUTORIAL_STEP:
      return {...state, tourStep: action.payload.tourStep }
    case CHECK_BUBBLE_RENDER:
      return {...state, lastCheckRender: action.payload.epoch }
    default:
      return state
  }
}