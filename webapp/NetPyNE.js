import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Transition from './components/transition/Transition';
import PythonControlledNetPyNEPopulations from './redux/reduxconnect/NetPyNEPopulationsConnection';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import PythonControlledNetPyNESynapses from './redux/reduxconnect/NetPyNESynapsesConnection';
import NetPyNEConnectivityRules from './components/definition/connectivity/NetPyNEConnectivityRules';
import PythonControlledNetPyNEStimulationSources from './redux/reduxconnect/NetPyNEStimulationSourcesConnection';
import NetPyNEStimulationTargets from './components/definition/stimulationTargets/NetPyNEStimulationTargets';
import NetPyNEPlots from './components/definition/plots/NetPyNEPlots';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEToolBar from './components/settings/NetPyNEToolBar';
import NetPyNETabs from './components/settings/NetPyNETabs';
import LayoutManager from './redux/reduxconnect/LayoutManagerContainer';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');

var PythonControlledNetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(NetPyNECellRules);

var PythonControlledNetPyNEConnectivity = PythonControlledCapability.createPythonControlledComponent(NetPyNEConnectivityRules);

var PythonControlledNetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationTargets);
var PythonControlledNetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(NetPyNEPlots);

export default class NetPyNE extends React.Component {

  constructor (props) {
    super(props);
    this.widgets = {};
    this.state = {
      value: 'define',
      prevValue: 'define',
      tabClicked: false,
      freezeInstance: false,
      freezeSimulation: false,
      fastForwardInstantiation: true,
      fastForwardSimulation: false
    };
    this.handleDeactivateInstanceUpdate = this.handleDeactivateInstanceUpdate.bind(this);
    this.handleDeactivateSimulationUpdate = this.handleDeactivateSimulationUpdate.bind(this);
    this.handleTabChangedByToolBar = this.handleTabChangedByToolBar.bind(this)
  }
 
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.data != nextProps.data) {
      console.log("Initialising NetPyNE Tabs")
      
      window.metadata = nextProps.data.metadata;
      window.currentFolder = nextProps.data.currentFolder;
      window.isDocker = nextProps.data.isDocker;
    }
  }

  hideWidgetsFor = value => {
    if (value != "define") {
      var page = this.refs[value];
      if (page) {
        var widgets = page.getOpenedWidgets();
        if (this.widgets[value]) {
          widgets = widgets.concat(this.widgets[value]);
        }
        for (var w in widgets) {
          if (!widgets[w].destroyed){
            widgets[w].hide();
          } else {
            delete widgets[w];
          }
        }
        this.widgets[value] = widgets;
      }
    }
  }

  restoreWidgetsFor = (value, rename = false) => {
    if (value != "define") {
      if (this.widgets[value]) {
        let widgets = this.widgets[value]
        for (var w in widgets) {
          if (rename && !widgets[w].getName().endsWith('(OLD)')) {
            widgets[w].setName(widgets[w].getName() + ' (OLD)')
          }
          widgets[w].show();
        }
      }
    }
  }
 
    handleChange = tab => {
      this.hideWidgetsFor(this.state.value);
      this.restoreWidgetsFor(tab, true);
      this.setState( ({ value: pv, prevValue: xx, freezeInstance:fi, freezeSimulation:fs, tabClicked:tc, ...others }) => ({
        value: tab,
        prevValue: pv, 
        freezeInstance: pv == 'define' ? false : fi,
        freezeSimulation: pv == 'define' ? false : fs,
        tabClicked: !tc,
      }))
    };

  handleTransitionOptionsChange = value => {
    var state = { fastForwardInstantiation: false, fastForwardSimulation: false }
    if (value == 'Create and Simulate Network') {
      state = { fastForwardInstantiation: true, fastForwardSimulation: true }
    } else if (value == 'Create Network') {
      state = { fastForwardInstantiation: true, fastForwardSimulation: false }
    }
    this.setState(state)
  }

  handleDeactivateInstanceUpdate = netInstanceWasUpdated => {
    if (netInstanceWasUpdated) {
      if (!this.state.freezeInstance) {
        this.setState({ freezeInstance: true })
      }
    }
  }

  handleDeactivateSimulationUpdate = netSimulationWasUpdated => {
    if (netSimulationWasUpdated) {
      if (!this.state.freezeSimulation) {
        this.setState({ freezeSimulation: true, freezeInstance: true })
      }
    }
  }
  
  handleTabChangedByToolBar = (tab, args) => {
    this.setState(({ value: x, prevValue: xx, freezeInstance: fi, freezeSimulation: fs, ...others }) => ({
      value: tab,
      prevValue: tab, 
      freezeInstance: args.freezeInstance != undefined ? args.freezeInstance : fi,
      freezeSimulation: args.freezeSimulation != undefined ? args.freezeSimulation : fs,
    }));
  }
  
  render () {
    if (!this.props.data) {
      return <div></div>
    } else {
      if (this.state.value == 'define'){
        var content = <div style={{ marginBottom: "50px" }}>
          <PythonControlledNetPyNEPopulations model={"netParams.popParams"} />
          <PythonControlledNetPyNECellRules model={"netParams.cellParams"} />
          <PythonControlledNetPyNESynapses model={"netParams.synMechParams"} />
          <PythonControlledNetPyNEConnectivity model={"netParams.connParams"} />
          <PythonControlledNetPyNEStimulationSources model={"netParams.stimSourceParams"} />
          <PythonControlledNetPyNEStimulationTargets model={"netParams.stimTargetParams"} />
          <NetPyNESimConfig model={this.props.data.simConfig} />
          <PythonControlledNetPyNEPlots model={"simConfig.analysis"} />
        </div>
      } else {
        var content = <LayoutManager />
      }
      
      return (
        <div style={{ height: '100%', width:'100%', display: 'flex', flexDirection: 'column' }} >
          <div style={{ position: 'relative', zIndex: '100' }}>
            <Toolbar id="appBar" style={{ backgroundColor: '#543a73', width:'100%', boxShadow: '0 0px 4px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)', position: 'relative', top: '0px', left: '0px', zIndex: 100 }}>
              <div style={{ marginLeft: -12 }} >
                <NetPyNEToolBar changeTab={this.handleTabChangedByToolBar} />
              </div>
              <div style={{ display: 'flex', flexFlow: 'rows', width:'100%', marginRight: -10 }}>
                <NetPyNETabs 
                  label={this.state.value} 
                  handleChange={this.handleChange} 
                  handleTransitionOptionsChange={this.handleTransitionOptionsChange}/>
              </div>
            </Toolbar>
          </div>
          
          <Transition 
            tab={this.state.value} 
            clickOnTab={this.state.tabClicked}
            handleDeactivateInstanceUpdate={this.handleDeactivateInstanceUpdate} 
            handleDeactivateSimulationUpdate={this.handleDeactivateSimulationUpdate}
            freezeInstance={this.state.freezeInstance} 
            freezeSimulation={this.state.freezeSimulation} 
            fastForwardInstantiation={this.state.fastForwardInstantiation}
            fastForwardSimulation={this.state.fastForwardSimulation}
          />
          
          {content}
        </div>
      )
    }
  }
}
