import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { NetPyNE } from './components';
import theme from './theme';
import store from './redux/store';

global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');
const { initGeppetto } = require('@metacell/geppetto-meta-client/GEPPETTO');

GEPPETTO.Resources.COLORS.DEFAULT = '#6f54aa';

initGeppetto();
require('./css/netpyne.less');
require('./css/material.less');
require('./css/traceback.less');
require('./css/flexlayout.less');
require('./css/tree.less');

ReactDOM.render(
  <div>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <NetPyNE />
      </Provider>
    </MuiThemeProvider>
  </div>,
  document.querySelector('#mainContainer'),
);
