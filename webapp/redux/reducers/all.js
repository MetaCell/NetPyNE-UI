import { combineReducers } from 'redux';

import general from './general';
import notebook from './notebook';
import flexlayout from './flexlayout';
import errors from './errors';
import drawer from './drawer';
import topbar from './topbar';

export default combineReducers({ general, notebook, flexlayout, errors, drawer, topbar });