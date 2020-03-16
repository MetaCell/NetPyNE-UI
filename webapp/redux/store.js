import { createStore, applyMiddleware, compose } from "redux";
import all from "./reducers/all";
import { GENERAL_DEFAULT_STATE } from "./reducers/general";
import middleware from './middleware/middleware';

const INIT_STATE = { general: GENERAL_DEFAULT_STATE, };

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


function configureStore (state = INIT_STATE) {
  return createStore(
    all,
    state,
    composeEnhancers(applyMiddleware(middleware))
  );
}

export default configureStore;