import React from 'react';

import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNEPopulation,
  GridLayout,
  Filter,
} from 'netpyne/components';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Accordion from '../../general/ExpansionPanel';
import RulePath from '../../general/RulePath';
import Utils from '../../../Utils';

export default class NetPyNEPopulations extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedPopulation: undefined,
      populationDeleted: undefined,
      errorMessage: undefined,
      errorDetails: undefined,
      filterPopValue: null,
    };

    this.handleNewPopulation = this.handleNewPopulation.bind(this);
    this.selectPopulation = this.selectPopulation.bind(this);
    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  handleToggle = () => this.setState((prevState) => ({ drawerOpen: !prevState.drawerOpen }));

  hasSelectedPopulationBeenRenamed (prevState, currentState) {
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
            if (prevState.selectedPopulation != undefined) {
              if (oldP[i] == prevState.selectedPopulation) {
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
    const newPopulationName = this.hasSelectedPopulationBeenRenamed(
      prevState,
      this.state,
    );
    if (newPopulationName !== undefined) {
      this.setState({
        selectedPopulation: newPopulationName,
        populationDeleted: undefined,
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
          var newValue = Utils.nameValidation(model[m].name);
          if (newValue != model[m].name) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            model[newValue].name = newValue;
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
                'netParams.popParams',
                m,
                newValue,
                (response, newValue) => {
                  this.props.updateCards();
                },
              ),
            );
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const itemRenamed = this.hasSelectedPopulationBeenRenamed(this.state, nextState)
      !== undefined;
    let newItemCreated = false;
    const selectionChanged = this.state.selectedPopulation != nextState.selectedPopulation;
    const newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length
        != Object.keys(nextState.value).length;
    }
    // check if the dialog has been triggered due name convention or name collision errors.
    const errorDialogOpen = this.state.errorDetails !== nextState.errorDetails;
    const filterChanged = nextState.filterPopValue !== this.state.filterPopValue;
    return (
      filterChanged
      || newModel
      || newItemCreated
      || itemRenamed
      || selectionChanged
      || errorDialogOpen
    );
  }

  handleNewPopulation () {
    const defaultPopulationValues = {
      Population: {
        cellModel: '',
        cellType: '',
      },
    };
    // Get Key and Value
    const key = Object.keys(defaultPopulationValues)[0];
    const value = defaultPopulationValues[key];
    // eslint-disable-next-line react/no-access-state-in-setstate
    const model = { ...this.state.value };

    // Get New Available ID
    const populationId = Utils.getAvailableKey(model, key);

    // Create Population Object
    const newPopulation = { name: populationId, ...value };

    // Create Population Client side
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.popParams["${
        populationId
      }"] = ${
        JSON.stringify(value)}`,
    );

    // Update state
    model[populationId] = newPopulation;
    this.setState(
      {
        value: model,
        selectedPopulation: populationId,
      },
      () => this.props.updateCards(),
    );
  }

  /* Method that handles button click */
  selectPopulation (populationName) {
    this.setState({ selectedPopulation: populationName });
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
      selectedPopulation,
    } = this.state;
    return (
      model
      && model[selectedPopulation]
      && `netParams.popParams["${selectedPopulation}"]`
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

    if (this.state.value != undefined && this.state.value !== '') {
      var model = this.state.value;
      for (const m in model) {
        model[m].name = m;
      }
      const filterName = this.state.filterPopValue === null ? '' : this.state.filterPopValue;
      var populations = Object.keys(model)
        .filter((popName) => popName.toLowerCase()
          .includes(filterName.toLowerCase()))
        .map((popName) => (
          <NetPyNEThumbnail
            name={popName}
            key={popName}
            selected={popName == this.state.selectedPopulation}
            paramPath="popParams"
            handleClick={this.selectPopulation}
          />
        ));

      var selectedPopulation;
      if (
        this.state.selectedPopulation !== undefined
        && Object.keys(model)
          .indexOf(this.state.selectedPopulation) > -1
      ) {
        selectedPopulation = (
          <NetPyNEPopulation
            name={this.state.selectedPopulation}
            model={this.state.value[this.state.selectedPopulation]}
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
                  selection={this.state.selectedPopulation}
                  handleClick={() => this.setState({ selectedPopulation: undefined })}
                />
                <div style={{ opacity: 0 }}>H</div>
              </div>

              <div>
                <NetPyNEAddNew
                  id="newPopulationButton"
                  title="Create new population"
                  handleClick={this.handleNewPopulation}
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
                  Population
                </div>
              </div>
            </div>
            <Box p={1}>
              <RulePath text={this.getPath()} />
              <Box mb={1} />
              <Filter
                value={this.state.filterPopValue}
                label="Filter population by name..."
                handleFilterChange={(newValue) => this.setState({ filterPopValue: newValue })}
                options={model === undefined ? [] : Object.keys(model)}
              />
            </Box>
          </Accordion>
        </div>
        <Box className="scrollbar scrollchild" mt={1}>
          {populations}
        </Box>
        {selectedPopulation}
        {dialogPop}
      </GridLayout>
    );
  }
}
