import React from "react";

import {
  Topbar,
  LayoutManager,
  Drawer
} from "netpyne/components";

import { withStyles } from '@material-ui/core/styles'

const styles = ({ zIndex, palette, spacing }) => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  toolbar: {
    backgroundColor: palette.primary.main,
    width: "100%",
    boxShadow: "0 0px 4px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
    position: "relative",
    top: 0,
    left: 0,
    zIndex: zIndex.appBar
  },
  views: {
    display: "flex",
    flexFlow: "rows",
    width: "100%",
    marginRight: spacing(-1)
  },
  drawer: { marginLeft: spacing(-1) },
  content: { position: "relative", zIndex: zIndex.drawer + 1 }
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
      <div className={classes.container}>
        <div className={classes.content}>
          <Topbar/>
        </div>
        <div style={{ flexGrow:1, display: 'flex', flexDirection: 'row', position: 'relative' }}>
          <Drawer/>
          <LayoutManager/>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(NetPyNE)