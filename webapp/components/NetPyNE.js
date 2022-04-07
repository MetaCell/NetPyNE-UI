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

import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import Utils from '../Utils';
import { EDIT_WIDGETS } from '../constants';

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

const TIMEOUT = 10000;
const EXPERIMENT_POLL_INTERVAL = 1000;

class NetPyNE extends React.Component {
  constructor (props) {
    super(props);
    this.openPythonCallDialog = this.openPythonCallDialog.bind(this);
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);

    const {
      setDefaultWidgets, setWidgets, modelLoaded, getExperiments,
    } = this.props;

    setDefaultWidgets();
    GEPPETTO.on('jupyter_geppetto_extension_ready', (data) => {
      const project = {
        id: 1,
        name: 'Project',
        experiments: [{
          id: 1,
          name: 'Experiment',
          status: 'DESIGN',
        }],
      };
      // to move to redux action, if not working create tech debt card and we do it later.
      GEPPETTO.Manager.loadProject(project, false);
      // to remove the experiment.
      // GEPPETTO.Manager.loadExperiment(1, [], []);

      let responded = false;
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      Utils.evalPythonMessage('netpyne_geppetto.getData', [])
        .then((response) => {
          responded = true;

          GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Loading NetPyNE-UI');
          const metadata = Utils.convertToJSON(response);
          this.addMetadataToWindow(metadata);
          setWidgets(EDIT_WIDGETS);
          modelLoaded();
          // GeppettoActions.modelLoaded();
          GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

          setInterval(getExperiments, EXPERIMENT_POLL_INTERVAL);
        });

      setTimeout(() => {
        if (!responded) {
          GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Reloading Python Kernel');
          IPython.notebook.restart_kernel({ confirm: false })
            .then(() => window.location.reload());
        }
      }, TIMEOUT);
    });
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);
  }

  openPythonCallDialog (event) {
    this.props.pythonCallErrorDialogBox({
      errorMessage: event.evalue,
      errorDetails: event.traceback.join('\n'),
    });
  }

  addMetadataToWindow (data) {
    console.log('Initialising NetPyNE Tabs');
    window.metadata = data.metadata;
    window.currentFolder = data.currentFolder;
    window.isDocker = data.isDocker;
    window.pythonConsoleLoaded = true;
    window.tuts = data.tuts;
    window.cores = data.cores;
  }

  render () {
    const { classes } = this.props;
    if (!this.props.modelLoaded) {
      return '';
    }
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
