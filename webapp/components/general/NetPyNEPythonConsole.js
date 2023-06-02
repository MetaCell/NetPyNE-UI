import React, { Component } from 'react';

import { PythonConsole } from '@metacell/geppetto-meta-ui/python-console/PythonConsole';

function compareDictionaries(dict1, dict2) {
  const differences = {};

  // Step 1: Check the number of keys
  const dict1Keys = Object.keys(dict1);
  const dict2Keys = Object.keys(dict2);
  if (dict1Keys.length !== dict2Keys.length) {
    differences["keysUnmatch"] = true;
  }

  // Step 2: Compare key-value pairs in one direction
  for (const key of dict1Keys) {
    if (!dict2.hasOwnProperty(key)) {
      differences[key] = dict1[key];
    } else if (dict1[key] !== dict2[key]) {
      differences[key] = dict1[key];
    }
  }

  // Step 3: Compare key-value pairs in the other direction
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
    this.notebookValues = null ;
  }
  
  shouldComponentUpdate (nextProps) {
    if (this.props.extensionLoaded !== nextProps.extensionLoaded) {
      return true;
    }
    if (nextProps.notebookVisible)
    {
      const iframe = document.getElementById('pythonConsoleFrame') ;

      this.observer = new MutationObserver((mutations) => {
        const currentNotebookValues = {};
        mutations.forEach((mutation) => {

            const cells = mutation.querySelectorAll('.CodeMirror-line');
            cells.forEach( cell => {
              const childrenCell = cell.children[0].children ;
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
            const notebookDiff = compareDictionaries(currentNotebookValues, this.notebookValues);
            if (Object.keys(notebookDiff).length > 0)
            {
              console.log('Python console changed, fire up redux action so components refresh');
            }
            this.notebookValues = currentNotebookValues ;
        });
      });
  
      const observerConfig = { childList: true, subtree: true };
      this.observer.observe(iframe.contentDocument, observerConfig);
    }
    else {
      this.observer.disconnect();
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
