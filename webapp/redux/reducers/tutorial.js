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
function getValidActiveStep( requiredStep, discoveredSteps )
{
  const discoveredStepsLength = discoveredSteps.length ;
  return Math.min(requiredStep, discoveredStepsLength);
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
      const tourStep = getValidActiveStep( state.requestedTourStep, discoveredSteps);
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
      const requestedTourStep = state.tourStep + 1 ;
      return Object.assign(state, { requestedTourStep });
    case RUN_CONTROLLED_STEP:
      return Object.assign(state, { tourRunning: true, tourStep: action.payload });
    default:
      return state
  }
}