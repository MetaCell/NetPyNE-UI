import '../actions/experiments';
import {
  OPEN_LAUNCH_DIALOG,
  SET_EXPERIMENTS,
  CLOSE_LAUNCH_DIALOG,
} from 'root/redux/actions/experiments';
import { EXPERIMENT_STATE } from 'root/constants';

export const EXPERIMENTS_DEFAULT_STATE = {
  experiments: [],
  inDesign: null,
  openLaunchDialog: false,
};

export default (state = EXPERIMENTS_DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_EXPERIMENTS:
      return {
        ...state,
        experiments: action.payload,
        inDesign: action.payload.find((el) => el.state === EXPERIMENT_STATE.DESIGN),
      };
    case OPEN_LAUNCH_DIALOG:
      return {
        ...state,
        openLaunchDialog: true,
      };
    case CLOSE_LAUNCH_DIALOG:
      return {
        ...state,
        openLaunchDialog: false,
      };
    default: {
      return state;
    }
  }
};
