import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNEStimulationSource,
  GridLayout,
  Filter,
} from 'netpyne/components';

import Box from '@material-ui/core/Box';
import RulePath from '../../general/RulePath';
import Accordion from '../../general/ExpansionPanel';
import Utils from '../../../Utils';

export default class NetPyNEStimulationSources extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedStimulationSource: undefined,
      deletedStimulationSource: undefined,
      page: 'main',
      errorMessage: undefined,
      errorDetails: undefined,
      filterValue: null,
    };
    this.selectStimulationSource = this.selectStimulationSource.bind(this);
    this.handleNewStimulationSource = this.handleNewStimulationSource.bind(
      this,
    );

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  /* Method that handles button click */
  selectStimulationSource (StimulationSource) {
    this.setState({ selectedStimulationSource: StimulationSource });
  }

  handleNewStimulationSource () {
    const defaultStimulationSources = { stim_source: { type: 'NetStim' } };
    const key = Object.keys(defaultStimulationSources)[0];
    const value = defaultStimulationSources[key];
    const model = { ...this.state.value };
    const StimulationSourceId = Utils.getAvailableKey(model, key);
    const newStimulationSource = {
      name: StimulationSourceId,
      ...value,
    };
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.stimSourceParams["${
        StimulationSourceId
      }"] = ${
        JSON.stringify(value)}`,
    );
    model[StimulationSourceId] = newStimulationSource;
    this.setState(
      {
        value: model,
        selectedStimulationSource: StimulationSourceId,
      },
      () => this.props.updateCards(),
    );
  }

  hasSelectedStimulationSourceBeenRenamed (prevState, currentState) {
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
            if (prevState.selectedStimulationSource != undefined) {
              if (oldP[i] == prevState.selectedStimulationSource) {
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
    const newStimulationSourceName = this.hasSelectedStimulationSourceBeenRenamed(
      prevState,
      this.state,
    );
    if (newStimulationSourceName !== undefined) {
      this.setState({
        selectedStimulationSource: newStimulationSourceName,
        deletedStimulationSource: undefined,
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
                'netParams.stimSourceParams',
                m,
                newValue,
                (response, newValue) => this.props.updateCards(),
              ),
            );
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const itemRenamed = this.hasSelectedStimulationSourceBeenRenamed(this.state, nextState)
      !== undefined;
    let newItemCreated = false;
    const selectionChanged = this.state.selectedStimulationSource
      != nextState.selectedStimulationSource;
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
      selectedStimulationSource,
    } = this.state;
    return (
      model
      && model[selectedStimulationSource]
      && `netParams.stimSourceParams["${selectedStimulationSource}"]`
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
    const StimulationSources = Object.keys(model || [])
      .filter((stimSource) => stimSource.toLowerCase()
        .includes(filterName.toLowerCase()))
      .map((stimSource) => (
        <NetPyNEThumbnail
          name={stimSource}
          key={stimSource}
          selected={stimSource == this.state.selectedStimulationSource}
          paramPath="stimSourceParams"
          handleClick={this.selectStimulationSource}
        />
      ));

    let selectedStimulationSource;
    if (
      this.state.selectedStimulationSource !== undefined
      && Object.keys(model)
        .indexOf(this.state.selectedStimulationSource) > -1
    ) {
      selectedStimulationSource = (
        <NetPyNEStimulationSource
          name={this.state.selectedStimulationSource}
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
                  selection={this.state.selectedStimulationSource}
                  handleClick={() => this.setState({ selectedStimulationSource: undefined })}
                />
                <div style={{ opacity: 0 }}>H</div>
              </div>
              <div>
                <NetPyNEAddNew
                  id="newStimulationSourceButton"
                  title="Create new stimulation source"
                  handleClick={this.handleNewStimulationSource}
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
                  Source
                </div>
              </div>
            </div>
            <Box p={1}>
              <RulePath text={this.getPath()} />
              <Box mb={1} />
              <Filter
                value={this.state.filterValue}
                label="Filter stimulation source rule by name..."
                handleFilterChange={(newValue) => this.setState({ filterValue: newValue })}
                options={model === undefined ? [] : Object.keys(model)}
              />
            </Box>
          </Accordion>
        </div>
        <Box className="scrollbar scrollchild" mt={1}>
          {StimulationSources}
        </Box>
        {selectedStimulationSource}
        {dialogPop}
      </GridLayout>
    );
  }
}
