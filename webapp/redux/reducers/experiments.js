import '../actions/experiments';
import {
  SET_EXPERIMENTS,
} from 'root/redux/actions/experiments';
import { EXPERIMENT_STATE } from 'root/constants';

export const EXPERIMENTS_DEFAULT_STATE = {
  experiments: [],
  inDesign: false,
};

export default (state = EXPERIMENTS_DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_EXPERIMENTS:
      return {
        ...state,
        experiments: action.payload,
        inDesign: action.payload.some((el) => el.state === EXPERIMENT_STATE.DESIGN),
      };
    default: {
      return state;
    }
  }
};
