import React, { Component } from 'react'

import PythonConsole from '@geppettoengine/geppetto-client/js/components/interface/pythonConsole/PythonConsole';

export default class NetPyNEPythonConsole extends Component {

  

  componentWillUnmount () {
    console.log("unmounting python console")
  }

  componentDidMount () {

  
    
    
  }
  render () {
    return <PythonConsole pythonNotebookPath={"notebooks/notebook.ipynb"} />
  }
}
