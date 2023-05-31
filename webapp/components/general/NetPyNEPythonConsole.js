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

  handleChange = (event) => {
    // Handle the change event here
    console.log('Element changed:', event.target.value);
    // Fire up your custom event or call a specific function
    // For example:
    // this.props.onElementChange(event.target.value);
  };

  componentDidMount() {

  }

  render() {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    return <PythonConsole pythonNotebookPath={`notebooks/${notebookName}`} extensionLoaded={this.props.extensionLoaded} />
  }
}

export default NetPyNEPythonConsole;
