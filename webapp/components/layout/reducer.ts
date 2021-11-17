import {
  SET_LAYOUT,
} from './actions';

function removeUndefined (obj) {
  return Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : ''));
}

export const FLEXLAYOUT_DEFAULT_STATE = {};

export const layout = (state = FLEXLAYOUT_DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_LAYOUT: {
      return { ...state, ...action.data };
    }

    default:
      return state;
  }
};

export default layout;
