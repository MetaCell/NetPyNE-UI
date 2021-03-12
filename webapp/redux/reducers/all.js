import { combineReducers } from 'redux';

import general from './general';
import notebook from './notebook';
import layout from './layout';
import errors from './errors';
import drawer from './drawer';
import topbar from './topbar';

export default combineReducers({
  general, notebook, layout, errors, drawer, topbar,
});
