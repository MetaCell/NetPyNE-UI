global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
  require('geppetto-client-initialization');
  var ReactDOM = require('react-dom');
  var React = require('react');
  var getMuiTheme = require('@material-ui/core/styles/createMuiTheme').default;
  var MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider;
  var NetPyNE = require('./NetPyNE').default;


  var Utils = require('./Utils').default;
  var Console = require('geppetto-client/js/components/interface/console/Console');
  var TabbedDrawer = require('geppetto-client/js/components/interface/drawer/TabbedDrawer');
  var PythonConsole = require('geppetto-client/js/components/interface/pythonConsole/PythonConsole');
        
  require('./css/netpyne.less');
  require('./css/material.less');
  require('./css/traceback.less');


  const customTheme = {
    palette: {
      primary1Color: '#543a73',
      primary2Color: '#eb557a',
      primary3Color: '#ebd07a'
    }
  };
        
  const theme = getMuiTheme(customTheme);

  function App (data = {}) {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <NetPyNE {...data}></NetPyNE>
        </MuiThemeProvider>

        <div id="footer">
          <div id="footerHeader">
            <TabbedDrawer labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]} >
              <Console />
              <PythonConsole pythonNotebookPath={"../notebooks/notebook.ipynb"} />
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
      var data = Utils.convertToJSON(response)
      ReactDOM.render(<App data={data} />, document.querySelector('#mainContainer'));
      GEPPETTO.trigger("spinner:hide");
    })
  });
});