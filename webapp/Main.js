global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
  require('geppetto-client-initialization');
  const ReactDOM = require('react-dom');
  const React = require('react');
  const getMuiTheme = require('@material-ui/core/styles/createMuiTheme').default;
  const MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider;
  const NetPyNE = require('./components').NetPyNE;


  const Utils = require('./Utils').default;
  const Console = require('geppetto-client/js/components/interface/console/Console');
  const TabbedDrawer = require('geppetto-client/js/components/interface/drawer/TabbedDrawer');
  const PythonConsole = require('geppetto-client/js/components/interface/pythonConsole/PythonConsole');

  const theme = require('./Theme').default

  const Provider = require("react-redux").Provider;
  const configureStore = require('./redux/store').default;

  const modelLoaded = require('./redux/actions/general').modelLoaded;

  require('./css/netpyne.less');
  require('./css/material.less');
  require('./css/traceback.less');
  require('./css/flexlayout.less');

  const store = configureStore();

  function App (data = {}) {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <NetPyNE {...data}></NetPyNE>
          </Provider>
        </MuiThemeProvider>

        <div id="footer">
          <div id="footerHeader">
            <TabbedDrawer anchor="appBar" labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]} >
              <Console />
              <PythonConsole pythonNotebookPath={"notebooks/notebook.ipynb"} />
            </TabbedDrawer>
          </div>
        </div>
      </div>
    );
  }
  ReactDOM.render(<App />, document.querySelector('#mainContainer'));

  GEPPETTO.G.setIdleTimeOut(-1);
  GEPPETTO.G.debug(false); // Change this to true to see messages on the Geppetto console while loading
  GEPPETTO.Resources.COLORS.DEFAULT = "#6f54aa";
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NetPyNE");
  

  GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
    let project = { id: 1, name: 'Project', experiments: [{ "id": 1, "name": 'Experiment', "status": 'DESIGN' }] }
    GEPPETTO.Manager.loadProject(project, false);
    GEPPETTO.Manager.loadExperiment(1, [], []);
    Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
    Utils.evalPythonMessage('netpyne_geppetto.getData',[]).then(response => {
      const data = Utils.convertToJSON(response);
      GEPPETTO.on(GEPPETTO.Events.Model_loaded, () => {
        store.dispatch(modelLoaded);
      });
      ReactDOM.render(<App data={data} />, document.querySelector('#mainContainer'), store.dispatch(modelLoaded));
      GEPPETTO.trigger("spinner:hide");
    })
  });
});