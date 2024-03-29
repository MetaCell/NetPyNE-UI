import { createStore } from '@metacell/geppetto-meta-client/common';
import all from './reducers/all';

import { EXPERIMENTS_DEFAULT_STATE } from './reducers/experiments';
import { GENERAL_DEFAULT_STATE } from './reducers/general';
import { NOTEBOOK_DEFAULT_STATE } from './reducers/notebook';
import { INITIAL_CONSOLE_STATE } from './reducers/console';

import middleware from './middleware/middleware';
import plotMiddleware from './middleware/plotMiddleware';
import rulesMiddleware from './middleware/rulesOperationsMiddleware';

import baseLayout from '../components/layout/defaultLayout';
import componentMap from '../components/layout/componentsMap';

const INIT_STATE = {
  general: GENERAL_DEFAULT_STATE,
  notebook: NOTEBOOK_DEFAULT_STATE,
  experiments: EXPERIMENTS_DEFAULT_STATE,
  console: INITIAL_CONSOLE_STATE
};

const store = createStore(
  all,
  INIT_STATE,
  [middleware, plotMiddleware, rulesMiddleware],
  { undefined, baseLayout, componentMap },
);

export default store;
