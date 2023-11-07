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
  TutorialObserver
} from 'netpyne/components';
import { loadModel } from '../redux/actions/general';

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


class NetPyNE extends React.Component {
  constructor (props) {
    super(props);
    this.openPythonCallDialog = this.openPythonCallDialog.bind(this);
    this.loaded = false;
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);

    const {
      setDefaultWidgets,
    } = this.props;

    setDefaultWidgets();

    // Listen messages
    const loadFromEvent = (event) => {
      // Here we would expect some cross-origin check, but we don't do anything more than load a model here
      switch (event.data.type) {
        case 'INIT_INSTANCE':
          if (this.loaded) {
            return;
          }
          this.loaded = true;
          console.log('NetPyNE-UI component is ready');
          if (window !== window.parent) {
            window.parent.postMessage({
              type: 'APP_READY',
            }, '*');
          }
          break;
        case 'LOAD_RESOURCE':
          // eslint-disable-next-line no-case-declarations
          const resource = event.data.payload;
          this.props.dispatchAction(loadModel(resource));
          break;
        default:
          break;
      }
    };
    // A message from the parent frame can specify the file to load
    window.addEventListener('message', loadFromEvent);
    // window.load = loadFromEvent
    const logme = (event) => {
      console.log("!!!! EVENT", event)
    }
    window.addEventListener('kernelstatus', logme)
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

  render () {
    const { classes } = this.props;

    const Layout = LayoutManager();
    return (
      <TutorialObserver>
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
      </TutorialObserver>
    );
  }
}

export default withStyles(styles)(NetPyNE);
