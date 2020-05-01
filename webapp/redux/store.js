import { createStore, applyMiddleware, compose } from "redux";
import all from "./reducers/all";
import { GENERAL_DEFAULT_STATE } from "./reducers/general";
import { NOTEBOOK_DEFAULT_STATE } from "./reducers/notebook";
import { FLEXLAYOUT_DEFAULT_STATE } from "./reducers/layout";
import middleware from './middleware/middleware';
import plotMiddleware from './middleware/plotMiddleware';

const INIT_STATE = { 
  general: GENERAL_DEFAULT_STATE,
  notebook: NOTEBOOK_DEFAULT_STATE,
  flexlayout: FLEXLAYOUT_DEFAULT_STATE
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


function configureStore (state = INIT_STATE) {
  return createStore(
    all,
    state,
    composeEnhancers(applyMiddleware(plotMiddleware, middleware))
  );
}

export default configureStore;