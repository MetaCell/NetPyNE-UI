import React from "react";

import { Box, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { ErrorDialog } from 'netpyne/components'

import {
  Topbar,
  LayoutManager,
  Drawer,
  Dialog
} from "netpyne/components";

import Utils from '../Utils';

const styles = ({ zIndex }) => ({
  root: { height: '100%', overflow: 'hidden', display: 'flex', flex: 1 },
  container: {
    display: "flex",
    flex: 1,
    alignItems: "stretch",
    flexDirection: "column"
  },
  topbar: { position: "relative", zIndex: zIndex.drawer + 1 },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  },
  noGrow: { flexGrow: 0 }
});

import { EDIT_WIDGETS } from '../constants'

const TIMEOUT = 10000

class NetPyNE extends React.Component {

  openPythonCallDialog (event) {
    const payload = { errorMessage: event['evalue'], errorDetails: event['traceback'].join('\n') }
    this.props.pythonCallErrorDialogBox(payload);
  }

  addMetadataToWindow (data) {
    console.log("Initialising NetPyNE Tabs");
    window.metadata = data.metadata;
    window.currentFolder = data.currentFolder;
    window.isDocker = data.isDocker;
    window.pythonConsoleLoaded = true
    window.tuts = data.tuts
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);
    this.props.setDefaultWidgets();

    GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
      let project = { id: 1, name: 'Project', experiments: [{ "id": 1, "name": 'Experiment', "status": 'DESIGN' }] }
      GEPPETTO.Manager.loadProject(project, false);
      GEPPETTO.Manager.loadExperiment(1, [], []);

      let responded = false;
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto')
      Utils.evalPythonMessage('netpyne_geppetto.getData', [])
        .then(response => {
          responded = true

          GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading NetPyNE-UI");
          const data = Utils.convertToJSON(response);
          this.addMetadataToWindow(data);
          this.props.setWidgets(EDIT_WIDGETS);
          this.props.modelLoaded();
          GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        });

      setTimeout(() => {
        if (!responded) {
          GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Reloading Python Kernel");
          IPython.notebook.restart_kernel({ confirm: false })
            .then(() => window.location.reload());
        }
      }, TIMEOUT)
    });
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this)
  }

  render () {
    const { classes } = this.props
    if (!this.props.modelLoaded) {
      return '';
    }
    const Layout = LayoutManager();
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.topbar}>
            <Topbar/>
          </div>
          <Box p={1} flex={1} display="flex" alignItems="stretch">
            <Grid container spacing={1} className={classes.content} alignItems="stretch">
              <Grid item className={classes.noGrow}>
                <Drawer/>
              </Grid>
              <Grid item>
                <Layout/>
              </Grid>
            </Grid>
          </Box>
        </div>
        <Dialog/>
        <ErrorDialog/>
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNE)