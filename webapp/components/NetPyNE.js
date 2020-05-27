import React from "react";

import {
  Topbar,
  LayoutManager,
  Drawer
} from "netpyne/components";

import { withStyles } from '@material-ui/core/styles'
import Utils from '../Utils';
const styles = ({ zIndex, palette, spacing }) => ({
  root: { height: '100%', overflow: 'hidden' },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  topbar: { position: "relative", zIndex: zIndex.drawer + 1 },
  content: { 
    flexGrow:1, 
    display: 'flex', 
    flexDirection: 'row',
    position: 'relative' 
  }
});

import { EDIT_WIDGETS, PYTHON_CONSOLE_WIDGET, WidgetStatus } from '../constants'


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
  }

  componentDidMount () {
    GEPPETTO.on(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this);
    this.props.setWidgets({ [PYTHON_CONSOLE_WIDGET.id]: { ...PYTHON_CONSOLE_WIDGET, panelName: PYTHON_CONSOLE_WIDGET.defaultPanel, status: WidgetStatus.ACTIVE } });
    GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
      let project = { id: 1, name: 'Project', experiments: [{ "id": 1, "name": 'Experiment', "status": 'DESIGN' }] }
      GEPPETTO.Manager.loadProject(project, false);
      GEPPETTO.Manager.loadExperiment(1, [], []);
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      Utils.evalPythonMessage('netpyne_geppetto.getData',[]).then(response => {
        const data = Utils.convertToJSON(response);
        this.addMetadataToWindow(data);
        this.props.modelLoaded();
        this.props.setWidgets(EDIT_WIDGETS);
        GEPPETTO.trigger("spinner:hide");
      })
      
    });
    
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Error_while_exec_python_command, this.openPythonCallDialog, this)
  }

  render () {
    const { classes } = this.props
    const Layout = LayoutManager();
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.topbar}>
            <Topbar/>
          </div>
          <div className={classes.content}>
            <Drawer/>
            <Layout />
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(NetPyNE)