import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';

import Button from '@material-ui/core/Button';
import { NetPyNEThumbnail, GridLayout, Filter } from 'netpyne/components';
import Box from '@material-ui/core/Box';
import Utils from '../../../Utils';
import NetPyNEHome from '../../general/NetPyNEHome';
import NetPyNEAddNew from '../../general/NetPyNEAddNew';

import NetPyNEConnectivityRule from './NetPyNESubcellsConnectivityRule';

import RulePath from '../../general/RulePath';
import Accordion from '../../general/ExpansionPanel';

export default class NetPyNESubCellsConnectivityRules extends Component {
  constructor (props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedConnectivityRule: undefined,
      deletedConnectivityRule: undefined,
      page: 'main',
      errorMessage: undefined,
      errorDetails: undefined,
      filterValue: null,
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectConnectivityRule = this.selectConnectivityRule.bind(this);
    this.handleNewConnectivityRule = this.handleNewConnectivityRule.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  handleToggle = () => this.setState((prevState) => ({ drawerOpen: !prevState.drawerOpen }));

  selectPage (page) {
    this.setState({ page });
  }

  /* Method that handles button click */
  selectConnectivityRule (connectivityRule) {
    this.setState({ selectedConnectivityRule: connectivityRule });
  }

  handleNewConnectivityRule () {
    const defaultConnectivityRules = {
      ConnectivityRule: {
        preConds: {},
        postConds: {},
      },
    };
    // Get Key and Value
    const key = Object.keys(defaultConnectivityRules)[0];
    const value = defaultConnectivityRules[key];
    // eslint-disable-next-line react/no-access-state-in-setstate
    const model = { ...this.state.value };

    // Get New Available ID
    const connectivityRuleId = Utils.getAvailableKey(model, key);
    const newConnectivityRule = {
      name: connectivityRuleId,
      ...value,
    };
    // Create Cell Rule Client side
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.subConnParams["${
        connectivityRuleId
      }"] = ${
        JSON.stringify(value)}`,
    );
    model[connectivityRuleId] = newConnectivityRule;
    // Update state
    this.setState({
      value: model,
      selectedConnectivityRule: connectivityRuleId,
    });
  }

  hasSelectedConnectivityRuleBeenRenamed (prevState, currentState) {
    const currentModel = prevState.value;
    const model = currentState.value;
    // deal with rename
    if (currentModel != undefined && model != undefined) {
      const oldP = Object.keys(currentModel);
      const newP = Object.keys(model);
      if (oldP.length == newP.length) {
        // if it's the same lenght there could be a rename
        for (let i = 0; i < oldP.length; i++) {
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
    const newConnectivityRuleName = this.hasSelectedConnectivityRuleBeenRenamed(
      prevState,
      this.state,
    );
    if (newConnectivityRuleName !== undefined) {
      this.setState({
        selectedConnectivityRule: newConnectivityRuleName,
        deletedConnectivityRule: undefined,
      });
    } else if (
      prevState.value !== undefined
      && Object.keys(prevState.value).length
      !== Object.keys(this.state.value).length
    ) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      const model = this.state.value;
      for (var m in model) {
        if (prevState.value !== '' && !(m in prevState.value)) {
          var newValue = Utils.nameValidation(m);
          if (newValue != m) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            delete model[m];
            this.setState(
              {
                value: model,
                errorMessage: 'Error',
                errorDetails:
                  `Leading digits or whitespaces are not allowed in ConnectivityRule names.\n${
                    m
                  } has been renamed ${
                    newValue}`,
              },
              () => {
                Utils.renameKey(
                  'netParams.subConnParams',
                  m,
                  newValue,
                  (response, newValue) => {
                  },
                );
              },
            );
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const itemRenamed = this.hasSelectedConnectivityRuleBeenRenamed(this.state, nextState)
      !== undefined;
    let newItemCreated = false;
    const selectionChanged = this.state.selectedConnectivityRule != nextState.selectedConnectivityRule;
    const pageChanged = this.state.page != nextState.page;
    const newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length
        != Object.keys(nextState.value).length;
    }
    const errorDialogOpen = this.state.errorDetails !== nextState.errorDetails;
    const filterValueChanged = nextState.filterValue !== this.state.filterValue;
    return (
      filterValueChanged
      || newModel
      || newItemCreated
      || itemRenamed
      || selectionChanged
      || pageChanged
      || errorDialogOpen
    );
  }

  handleRenameChildren (childName) {
    childName = childName.replace(/\s*$/, '');
    const childrenList = Object.keys(this.state.value);
    for (let i = 0; childrenList.length > i; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  getCopyPath () {
    const {
      value: model,
      selectedConnectivityRule,
    } = this.state;
    return (
      model
      && model[selectedConnectivityRule]
      && `netParams.subConnParams["${selectedConnectivityRule}"]`
    );
  }

  render () {
    const actions = [
      <Button
        variant="contained"
        color="primary"
        label="BACK"
        onTouchTap={() => this.setState({
          errorMessage: undefined,
          errorDetails: undefined,
        })}
      />,
    ];
    const title = this.state.errorMessage;
    const children = this.state.errorDetails;
    const dialogPop = this.state.errorMessage != undefined ? (
      <Dialog
        title={title}
        open
        actions={actions}
        bodyStyle={{ overflow: 'auto' }}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {children}
      </Dialog>
    ) : (
      undefined
    );

    const model = this.state.value;
    if (this.state.page == 'main') {
      const filterName = this.state.filterValue === null ? '' : this.state.filterValue;
      var ConnectivityRules = Object.keys(model || [])
        .filter((connName) => connName.toLowerCase()
          .includes(filterName.toLowerCase()))
        .map((connName) => (
          <NetPyNEThumbnail
            name={connName}
            key={connName}
            selected={connName == this.state.selectedConnectivityRule}
            paramPath="subConnParams"
            handleClick={this.selectConnectivityRule}
          />
        ));

      var selectedConnectivityRule;
      if (
        this.state.selectedConnectivityRule !== undefined
        && Object.keys(model)
          .indexOf(this.state.selectedConnectivityRule) > -1
      ) {
        selectedConnectivityRule = (
          <NetPyNEConnectivityRule
            name={this.state.selectedConnectivityRule}
            model={this.state.value[this.state.selectedConnectivityRule]}
            selectPage={this.selectPage}
            renameHandler={this.handleRenameChildren}
          />
        );
      }
    }

    return (
      <GridLayout>
        <div>
          <Accordion>
            <div className="breadcrumb">
              <div>
                <NetPyNEHome
                  selection={this.state.selectedConnectivityRule}
                  handleClick={() => this.setState({ selectedConnectivityRule: undefined })}
                />

                <div style={{ opacity: 0 }}>H</div>
              </div>
              <div>
                <NetPyNEAddNew
                  title="Create new connectivity rule"
                  id="newConnectivityRuleButton"
                  handleClick={this.handleNewConnectivityRule}
                />
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Source Sans Pro',
                    maxWidth: 40,
                    overflow: 'visible',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  Connectivity
                </div>
              </div>
            </div>
            <Box p={1}>
              <RulePath text={this.getCopyPath()} />
              <Box mb={1} />
              <Filter
                value={this.state.filterValue}
                label="Filter connectivity rule by name..."
                handleFilterChange={(newValue) => this.setState({ filterValue: newValue })}
                options={model === undefined ? [] : Object.keys(model)}
              />
            </Box>
          </Accordion>
        </div>
        <Box className="scrollbar scrollchild" mt={1}>
          {ConnectivityRules}
        </Box>
        {selectedConnectivityRule}
        {dialogPop}
      </GridLayout>
    );
  }
}
