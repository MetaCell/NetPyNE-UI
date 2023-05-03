import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { PythonConsole } from '@metacell/geppetto-meta-ui/python-console/PythonConsole';

export class NetPyNEPythonConsole extends Component {
  shouldComponentUpdate (nextProps) {
    if (this.props.extensionLoaded !== nextProps.extensionLoaded) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    console.info('unmounting python console');
  }

  render () {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    return (
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => <PythonConsole pythonNotebookPath={`notebooks/${notebookName}`} extensionLoaded={this.props.extensionLoaded} iframeHeight={height} />}
      </ReactResizeDetector>
    );
  }
}

export default NetPyNEPythonConsole;
