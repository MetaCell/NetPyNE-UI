import { combineReducers } from 'redux';

import general from './general';
import notebook from './notebook';
import flexlayout from './flexlayout';

export default combineReducers({ general, notebook, flexlayout });