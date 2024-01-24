// import action types
import { DROP_FROM_INDEX, DROP_LAST_COMMAND, FLUSH_COMMANDS, RECORD_COMMAND } from "./actions/actiondomain";
// import redux from 'redux'

// Default state for general
export const ACTION_DOMAIN_DEFAULT_STATE = {

};

const recordCommand = (state, { kernel, command }) => {
  const newState = { ...state };
  if (!newState[kernel]) {
    newState[kernel] = []
  }
  newState[kernel].push(command)
  return newState;
}

const dropLastCommand = (state, { kernel }) => {
  const newState = { ...state };
  if (!newState[kernel]) {
    newState[kernel] = []
    return newState
  }
  newState[kernel].pop()
  return newState;
}

const flushCommands = (state, { kernel }) => {
  return { ...state, [kernel]: [] };
}

const dropFromIndex = (state, { kernel, index }) => {
  const newState = { ...state };
  if (!newState[kernel]) {
    newState[kernel] = []
  }
  newState[kernel] = newState[kernel].splice(0, index)
  return newState;
}

// reducer
const reducer = (state = ACTION_DOMAIN_DEFAULT_STATE, action) => {
  switch (action.type) {
    case RECORD_COMMAND:
      return recordCommand(state, action.payload)
    case DROP_LAST_COMMAND:
      return dropLastCommand(state, action.payload)
    case FLUSH_COMMANDS:
      return flushCommands(state, action.payload)
    case DROP_FROM_INDEX:
      return dropFromIndex(state, action.payload)
    default:
      return state
  }
}

const redux = require("redux");
const createStore = redux.createStore;
const store = createStore(reducer);

export { store }