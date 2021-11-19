import React, { Component } from 'react';

import PythonConsole
  from '@geppettoengine/geppetto-client/js/components/interface/pythonConsole/PythonConsole';

export class NetPyNEPythonConsole extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    console.info("unmounting python console");
  }

  componentDidMount() {

  }

  render() {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    return <PythonConsole pythonNotebookPath={`notebooks/${notebookName}`} />
  }
}

export default NetPyNEPythonConsole;
