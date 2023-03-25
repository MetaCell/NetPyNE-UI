// import action types
import React from 'react';
import tutorial_steps from './data/tutorial_steps';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP, ADD_DISCOVERED_STEP, RUN_CONTROLLED_STEP_BY_ELEMENT_ID, VALIDATE_TUTORIAL_STEP, CHECK_BUBBLE_RENDER } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: false,
  requestedTourStep: 0,
  lastCheckRender: 0,
  tourStep: 0,
  activeSteps: [],
  discoveredSteps: [],
  steps: tutorial_steps,
  renderedSteps: []
};

//component could fire a increment step but it might not yet be active on the observable
function getValidActiveStep( requiredStep, currentStep, steps, discoveredSteps )
{
  let tourStep = currentStep ;
  if (requiredStep > 0)
  {
    const requestedStepConfig = steps[requiredStep-1];
    if ( discoveredSteps.indexOf(requestedStepConfig.target.replace('#', '')) > -1)
      tourStep = requiredStep ;
  }
  return tourStep ;
}

// reducer
export default (state = TUTORIAL_DEFAULT_STATE, action) => {
  switch (action.type) {
    case START_TUTORIAL:
      return Object.assign(state, { tourRunning: true, requestedTourStep: 1 });
    case STOP_TUTORIAL:
      return Object.assign(state, { tourRunning: false });
    case ADD_DISCOVERED_STEP:
    {
      const discoveredSteps = [...state.discoveredSteps, ...action.payload.nodeIdList].filter((item, index, arr) => arr.indexOf(item) === index);
      return { 
        ...state,
        discoveredSteps,
        activeSteps: [...action.payload.nodeIdList]
      }
    }
    case RUN_CONTROLLED_STEP_BY_ELEMENT_ID:
    {
      const stepIndex = state.steps.findIndex( step => step.target == action.payload)
      return stepIndex > -1 ? Object.assign(state, { tourRunning: true, tourStep: stepIndex+1 }) : state ;
    }
    case INCREMENT_TUTORIAL_STEP:
    {
      const requestedTourStep = state.tourStep + 1 ;
      return Object.assign(state, { requestedTourStep });
    }
    case RUN_CONTROLLED_STEP:
      return Object.assign(state, { tourRunning: true, tourStep: action.payload });
    case VALIDATE_TUTORIAL_STEP:
      return Object.assign(state, { tourStep: action.payload.tourStep })
    case CHECK_BUBBLE_RENDER:
      return Object.assign(state, { lastCheckRender: action.payload.epoch })
    default:
      return state
  }
}