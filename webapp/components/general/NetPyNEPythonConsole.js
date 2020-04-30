import React, { Component } from 'react'
import Utils from '../../Utils'

import PythonConsole from '@geppettoengine/geppetto-client/js/components/interface/pythonConsole/PythonConsole';

export default class NetPyNEPythonConsole extends Component {

  addMetadataToWindow (data) {
    console.log("Initialising NetPyNE Tabs");
    window.metadata = data.metadata;
    window.currentFolder = data.currentFolder;
    window.isDocker = data.isDocker;
    window.pythonConsoleLoaded = true
  }

  componentWillUnmount () {
    console.log("unmounting python console")
  }

  componentDidMount () {
    if (!window.pythonConsoleLoaded) {
      GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
        let project = { id: 1, name: 'Project', experiments: [{ "id": 1, "name": 'Experiment', "status": 'DESIGN' }] }
        GEPPETTO.Manager.loadProject(project, false);
        GEPPETTO.Manager.loadExperiment(1, [], []);
        Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
        Utils.evalPythonMessage('netpyne_geppetto.getData',[]).then(response => {
          const data = Utils.convertToJSON(response);
          this.addMetadataToWindow(data)
          this.props.modelLoaded();
          GEPPETTO.trigger("spinner:hide");
        })
      });
    }
    
  }
  render () {
    return <PythonConsole pythonNotebookPath={"notebooks/notebook.ipynb"} />
  }
}
