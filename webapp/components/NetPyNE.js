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
  TutorialObserver,
} from 'netpyne/components';
import { openDialog } from '../redux/actions/general';
// import { execPythonMessage } from './general/GeppettoJupyterUtils';
import { replayAll } from './general/CommandRecorder';

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
    this.kernelRestartState = {
      state: "idle",
      kernelID: undefined,
      crashLoop: false
    }
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);

    const {
      setDefaultWidgets,
    } = this.props;

    setDefaultWidgets();



    // Logic for kernel reinit
    const handleKernelRestart = ({ detail: { kernel, type } }) => {
      switch (this.kernelRestartState.state) {
        case "restarting":
          if (type === "kernel_ready" || type === "kernel_autorestarting") {
            console.log("Replaying all commands since the beginning of the session")
            replayAll(this.kernelRestartState.kernelID)
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: "idle",
              kernelID: undefined,
            }
          }
        case "idle":
          if (type === "kernel_connected") {
            console.log("Kernel is connecting/starting, being init")
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: "init",
              kernelID: kernel.id
            }
          }
          else if (type === "kernel_autorestarting") {
            console.log("Kernel restart event caught, trying to re-init the current model")
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: "restarting",
              kernelID: kernel.id
            }
            if (!this.kernelRestartState.crashLoop) {
              this.props.dispatchAction(openDialog({
                title: "Kernel restart",
                message: "An action occured that made the kernel restart. We are reloading your model and all the actions you applied on it."
              }))
            }
          }
          else if (type === "kernel_restarting") {
            console.log("Kernel restart, perhaps it's a special restart?")
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: "special_restart",
              kernelID: kernel.id
            }
          }
        case "init":
          if (type === "kernel_ready") {
            console.log("Kernel properly initialized")
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: "idle",
              kernelID: undefined,
            }
          }
        case "special_restart":
          if (type == "kernel_autorestarting") {
            console.log("Kernel autorestart after a start, we might not have the ready event, we force it then")
            replayAll(this.kernelRestartState.kernelID)
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: 'restarting',
              kernelID: kernel.id,
            }
          } else {
            console.log("Regular restart detected")
            this.kernelRestartState = {
              ...this.kernelRestartState,
              state: 'idle',
              kernelID: undefined,
            }
          }
      }
    }
    window.addEventListener('kernelstatus', handleKernelRestart)

    // Dedicated code to handle crash loops
    const kernelRestartLoopHandler = ( ) => {
      if (!this.kernelRestartState.crashLoop) {
        this.props.dispatchAction(openDialog({
          title: "Kernel restart loop stabilization",
          message: "One of your actions triggered a kernel restart loop. We are trying to identify the faulty command and to restore your model until this point. Close this window and wait for the kernel stabilization notification."
        }))
      } else {
        clearTimeout(this.kernelRestartState.crashLoop)
      }
      const taskID = setTimeout((_this) => {
        this.props.dispatchAction(openDialog({
          title: "Kernel restart loop stabilized",
          message: "The kernel is now stabilized."
        }));
        this.kernelRestartState = {
          ...this.kernelRestartState,
          crashLoop: false
        }
      }, 8000, this)
      this.kernelRestartState = {
        ...this.kernelRestartState,
        crashLoop: taskID
      }
    }
    window.addEventListener('kernelRestartLoop', kernelRestartLoopHandler)
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
        {/* <button onClick={() => {
          execPythonMessage("utils.convertToJS(netpyne_geppetto.importCellTemplate(utils.convertToPython('{\"cellArgs\":{},\"fileName\":\"/home/vince/git-repository/metacell/NetPyNE-UI/workspace/cells/FScell.hoc\",\"cellName\":\"FScell\",\"label\":\"CellType1\",\"modFolder\":\"/home/vince/git-repository/metacell/NetPyNE-UI/workspace/mod\",\"importSynMechs\":false,\"compileMod\":false}')))")
        }}>CRASH ME</button> */}
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
