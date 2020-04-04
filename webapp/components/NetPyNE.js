import React from "react";
import Toolbar from "@material-ui/core/Toolbar";

import {
  NetPyNEToolBar,
  NetPyNETabs,
  LayoutManager,
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
  content: { position: "relative", zIndex: zIndex.appBar }
})
class NetPyNE extends React.Component {
  constructor (props) {
    super(props);
    this.widgets = {};
    
  }

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

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.data != nextProps.data) {
      console.log("Initialising NetPyNE Tabs");

      window.metadata = nextProps.data.metadata;
      window.currentFolder = nextProps.data.currentFolder;
      window.isDocker = nextProps.data.isDocker;
    }
  }
  

  render () {
    if (!this.props.data) {
      return <div></div>;
    } else {
      const { classes } = this.props
      if (this.props.editMode) {
        var content = <LayoutManager/>;
      } else {
        var content = <LayoutManager />;
      }

      return (
        <div className={classes.container}>
          <div className={classes.content}>
            <Toolbar id="appBar" className={classes.toolbar}>
              <div className={classes.drawer}>
                <NetPyNEToolBar />
              </div>
              <div className={classes.views}>
                <NetPyNETabs />
              </div>
            </Toolbar>
          </div>
          {content}
        </div>
      );
    }
  }
}
export default withStyles(styles)(NetPyNE)