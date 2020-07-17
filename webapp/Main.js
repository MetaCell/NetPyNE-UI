global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
  require('geppetto-client-initialization');
  const ReactDOM = require('react-dom');
  const React = require('react');
  const MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider;
  const NetPyNE = require('./components').NetPyNE;

  const theme = require('./theme').default

  const Provider = require("react-redux").Provider;
  const configureStore = require('./redux/store').default;

  require('./css/netpyne.less');
  require('./css/material.less');
  require('./css/traceback.less');
  require('./css/flexlayout.less');
  require('./css/tree.less');

  const store = configureStore();

  ReactDOM.render(
    <div>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <NetPyNE ></NetPyNE>
        </Provider>
      </MuiThemeProvider>

    </div>, 
    document.querySelector('#mainContainer')
  );

  GEPPETTO.G.setIdleTimeOut(-1);
  GEPPETTO.Resources.COLORS.DEFAULT = "#6f54aa";
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NetPyNE");
  
});