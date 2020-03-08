import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Utils from '../../../Utils';
import NetPyNEHome from '../../general/NetPyNEHome';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNEConnectivityRule from './NetPyNEConnectivityRule';

export default class NetPyNEConnectivityRules extends Component {

  constructor (props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedConnectivityRule: undefined,
      deletedConnectivityRule: undefined,
      page: "main",
      errorMessage: undefined,
      errorDetails: undefined
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectConnectivityRule = this.selectConnectivityRule.bind(this);
    this.handleNewConnectivityRule = this.handleNewConnectivityRule.bind(this);
    this.deleteConnectivityRule = this.deleteConnectivityRule.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });


  selectPage (page) {
    this.setState({ page: page });
  }

  /* Method that handles button click */
  selectConnectivityRule (connectivityRule) {
    this.setState({ selectedConnectivityRule: connectivityRule });
  }

  handleNewConnectivityRule () {
    var defaultConnectivityRules = { 
      'ConnectivityRule': {
        'preConds': {},
        'postConds': {}
      }
    };
    // Get Key and Value
    var key = Object.keys(defaultConnectivityRules)[0];
    var value = defaultConnectivityRules[key];
    var model = this.state.value;

    // Get New Available ID
    var connectivityRuleId = Utils.getAvailableKey(model, key);
    var newConnectivityRule = Object.assign({ name: connectivityRuleId }, value);
    // Create Cell Rule Client side
    Utils.execPythonMessage('netpyne_geppetto.netParams.connParams["' + connectivityRuleId + '"] = ' + JSON.stringify(value));
    model[connectivityRuleId] = newConnectivityRule;
    // Update state
    this.setState({
      value: model,
      selectedConnectivityRule: connectivityRuleId
    });
  }


  hasSelectedConnectivityRuleBeenRenamed (prevState, currentState) {
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
            if (prevState.selectedConnectivityRule != undefined) {
              if (oldP[i] == prevState.selectedConnectivityRule) {
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
    // we need to check if any of the three entities have been renamed and if that's the case change the state for the selection variable
    var newConnectivityRuleName = this.hasSelectedConnectivityRuleBeenRenamed(prevState, this.state);
    if (newConnectivityRuleName !== undefined) {
      this.setState({ selectedConnectivityRule: newConnectivityRuleName, deletedConnectivityRule: undefined });
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
              errorDetails: "Leading digits or whitespaces are not allowed in ConnectivityRule names.\n"
                                          + m + " has been renamed " + newValue
            },
            function () {
              Utils.renameKey('netParams.connParams', m, newValue, (response, newValue) => {});
            }.bind(this));
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed = this.hasSelectedConnectivityRuleBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedConnectivityRule != nextState.selectedConnectivityRule;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails);
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
  }

  deleteConnectivityRule (name) {
    Utils.evalPythonMessage('netpyne_geppetto.deleteParam', ['connParams', name]).then(response => {
      var model = this.state.value;
      delete model[name];
      this.setState({ value: model, selectedConnectivityRule: undefined, deletedConnectivityRule: name });
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

    var that = this;
    var model = this.state.value;
    var content;
    if (this.state.page == 'main') {

      var ConnectivityRules = [];
      for (var c in model) {
        ConnectivityRules.push(<NetPyNEThumbnail 
          name={c} 
          key={c} 
          selected={c == this.state.selectedConnectivityRule} 
          deleteMethod={this.deleteConnectivityRule}
          handleClick={this.selectConnectivityRule} />);
      }
      var selectedConnectivityRule = undefined;
      if ((this.state.selectedConnectivityRule !== undefined) && Object.keys(model).indexOf(this.state.selectedConnectivityRule) > -1) {
        selectedConnectivityRule = <NetPyNEConnectivityRule name={this.state.selectedConnectivityRule} model={this.state.value[this.state.selectedConnectivityRule]} selectPage={this.selectPage} renameHandler={this.handleRenameChildren} />;
      }

      content = (

        <CardContent className={"tabContainer"}>
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <NetPyNEHome
                selection={this.state.selectedConnectivityRule}
                handleClick={() => this.setState({ selectedConnectivityRule: undefined })}
              />
              
              <NetPyNEAddNew id={"newConnectivityRuleButton"} handleClick={this.handleNewConnectivityRule} />
              
            </div>
            <div style={{ clear: "both" }}></div>
            {ConnectivityRules}
          </div>
          <div className={"details"}>
            {selectedConnectivityRule}
            {dialogPop}
          </div>
        </CardContent>);
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Connectivity rules"
          subheader="Define here the rules to generate the connections in your network"
          id="Connections"
        />
        {content}
      </Card>);
  }
}