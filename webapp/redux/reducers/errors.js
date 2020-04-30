// import action types
import { OPEN_BACKEND_ERROR_DIALOG, CLOSE_BACKEND_ERROR_DIALOG } from '../actions/errors';

// Default state for general
export const ERROR_DEFAULT_STATE = { 
  openDialog: false,
  errorMessage: '',
  errorDetails: ''
};

// reducer
export default ( state = ERROR_DEFAULT_STATE, action ) => ({ 
  ...state, 
  ...reduceError(state, action) 
});


// reducer function
function reduceError (state, action) {
  switch (action.type) {
  case OPEN_BACKEND_ERROR_DIALOG:
    return { 
      openDialog: true,
      errorMessage: action.payload.errorMessage,
      errorDetails: action.payload.errorDetails
    }
  case CLOSE_BACKEND_ERROR_DIALOG:
    return { ...ERROR_DEFAULT_STATE }
  default: {
    return { ...state };
  }
  }
}
