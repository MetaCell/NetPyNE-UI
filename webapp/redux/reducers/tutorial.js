// import action types
import React from 'react';
import { START_TUTORIAL, STOP_TUTORIAL, INCREMENT_TUTORIAL_STEP, RUN_CONTROLLED_STEP } from '../actions/tutorials';

// Default state for general
export const TUTORIAL_DEFAULT_STATE = {
  tourRunning: true,
  tourStep: 0,
  steps: [{
    target: '#selectCellButton',
    content: (
      <div>
        <p>Import a simple cell model</p>
        <p>Click on the + above Cell</p>
      </div>
    )
  },
  {
    target: '#step1',
    content: (
      <div>
        <p>Click on Ball and stick HH cell</p>
      </div>
    )
  },
  {
    target: '#step1',
    content: (
      <div>
        <p>Our new cell type appears</p>
        <p>Click on CellType0 and the panel on the right will appear</p>
        <p>Rename the cell type: “pyr” for pyramidal</p>
      </div>
    )
  },
  {
    target: '#step1',
    content: (
      <div>
        <p>Click on Section to see the sections that make up this imported cell type</p>
      </div>
    )
  },
]
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