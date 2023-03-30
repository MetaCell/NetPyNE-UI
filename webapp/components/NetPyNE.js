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

import Rnd  from "react-rnd";

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
  }

  componentDidUpdate() {
    console.log('updated')
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);

    const {
      setDefaultWidgets,
    } = this.props;

    setDefaultWidgets();
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
        <Rnd
          size={{
            width: 100,
            height: 100
          }}
          position={{
            x: 100,
            y: 100
          }}
          disableDragging={true}
          style={{
            border: "solid"
          }}
        />
      </TutorialObserver>
    );
  }
}

export default withStyles(styles)(NetPyNE);
