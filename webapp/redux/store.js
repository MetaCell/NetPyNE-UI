import { createStore, applyMiddleware, compose } from 'redux';
import all from './reducers/all';
import { EXPERIMENTS_DEFAULT_STATE } from './reducers/experiments';
import { GENERAL_DEFAULT_STATE } from './reducers/general';
import { NOTEBOOK_DEFAULT_STATE } from './reducers/notebook';
import middleware from './middleware/middleware';
import plotMiddleware from './middleware/plotMiddleware';
import rulesMiddleware from './middleware/rulesOperationsMiddleware';
import { initLayoutManager } from '../components/layout/LayoutManager';
import FLEXLAYOUT_DEFAULT_STATE from '../components/layout/defaultLayout';

const INIT_STATE = {
  general: GENERAL_DEFAULT_STATE,
  notebook: NOTEBOOK_DEFAULT_STATE,
  layout: FLEXLAYOUT_DEFAULT_STATE,
  experiments: EXPERIMENTS_DEFAULT_STATE,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore (state = INIT_STATE) {
  const layoutManager = initLayoutManager(INIT_STATE.layout);
  const store = createStore(
    all,
    state,
    composeEnhancers(
      applyMiddleware(middleware, plotMiddleware, rulesMiddleware, layoutManager.middleware),
    ),
  );
  layoutManager.dispatch = store.dispatch;
  return store;
}

export default configureStore;
