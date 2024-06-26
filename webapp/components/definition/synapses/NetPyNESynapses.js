import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNESynapse,
  GridLayout,
  Filter,
} from 'netpyne/components';

import Box from '@material-ui/core/Box';
import RulePath from '../../general/RulePath';
import Accordion from '../../general/ExpansionPanel';
import Utils from '../../../Utils';

export default class NetPyNESynapses extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedSynapse: undefined,
      deletedSynapse: undefined,
      page: 'main',
      errorMessage: undefined,
      errorDetails: undefined,
      filterValue: null,
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
    const defaultSynapses = { Synapse: { mod: 'Exp2Syn' } };
    const key = Object.keys(defaultSynapses)[0];
    const value = defaultSynapses[key];
    // eslint-disable-next-line react/no-access-state-in-setstate
    const model = { ...this.state.value };
    const SynapseId = Utils.getAvailableKey(model, key);
    const newSynapse = { name: SynapseId, ...value };
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.synMechParams["${
        SynapseId
      }"] = ${
        JSON.stringify(value)}`,
    );
    model[SynapseId] = newSynapse;
    this.setState(
      {
        value: model,
        selectedSynapse: SynapseId,
      },
      () => this.props.updateCards(),
    );
  }

  hasSelectedSynapseBeenRenamed (prevState, currentState) {
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
    const newSynapseName = this.hasSelectedSynapseBeenRenamed(
      prevState,
      this.state,
    );
    if (newSynapseName !== undefined) {
      this.setState({
        selectedSynapse: newSynapseName,
        deletedSynapse: undefined,
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
                  `Leading digits or whitespaces are not allowed in Synapses names.\n${
                    m
                  } has been renamed ${
                    newValue}`,
              },
              () => Utils.renameKey(
                'netParams.synMechParams',
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
    const itemRenamed = this.hasSelectedSynapseBeenRenamed(this.state, nextState) !== undefined;
    let newItemCreated = false;
    const selectionChanged = this.state.selectedSynapse != nextState.selectedSynapse;
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
      selectedSynapse,
    } = this.state;
    return (
      model
      && model[selectedSynapse]
      && `netParams.synMechParams["${selectedSynapse}"]`
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
    const Synapses = Object.keys(model || [])
      .filter((synName) => synName.toLowerCase()
        .includes(filterName.toLowerCase()))
      .map((synName) => (
        <NetPyNEThumbnail
          name={synName}
          key={synName}
          selected={synName == this.state.selectedSynapse}
          paramPath="synMechParams"
          handleClick={this.selectSynapse}
        />
      ));

    let selectedSynapse;
    if (
      this.state.selectedSynapse !== undefined
      && Object.keys(model)
        .indexOf(this.state.selectedSynapse) > -1
    ) {
      selectedSynapse = (
        <NetPyNESynapse
          name={this.state.selectedSynapse}
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
                  selection={this.state.selectedSynapse}
                  handleClick={() => this.setState({ selectedSynapse: undefined })}
                />
                <div style={{ opacity: 0 }}>H</div>
              </div>
              <div>
                <NetPyNEAddNew
                  title="Create new synapse"
                  id="newSynapseButton"
                  handleClick={this.handleNewSynapse}
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
                  Synapse
                </div>
              </div>
            </div>
            <Box p={1}>
              <RulePath text={this.getPath()} />
              <Box mb={1} />
              <Filter
                value={this.state.filterValue}
                label="Filter synapse rule by name..."
                handleFilterChange={(newValue) => this.setState({ filterValue: newValue })}
                options={model === undefined ? [] : Object.keys(model)}
              />
            </Box>
          </Accordion>
        </div>
        <Box className="scrollbar scrollchild" mt={1}>
          {Synapses}
        </Box>
        {selectedSynapse}
        {dialogPop}
      </GridLayout>
    );
  }
}
