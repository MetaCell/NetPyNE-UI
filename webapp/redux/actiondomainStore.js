// import action types
import { RECORD_COMMAND, REPLAY_COMMANDS } from "./actions/actiondomain";

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

const replayCommands = (state, { kernel }) => {
  console.log("TODO, REPLAY COMMANDS")
}

// reducer
const reducer = (state = ACTION_DOMAIN_DEFAULT_STATE, action) => {
  switch (action.type) {
    case RECORD_COMMAND:
      return recordCommand(state, action.payload)
    case REPLAY_COMMANDS:
      return replayCommands(state, action.payload)
    default:
      return state
  }
}

const redux = require("redux");
const createStore = redux.createStore;
const store = createStore(reducer);

export { store }