import React, { Component } from 'react';

import PythonConsole
  from '@metacell/geppetto-meta-ui/python-console/PythonConsole';

export class NetPyNEPythonConsole extends Component {
  componentDidMount () {
  }

  shouldComponentUpdate () {
    return false;
  }

  componentWillUnmount () {
    console.info('unmounting python console');
  }

  render () {
    return <PythonConsole pythonNotebookPath="notebooks/notebook.ipynb" />;
  }
}

export default NetPyNEPythonConsole;
