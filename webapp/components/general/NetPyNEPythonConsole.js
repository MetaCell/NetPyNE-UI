import React, { Component } from 'react';
import { PythonConsole } from '@metacell/geppetto-meta-ui/python-console/PythonConsole';

function compareConsoleDictionaries(dict1, dict2) {
  const differences = {};

  if (!dict2)
    return dict1 ; //in case dict2 has not yet been initialized then the array differences is the first element complete

  const dict1Keys = Object.keys(dict1);
  const dict2Keys = Object.keys(dict2);
  if (dict1Keys.length !== dict2Keys.length) {
    differences["keysUnmatch"] = true;
  }

  for (const key of dict1Keys) {
    if (!dict2.hasOwnProperty(key)) {
      differences[key] = dict1[key];
    } else if (dict1[key] !== dict2[key]) {
      differences[key] = dict1[key];
    }
  }
  for (const key of dict2Keys) {
    if (!dict1.hasOwnProperty(key)) {
      differences[key] = dict2[key];
    } else if (dict2[key] !== dict1[key]) {
      differences[key] = dict2[key];
    }
  }

  // Step 4: Return differences dictionary
  return differences;
}

export class NetPyNEPythonConsole extends Component {
  constructor (props) {
    super(props);
    this.observer = null ;
    this.focusNotebookValues = null ;
    this.container = null ;
    this.notebookVisible = false ;
    this.updateConsole = undefined ;
  }

  getIFrameContent () {
    const content = this.container.contentDocument ;
    const cells   = content.querySelectorAll('.CodeMirror-line');
    let currentNotebookValues = {} ;
    if (cells.length > 0)
    {
      cells.forEach( cell => {
        const childrenCell = cell.children[0].children  ;
        let routes = [];
        let val ; 
        for (let i = 0; i < childrenCell.length; i++) {
          const e = childrenCell[i];
          if (e.className == "cm-string")
            val = e.innerHTML ;
          if ( e.className == "cm-variable" || e.className == "cm-property" )
            routes.push(e.innerHTML);
        }
        if ( routes.length > 0 )
        {
          const property = routes.join('.');
          currentNotebookValues[property] = val ;
        }
      });
    }
    return currentNotebookValues ;
  }
  
  shouldComponentUpdate (nextProps) {
    if (this.props.extensionLoaded !== nextProps.extensionLoaded) {
      return true;
    }
    if (nextProps.notebookVisible)
    {
      var iframeWindow     = this.container.contentWindow;
      iframeWindow.onblur  = this.handleIframeBlur ;
      iframeWindow.onfocus = this.handleIframeFocus ;
    }
    return false;
  }

  handleIframeBlur = (event) => {
    const notebookValues = this.getIFrameContent();
    const diff = compareConsoleDictionaries(this.focusNotebookValues, notebookValues );
    if ( Object.keys(diff).length > 0 )
      this.props.updateConsole({ commands: diff });
  }

  handleIframeFocus = (event) => {
    this.focusNotebookValues = this.getIFrameContent();
  }

  componentDidMount() {
   this.container = document.getElementById('pythonConsoleFrame') 
  }

  render() {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    return <PythonConsole pythonNotebookPath={`notebooks/${notebookName}`} extensionLoaded={this.props.extensionLoaded} />
  }
}

export default NetPyNEPythonConsole;
