import React from 'react';
import CardText from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CondsIcon from '@material-ui/icons/LocalOffer';
import StimTargetIcon from '@material-ui/icons/Reorder';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import Utils from '../../../Utils';
import Select from '../../general/Select';
import NetPyNEField from '../../general/NetPyNEField';
import StimulationConditions from './StimulationConditions';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(Select);

export default class NetPyNEStimulationTarget extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      sourceTypeNetStim: false,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
    this.postProcessMenuItems4SynMech = this.postProcessMenuItems4SynMech.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.select = this.select.bind(this);
  }
  
  componentDidMount (){
    GEPPETTO.on('populations_change', () => {
      this.forceUpdate();
    })
    GEPPETTO.on('cellType_change', () => {
      this.forceUpdate();
    })
    GEPPETTO.on('cellModel_change', () => {
      this.forceUpdate();
    })
    GEPPETTO.on('stimSources_change', stimulationSourceId => {
      this.forceUpdate(() => {
        if (stimulationSourceId !== undefined && stimulationSourceId !== ''){
          this.handleSelection(stimulationSourceId)
        }
      });
    })
    GEPPETTO.on('synapses_change', () => {
      this.forceUpdate();
    })
  }

  componentWillUnmount (){
    GEPPETTO.off('populations_change')
    GEPPETTO.off('cellType_change')
    GEPPETTO.off('cellModel_change')
    GEPPETTO.off('stimSources_change')
  }
  
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.currentName != nextProps.name) {
      this.setState({ currentName: nextProps.name, selectedIndex:0, sectionId:'General' });
    }
  }
  
  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "StimulationTarget");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        Utils.renameKey('netParams.stimTargetParams', storedValue, newValue, (response, newValue) => {
          this.renaming = false;
        });
        this.renaming = true;
      });
    }
  };

  triggerUpdate (updateMethod) {
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  handleSelection = selection => {
    Utils
      .evalPythonMessage("'NetStim' == netpyne_geppetto.netParams.stimSourceParams['" + selection + "']['type']")
      .then(response => {
        this.setState({ sourceTypeNetStim: response });
      });
  };
  
  postProcessMenuItems = (pythonData, selected) => {
    if (selected != Object & selected != ''){
      this.handleSelection(selected);
    }
    return pythonData.map(name => (
      <MenuItem
        id={name + "MenuItem"}
        key={name}
        value={name}
      >
        {name}
      </MenuItem>
    ));
  };
  
  postProcessMenuItems4SynMech = (pythonData, selected) => pythonData.map(name => (
    <MenuItem
      id={name + "MenuItem"}
      key={name}
      value={name}
    >
      {name}
    </MenuItem>
  ));
  
  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });
  
  getBottomNavigationAction (index, sectionId, label, icon, id) {
    return <BottomNavigationAction
      id={id}
      key={sectionId}
      label={label}
      icon={icon}
      onClick={() => this.select(index, sectionId)}
    />
  }
  
  render () {
    var actions = [
      <Button
        color="primary"
        variant="contained"
        label={"BACK"}
        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
      />
    ];
    var title = this.state.errorMessage;
    var children = this.state.errorDetails;
    var dialogPop = (this.state.errorMessage != undefined) ? <Dialog
      title={title}
      open={true}
      actions={actions}
      bodyStyle={{ overflow: 'auto' }}
      style={{ whiteSpace: "pre-wrap" }}>
      {children}
    </Dialog> : undefined;

    if (this.state.sectionId == "General") {
      var content = (
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value = {this.state.currentName}
            disabled={this.renaming}
            className={"netpyneField"}
            id={"targetName"}
            label="Stimulation target name"
          />
          <br/>
          
          <NetPyNEField id={"netParams.stimTargetParams.source"} >
            <PythonMethodControlledSelectField
              model={"netParams.stimTargetParams['" + this.props.name + "']['source']"}
              method={"netpyne_geppetto.getAvailableStimSources"}
              postProcessItems={this.postProcessMenuItems}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.sec">
            <PythonControlledTextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.loc">
            <PythonControlledTextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>
        </div>
      );
      if (this.state.sourceTypeNetStim) {
        var extraContent = (
          <div>
            <NetPyNEField id={"netParams.stimTargetParams.synMech"} >
              <PythonMethodControlledSelectField
                model={"netParams.stimTargetParams['" + this.props.name + "']['synMech']"}
                method={"netpyne_geppetto.getAvailableSynMech"}
                postProcessItems={this.postProcessMenuItems4SynMech}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.weight" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['weight']"}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.delay" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['delay']"}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.synsPerConn" >
              <PythonControlledTextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['synsPerConn']"}
              />
            </NetPyNEField>
          </div>
        );
      } else {
        var extraContent = <div/>
      }
    } else if (this.state.sectionId == "Conditions") {
      var content = <StimulationConditions name={this.state.currentName}/>
    }
    
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'General', 'General', <StimTargetIcon />, 'stimTargetGeneralTab'));
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'Conditions', 'Conditions',<CondsIcon/>, 'stimTargetCondsTab')); 
    
    return (
      <div>
        <CardText>
          <BottomNavigation value={this.state.selectedIndex}>
            {bottomNavigationItems}
          </BottomNavigation>
        </CardText>
        <br />
        {content}
        {extraContent}
        {dialogPop}
      </div>
    );
  }
}
