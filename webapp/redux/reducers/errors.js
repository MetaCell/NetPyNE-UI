// import action types
import { OPEN_BACKEND_ERROR_DIALOG, CLOSE_BACKEND_ERROR_DIALOG } from '../actions/errors';

// Default state for general
export const ERROR_DEFAULT_STATE = {
  openDialog: false,
  errorMessage: '',
  errorDetails: '',
};

// reducer function
export default function reduceError (state = ERROR_DEFAULT_STATE, action) {
  switch (action.type) {
    case OPEN_BACKEND_ERROR_DIALOG:
      return {
        ...state,
        openDialog: true,
        errorMessage: action.payload.errorMessage,
        errorDetails: action.payload.errorDetails,
      };
    case CLOSE_BACKEND_ERROR_DIALOG:
      return { ...state, ...ERROR_DEFAULT_STATE };
    default: {
      return state;
    }
  }
}
