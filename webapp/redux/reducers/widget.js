// import action types
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';

// Default state for general
export const WIDGET_DEFAULT_STATE = {
  widgets: {}
};

// reducer
function widgetReducer (state, action) {
  switch (action.type) {
    case GeppettoActions.layoutActions.UPDATE_WIDGET:
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.data.id]: action.data.status
        }
      };
      default:
        return state ;
  }
}

export default (state = { ...WIDGET_DEFAULT_STATE }, action) => ({
  ...state,
  ...widgetReducer(state, action),
});
// reducer function
