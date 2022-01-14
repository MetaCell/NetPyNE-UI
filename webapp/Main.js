import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { NetPyNE } from './components';
import theme from './theme';
import store from './redux/store';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss';

global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');
const { initGeppetto } = require('@metacell/geppetto-meta-client/GEPPETTO');

Sentry.init({
  dsn: "https://d8bf7e40eec34cb9891f6dd8207b5e83@sentry.metacell.us/6",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

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

GEPPETTO.Resources.COLORS.DEFAULT = '#6f54aa';
