import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Transition from "./transition/Transition";
import {
  NetPyNESynapses,
  NetPyNEConnectivityRules,
  NetPyNECellRules,
  NetPyNEStimulationSources,
  NetPyNEStimulationTargets,
  NetPyNESimConfig,
  NetPyNEToolBar,
  NetPyNETabs,
  NetPyNEPopulations,
  LayoutManager,
  NetPyNEPlots
} from "netpyne/components";

export default class NetPyNE extends React.Component {
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
      if (this.props.editMode) {
        var content = (
          <div style={{ marginBottom: "50px" }}>
            <NetPyNEPopulations model={"netParams.popParams"} />
            <NetPyNECellRules model={"netParams.cellParams"} />
            <NetPyNESynapses model={"netParams.synMechParams"} />
            <NetPyNEConnectivityRules model={"netParams.connParams"} />
            <NetPyNEStimulationSources model={"netParams.stimSourceParams"} />
            <NetPyNEStimulationTargets model={"netParams.stimTargetParams"} />
            <NetPyNESimConfig model={this.props.data.simConfig} />
            <NetPyNEPlots model={"simConfig.analysis"} />
          </div>
        );
      } else {
        var content = <LayoutManager />;
      }

      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ position: "relative", zIndex: "100" }}>
            <Toolbar
              id="appBar"
              style={{
                backgroundColor: "#543a73",
                width: "100%",
                boxShadow:
                  "0 0px 4px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
                position: "relative",
                top: "0px",
                left: "0px",
                zIndex: 100
              }}
            >
              <div style={{ marginLeft: -12 }}>
                <NetPyNEToolBar />
              </div>
              <div
                style={{
                  display: "flex",
                  flexFlow: "rows",
                  width: "100%",
                  marginRight: -10
                }}
              >
                <NetPyNETabs />
              </div>
            </Toolbar>
          </div>

          {/** TODO Reengineer Transition using the middleware to handle simulation and instantiation. The transition should only show content related to what actually we want to do
          <Transition
            tab={this.state.value}
            clickOnTab={this.state.tabClicked}
            handleDeactivateInstanceUpdate={this.handleDeactivateInstanceUpdate}
            handleDeactivateSimulationUpdate={
              this.handleDeactivateSimulationUpdate
            }
            freezeInstance={this.state.freezeInstance}
            freezeSimulation={this.state.freezeSimulation}
            fastForwardInstantiation={this.state.fastForwardInstantiation}
            fastForwardSimulation={this.state.fastForwardSimulation}
          /> */}

          {content}
        </div>
      );
    }
  }
}
