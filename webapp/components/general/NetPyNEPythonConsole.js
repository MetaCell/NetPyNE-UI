import React, { Component } from 'react';

import { PythonConsole } from '@metacell/geppetto-meta-ui/python-console/PythonConsole';

export class NetPyNEPythonConsole extends Component {

  shouldComponentUpdate (nextProps) {
    if (this.props.extensionLoaded !== nextProps.extensionLoaded) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    console.info("unmounting python console");
  }

  componentDidMount() {

  }

  render() {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    return <PythonConsole pythonNotebookPath={`notebooks/${notebookName}`} extensionLoaded={this.props.extensionLoaded} />
  }
}

export default NetPyNEPythonConsole;
