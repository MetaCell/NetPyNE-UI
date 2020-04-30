import React from "react";

import {
  Topbar,
  LayoutManager,
  Drawer
} from "netpyne/components";

import { withStyles } from '@material-ui/core/styles'

const styles = ({ zIndex, palette, spacing }) => ({
  root: { height: '100%', overflow: 'hidden' },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  topbar: { position: "relative", zIndex: zIndex.drawer + 1 },
  content: { flexGrow:1, display: 'flex', flexDirection: 'row', position: 'relative' }
})


class NetPyNE extends React.Component {
  
  openPythonCallDialog (event) {
    const payload = { errorMessage: event['evalue'], errorDetails: event['traceback'].join('\n') }
    this.props.pythonCallErrorDialogBox(payload)
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this)
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.topbar}>
            <Topbar/>
          </div>
          <div className={classes.content}>
            <Drawer/>
            <LayoutManager/>
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(NetPyNE)