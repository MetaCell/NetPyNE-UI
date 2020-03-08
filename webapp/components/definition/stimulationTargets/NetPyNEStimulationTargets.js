import React, { Component } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import Utils from '../../../Utils';
import NetPyNEHome from '../../general/NetPyNEHome';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNEStimulationTarget from './NetPyNEStimulationTarget';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';


export default class NetPyNEStimulationTargets extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedStimulationTarget: undefined,
      deletedStimulationTarget: undefined,
      page: "main",
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.selectStimulationTarget = this.selectStimulationTarget.bind(this);
    this.handleNewStimulationTarget = this.handleNewStimulationTarget.bind(this);
    this.deleteStimulationTarget = this.deleteStimulationTarget.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  /* Method that handles button click */
  selectStimulationTarget (StimulationTarget) {
    this.setState({ selectedStimulationTarget: StimulationTarget });
  }

  handleNewStimulationTarget () {
    var defaultStimulationTargets = { 'stim_target': { 'source': '', 'conds': {} } };
    var key = Object.keys(defaultStimulationTargets)[0];
    var value = defaultStimulationTargets[key];
    var model = this.state.value;
    var StimulationTargetId = Utils.getAvailableKey(model, key);
    var newStimulationTarget = Object.assign({ name: StimulationTargetId }, value);
    Utils.execPythonMessage('netpyne_geppetto.netParams.stimTargetParams["' + StimulationTargetId + '"] = ' + JSON.stringify(value));
    model[StimulationTargetId] = newStimulationTarget;
    this.setState({
      value: model,
      selectedStimulationTarget: StimulationTargetId
    });
  }

  hasSelectedStimulationTargetBeenRenamed (prevState, currentState) {
    var currentModel = prevState.value;
    var model = currentState.value;
    // deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        // if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (prevState.selectedStimulationTarget != undefined) {
              if (oldP[i] == prevState.selectedStimulationTarget) {
                return newP[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }
 
  componentDidUpdate (prevProps, prevState) {
    var newStimulationTargetName = this.hasSelectedStimulationTargetBeenRenamed(prevState, this.state);
    if (newStimulationTargetName !== undefined) {
      this.setState({ selectedStimulationTarget: newStimulationTargetName, deletedStimulationTarget: undefined });
    } else if ((prevState.value !== undefined) && (Object.keys(prevState.value).length !== Object.keys(this.state.value).length)) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      var model = this.state.value;
      for (var m in model) {
        if ((prevState.value !== "") && (!(m in prevState.value))) {
          var newValue = Utils.nameValidation(m);
          if (newValue != m) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            delete model[m];
            this.setState({
              value: model,
              errorMessage: "Error",
              errorDetails: "Leading digits or whitespaces are not allowed in Population names.\n"
                                          + m + " has been renamed " + newValue
            },
            () => Utils.renameKey('netParams.stimTargetParams', m, newValue, (response, newValue) => {}));
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationTargetBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationTarget != nextState.selectedStimulationTarget;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel){
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails);
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
  }

  deleteStimulationTarget (name) {
    Utils.evalPythonMessage('netpyne_geppetto.deleteParam', ['stimTargetParams', name]).then(response => {
      var model = this.state.value;
      delete model[name];
      this.setState({ value: model, selectedStimulationTarget: undefined, deletedStimulationTarget: name });
    });
  }

  handleRenameChildren (childName) {
    childName = childName.replace(/\s*$/,"");
    var childrenList = Object.keys(this.state.value);
    for (var i = 0 ; childrenList.length > i ; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  render () {
    var actions = [
      <Button
        variant="contained"
        color="primary"
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

    var model = this.state.value;
    var StimulationTargets = [];
    for (var c in model) {
      StimulationTargets.push(<NetPyNEThumbnail 
        name={c} 
        key={c} 
        selected={c == this.state.selectedStimulationTarget} 
        deleteMethod={this.deleteStimulationTarget}
        handleClick={this.selectStimulationTarget} />);
    }
    var selectedStimulationTarget = undefined;
    if ((this.state.selectedStimulationTarget !== undefined) && Object.keys(model).indexOf(this.state.selectedStimulationTarget) > -1) {
      selectedStimulationTarget = <NetPyNEStimulationTarget name={this.state.selectedStimulationTarget} renameHandler={this.handleRenameChildren}/>;
    }

    var content = (
      <CardContent className={"tabContainer"} >
        <div className={"details"}>
          {selectedStimulationTarget}
        </div>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <NetPyNEHome
              selection={this.state.selectedStimulationTarget}
              handleClick={() => this.setState({ selectedStimulationTarget: undefined })}
            />
            
            <NetPyNEAddNew id={"newStimulationTargetButton"} handleClick={this.handleNewStimulationTarget} />

          </div>
          <div style={{ clear: "both" }}></div>
          {StimulationTargets}
        </div>
      </CardContent>
    );

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Stimulation target rules"
          subheader="Define here the rules to connect stimulation sources to targets in your network"
          id="StimulationTargets"
        />
        {content}
        {dialogPop}
      </Card>
    );
  }
}