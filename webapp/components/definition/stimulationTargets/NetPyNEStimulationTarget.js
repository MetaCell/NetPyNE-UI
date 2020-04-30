import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CondsIcon from '@material-ui/icons/LocalOffer';
import StimTargetIcon from '@material-ui/icons/Reorder';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Utils from '../../../Utils';
import StimulationConditions from './StimulationConditions';

import {
  NetPyNEField,
  NetPyNETextField,
  NetPyNESelectField
} from 'netpyne/components';


export default class NetPyNEStimulationTarget extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      isSourceTypeNetStim: false,
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
    this.isStimSourceTypeNetStim()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.name !== prevProps.name || this.props.updates !== prevProps.updates) {
      this.isStimSourceTypeNetStim()
    }
    if (prevProps.updates !== this.props.updates) {
      this.forceUpdate()
    }
  }

  async handleStimSourceSelection (selectedStimSourceName) {
    return await Utils.evalPythonMessage("'NetStim' == netpyne_geppetto.netParams.stimSourceParams['" + selectedStimSourceName + "']['type']")
  }
  

  async isStimSourceTypeNetStim (stimSourceName) {
    var isNetStim = false
    if (stimSourceName === undefined) {
      try {
        stimSourceName = await Utils.evalPythonMessage("netpyne_geppetto.netParams.stimTargetParams['" + this.props.name + "']['source']")
      } catch (error){
        console.log(error)
      }
      
    }

    if (stimSourceName !== '') {
      isNetStim = await Utils.evalPythonMessage("'NetStim' == netpyne_geppetto.netParams.stimSourceParams['" + stimSourceName + "']['type']")
    }
     
    if (isNetStim != this.state.isSourceTypeNetStim) {
      this.setState({ isSourceTypeNetStim: isNetStim })
    }
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
  
  postProcessMenuItems = (pythonData, selectedStimSourceName) => {
    if (selectedStimSourceName != Object & selectedStimSourceName != '') {
      this.isStimSourceTypeNetStim(selectedStimSourceName);
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
    var dialogPop = (this.state.errorMessage != undefined) ? (
      <Dialog
        open={true}
        style={{ whiteSpace: "pre-wrap" }}>
        <DialogTitle id="alert-dialog-title">{this.state.errorMessage}</DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {this.state.errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          >BACK</Button>
        </DialogActions>
      </Dialog>
    )
      : undefined

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
            <NetPyNESelectField
              model={"netParams.stimTargetParams['" + this.props.name + "']['source']"}
              method={"netpyne_geppetto.getAvailableStimSources"}
              postProcessItems={this.postProcessMenuItems}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.sec">
            <NetPyNETextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimTargetParams.loc">
            <NetPyNETextField
              model={"netParams.stimTargetParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>
        </div>
      );
      if (this.state.isSourceTypeNetStim) {
        var extraContent = (
          <div>
            <NetPyNEField id={"netParams.stimTargetParams.synMech"} >
              <NetPyNESelectField
                model={"netParams.stimTargetParams['" + this.props.name + "']['synMech']"}
                method={"netpyne_geppetto.getAvailableSynMech"}
                postProcessItems={this.postProcessMenuItems4SynMech}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.weight" >
              <NetPyNETextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['weight']"}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.delay" >
              <NetPyNETextField
                model={"netParams.stimTargetParams['" + this.props.name + "']['delay']"}
              />
            </NetPyNEField>
          
            <NetPyNEField id="netParams.stimTargetParams.synsPerConn" >
              <NetPyNETextField
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
        <BottomNavigation style={{ borderRadius: '4px' }} value={this.state.selectedIndex}>
          {bottomNavigationItems}
        </BottomNavigation>
        <br />
        {content}
        {extraContent}
        {dialogPop}
      </div>
    );
  }
}
