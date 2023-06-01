import React from 'react';

import { Box, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  ErrorDialog,
  Topbar,
  LayoutManager,
  Drawer,
  Dialog,
  ConfirmationDialog,
  LaunchDialog,
} from 'netpyne/components';


const styles = ({ zIndex }) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flex: 1,
  },
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  topbar: {
    position: 'relative',
    zIndex: zIndex.drawer,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  noGrow: { flexGrow: 0 },
});

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

class NetPyNE extends React.Component {
  constructor (props) {
    super(props);
    this.openPythonCallDialog = this.openPythonCallDialog.bind(this);
    this.targetNode = null;
    this.observer = null;
    this.notebookValues = {};
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);

    const {
      setDefaultWidgets,
    } = this.props;

    setDefaultWidgets();

    this.targetNode = document.documentElement; // Select the top-level element

    this.observer = new MutationObserver((mutations) => {
      const currentNotebookValues = {};
      mutations.forEach((mutation) => {
        // Check if an iframe with the specific ID is added as a child
        const iframeElement = mutation.target.querySelector('#pythonConsoleFrame');
        if (iframeElement) {
          const cells = document.getElementById('pythonConsoleFrame').contentDocument.querySelectorAll('.CodeMirror-line');
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
        }
      });
    });

    const observerConfig = { childList: true, subtree: true };
    this.observer.observe(this.targetNode, observerConfig);
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);
  }

  openPythonCallDialog (event) {
    if (event?.evalue && event?.traceback) {
      this.props.pythonCallErrorDialogBox({
        errorMessage: event.evalue,
        errorDetails: event.traceback.join('\n'),
      });
    } else {
      this.props.pythonCallErrorDialogBox({
        errorMessage: event.data.response.evalue,
        errorDetails: event.data.response.traceback.join('\n'),
      });
    }
  }

  handlePyhtonCellBlur = (event) => {
    // Handle the blur event here
    console.log('Element blurred:', event.target);
  }

  render () {
    const { classes } = this.props;

    const Layout = LayoutManager();
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.topbar}>
            <Topbar />
          </div>
          <Box p={1} flex={1} display="flex" alignItems="stretch">
            <Grid container spacing={1} className={classes.content} alignItems="stretch">
              <Grid item className={classes.noGrow}>
                <Drawer />
              </Grid>
              <Grid item>
                <Layout />
              </Grid>
            </Grid>
          </Box>
        </div>
        <Dialog />
        <ConfirmationDialog />
        <ErrorDialog />
        <LaunchDialog />
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNE);
