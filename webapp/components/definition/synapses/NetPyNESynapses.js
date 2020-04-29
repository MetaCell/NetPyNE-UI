import React,{ Component } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import Utils from '../../../Utils';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';


import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNESynapse
} from 'netpyne/components';

export default class NetPyNESynapses extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedSynapse: undefined,
      deletedSynapse: undefined,
      page: "main",
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.selectSynapse = this.selectSynapse.bind(this);
    this.handleNewSynapse = this.handleNewSynapse.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  /* Method that handles button click */
  selectSynapse (Synapse) {
    this.setState({ selectedSynapse: Synapse });
  }

  handleNewSynapse () {
    var defaultSynapses = { 'Synapse': { 'mod': '' } };
    var key = Object.keys(defaultSynapses)[0];
    var value = defaultSynapses[key];
    var model = { ...this.state.value };
    var SynapseId = Utils.getAvailableKey(model, key);
    var newSynapse = Object.assign({ name: SynapseId }, value);
    Utils.execPythonMessage('netpyne_geppetto.netParams.synMechParams["' + SynapseId + '"] = ' + JSON.stringify(value));
    model[SynapseId] = newSynapse;
    this.setState({
      value: model,
      selectedSynapse: SynapseId
    }, () => this.props.updateCards())
  }

  hasSelectedSynapseBeenRenamed (prevState, currentState) {
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
            if (prevState.selectedSynapse != undefined) {
              if (oldP[i] == prevState.selectedSynapse) {
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
    var newSynapseName = this.hasSelectedSynapseBeenRenamed(prevState, this.state);
    if (newSynapseName !== undefined) {
      this.setState({ selectedSynapse: newSynapseName, deletedSynapse: undefined });
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
              errorDetails: "Leading digits or whitespaces are not allowed in Synapses names.\n"
                                          + m + " has been renamed " + newValue
            },
            () => Utils.renameKey('netParams.synMechParams', m, newValue, (response, newValue) => this.props.updateCards()));
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed = this.hasSelectedSynapseBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedSynapse != nextState.selectedSynapse;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails);
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
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
    var Synapses = [];
    for (var c in model) {
      Synapses.push(<NetPyNEThumbnail
        id={"synThumb" + c.replace(" ", "")}
        name={c} 
        key={c} 
        selected={c == this.state.selectedSynapse}
        paramPath="synMechParams"
        handleClick={this.selectSynapse} />);
    }
    var selectedSynapse = undefined;
    if ((this.state.selectedSynapse !== undefined) && Object.keys(model).indexOf(this.state.selectedSynapse) > -1) {
      selectedSynapse = <NetPyNESynapse name={this.state.selectedSynapse} renameHandler={this.handleRenameChildren} />;
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardContent className={"tabContainer"}>
          <div className={"details"}>
            {selectedSynapse}
          </div>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <NetPyNEHome
                selection={this.state.selectedSynapse}
                handleClick={() => this.setState({ selectedSynapse: undefined })}
              />
              <NetPyNEAddNew id={"newSynapseButton"} handleClick={this.handleNewSynapse} />
            </div>
            <div style={{ clear: "both" }}></div>
            {Synapses}
            {dialogPop}
          </div>
        </CardContent>
      </Card>
    );
  }
}