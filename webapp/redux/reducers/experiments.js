import '../actions/experiments';
import {
  GET_EXPERIMENTS,
  SET_EXPERIMENTS,
  VIEW_EXPERIMENT,
} from 'root/redux/actions/experiments';

export const EXPERIMENTS_DEFAULT_STATE = {
  experiments: [],
  experimentDetail: {},
  modelTree: {},
};

export default (state = EXPERIMENTS_DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_EXPERIMENTS:
      return {
        ...state,
        experiments: action.payload,
        // Shortcut to get dummy data for single experiment view
        experimentDetail: action.payload[0],
      };
    case GET_EXPERIMENTS:
      return {
        ...state,
      };
    case VIEW_EXPERIMENT:
      // TODO: have to define how to get trials information
      return {
        ...state,
        experimentDetail: {},
      };
    default: {
      return state;
    }
  }
};
