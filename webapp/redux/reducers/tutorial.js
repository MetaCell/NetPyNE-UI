// import action types
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: false,
  tourStep: 1,
  steps: [{
    target: '.MuiButtonBase-root',
    content: 'This is the first step!',
  }]
};

// reducer
function reduceTutorial (state, action) {
  switch (action.type) {
    case START_TUTORIAL:
      return { tourRunning: true, step: 1 };
    case STOP_TUTORIAL:
      return Object.assign(state, { tourRunning: false });
    case INCREMENT_TUTORIAL_STEP:
      return Object.assign(state, { tourStep: state.tourStep +1 });
    default: {
      return { ...state };
    }
  }
}

export default (state = { ...TUTORIAL_DEFAULT_STATE }, action) => ({
  ...state,
  ...reduceTutorial(state, action),
});