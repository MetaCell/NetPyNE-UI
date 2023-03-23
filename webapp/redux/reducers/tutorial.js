// import action types
import React from 'react';
import tutorial_steps from './data/tutorial_steps';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP, ADD_DISCOVERED_STEP, RUN_CONTROLLED_STEP_BY_ELEMENT_ID } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: false,
  requestedTourStep: 0,
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
      return Object.assign(state, { tourRunning: true, tourStep: 1, requestedTourStep: 1 });
    case STOP_TUTORIAL:
      return Object.assign(state, { tourRunning: false, tourStep: state.tourStep });
    case ADD_DISCOVERED_STEP:
    {
      const discoveredSteps = [...state.discoveredSteps, ...action.payload.nodeIdList].filter((item, index, arr) => arr.indexOf(item) === index);
      const tourStep = getValidActiveStep( state.requestedTourStep, state.tourStep, state.steps, discoveredSteps);
      const tourRunning = tourStep > state.tourStep || state.tourRunning ; //target discovered and been already request OR tutorial already running
      return { 
        ...state,
        discoveredSteps,
        activeSteps: [...action.payload.nodeIdList],
        tourStep,
        tourRunning
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
      const validStep = getValidActiveStep( requestedTourStep, state.tourStep, state.steps, state.discoveredSteps);
      const cont = validStep > state.tourStep || state.tourRunning ; //target discovered and been already request OR tutorial already running
      return Object.assign(state, { requestedTourStep, tourStep: validStep, tourRunning: cont });
    }
    case RUN_CONTROLLED_STEP:
      return Object.assign(state, { tourRunning: true, tourStep: action.payload });
    default:
      return state
  }
}