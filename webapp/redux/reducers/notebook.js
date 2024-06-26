import * as TYPES from '../actions/notebook';

export const NOTEBOOK_DEFAULT_STATE = {
  showNotebook: false,
  isNotebookReady: false,
};

function reduceNotebook (state = {}, action) {
  switch (action.type) {
    case TYPES.LOAD_NOTEBOOK:
      return {
        showNotebook: true,
        isNotebookReady: false,
      };
    case TYPES.UNLOAD_NOTEBOOK: {
      return {
        showNotebook: false,
        isNotebookReady: false,
      };
    }
    case TYPES.NOTEBOOK_READY:
      return {
        isLoadingInNotebook: true,
        isNotebookReady: true,
      };
    default:
      return state;
  }
}

export default (state = {}, action) => ({ ...state, ...reduceNotebook(state, action) });
