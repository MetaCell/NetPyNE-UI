import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNEStimulationTarget,
  GridLayout,
  Filter,
} from 'netpyne/components';
import Box from '@material-ui/core/Box';
import Utils from '../../../Utils';

import RulePath from '../../general/RulePath';
import Accordion from '../../general/ExpansionPanel';

export default class NetPyNEStimulationTargets extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedStimulationTarget: undefined,
      deletedStimulationTarget: undefined,
      page: 'main',
      errorMessage: undefined,
      errorDetails: undefined,
      filterValue: null,
    };
    this.selectStimulationTarget = this.selectStimulationTarget.bind(this);
    this.handleNewStimulationTarget = this.handleNewStimulationTarget.bind(
      this,
    );

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  /* Method that handles button click */
  selectStimulationTarget (StimulationTarget) {
    this.setState({ selectedStimulationTarget: StimulationTarget });
  }

  handleNewStimulationTarget () {
    const defaultStimulationTargets = {
      stim_target: {
        source: '',
        conds: {},
      },
    };
    const key = Object.keys(defaultStimulationTargets)[0];
    const value = defaultStimulationTargets[key];
    const model = { ...this.state.value };
    const StimulationTargetId = Utils.getAvailableKey(model, key);
    const newStimulationTarget = {
      name: StimulationTargetId,
      ...value,
    };
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.stimTargetParams["${
        StimulationTargetId
      }"] = ${
        JSON.stringify(value)}`,
    );
    model[StimulationTargetId] = newStimulationTarget;
    this.setState({
      value: model,
      selectedStimulationTarget: StimulationTargetId,
    });
  }

  hasSelectedStimulationTargetBeenRenamed (prevState, currentState) {
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
    const newStimulationTargetName = this.hasSelectedStimulationTargetBeenRenamed(
      prevState,
      this.state,
    );
    if (newStimulationTargetName !== undefined) {
      this.setState({
        selectedStimulationTarget: newStimulationTargetName,
        deletedStimulationTarget: undefined,
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
                  `Leading digits or whitespaces are not allowed in Population names.\n${
                    m
                  } has been renamed ${
                    newValue}`,
              },
              () => Utils.renameKey(
                'netParams.stimTargetParams',
                m,
                newValue,
                (response, newValue) => {
                },
              ),
            );
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const itemRenamed = this.hasSelectedStimulationTargetBeenRenamed(this.state, nextState)
      !== undefined;
    let newItemCreated = false;
    const selectionChanged = this.state.selectedStimulationTarget
      != nextState.selectedStimulationTarget;
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

  getPath () {
    const {
      value: model,
      selectedStimulationTarget,
    } = this.state;
    return (
      model
      && model[selectedStimulationTarget]
      && `netParams.stimTargetParams["${selectedStimulationTarget}"]`
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

    const filterName = this.state.filterValue === null ? '' : this.state.filterValue;
    const StimulationTargets = Object.keys(model || [])
      .filter((stimTargetName) => stimTargetName.toLowerCase()
        .includes(filterName.toLowerCase()))
      .map((stimTargetName) => (
        <NetPyNEThumbnail
          name={stimTargetName}
          key={stimTargetName}
          selected={stimTargetName == this.state.selectedStimulationTarget}
          paramPath="stimTargetParams"
          handleClick={this.selectStimulationTarget}
        />
      ));

    let selectedStimulationTarget;
    if (
      this.state.selectedStimulationTarget !== undefined
      && Object.keys(model)
        .indexOf(this.state.selectedStimulationTarget) > -1
    ) {
      selectedStimulationTarget = (
        <NetPyNEStimulationTarget
          name={this.state.selectedStimulationTarget}
          renameHandler={this.handleRenameChildren}
        />
      );
    }

    return (
      <GridLayout>
        <div>
          <Accordion>
            <div className="breadcrumb">
              <div>
                <NetPyNEHome
                  selection={this.state.selectedStimulationTarget}
                  handleClick={() => this.setState({ selectedStimulationTarget: undefined })}
                />
                <div style={{ opacity: 0 }}>H</div>
              </div>
              <div>
                <NetPyNEAddNew
                  title="Create new stimulation target"
                  id="newStimulationTargetButton"
                  handleClick={this.handleNewStimulationTarget}
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
                  Target
                </div>
              </div>
            </div>
            <Box p={1}>
              <RulePath text={this.getPath()} />
              <Box mb={1} />
              <Filter
                value={this.state.filterValue}
                label="Filter stimulation target rule by name..."
                handleFilterChange={(newValue) => this.setState({ filterValue: newValue })}
                options={model === undefined ? [] : Object.keys(model)}
              />
            </Box>
          </Accordion>
        </div>
        <Box className="scrollbar scrollchild" mt={1}>
          {StimulationTargets}
        </Box>
        {selectedStimulationTarget}
        {dialogPop}
      </GridLayout>
    );
  }
}
