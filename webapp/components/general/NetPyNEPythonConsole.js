import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';
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
        if ( routes?.length > 0 && val?.length > 0)
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
    const iframeStyle = {
      position: 'absolute',
      left: `${offScreenLeft}px`,
      width: '1px',    
      height: '1px',   
    };
    var iframeWindow     = this.container.contentWindow;
    var iframeElement = iframeWindow.frameElement;
    var parentDiv = iframeElement.parentElement;
    var containerDiv = parentDiv.parentElement;
    const offScreenLeft = -window.innerWidth - 100; //plus additional buffer just in case

    if (nextProps.notebookVisible)
    {
      iframeWindow.onblur  = this.handleIframeBlur ;
      iframeWindow.onfocus = this.handleIframeFocus ;
    }
    else{
      iframeWindow.position = 'absolute';
      iframeWindow.left = `${offScreenLeft}px`;
      iframeWindow.width = '1px';    
      iframeWindow.height = '1px';

      containerDiv.style.display = 'block';
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

  componentWillUnmount () {
    console.info('unmounting python console');
  }

  render () {
    const notebookName = GEPPETTO_CONFIGURATION.notebookName || "notebook.ipynb";
    
    return (
      <ReactResizeDetector handleWidth handleHeight>
      {({ width, height }) => (
        <PythonConsole
          pythonNotebookPath={`notebooks/${notebookName}`}
          extensionLoaded={this.props.extensionLoaded}
          iframeHeight={height}
        />
      )}
    </ReactResizeDetector>
    );
  }
}

export default NetPyNEPythonConsole;