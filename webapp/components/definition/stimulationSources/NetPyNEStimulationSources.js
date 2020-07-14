import React, { Component } from 'react';


import Utils from '../../../Utils';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

import {
  NetPyNEHome,
  NetPyNEAddNew,
  NetPyNEThumbnail,
  NetPyNEStimulationSource,
  GridLayout,
  Filter
} from 'netpyne/components';

import RulePath from '../../general/RulePath'
import Accordion from '../../general/ExpansionPanel'
import Divider from '@material-ui/core/Divider';

export default class NetPyNEStimulationSources extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedStimulationSource: undefined,
      deletedStimulationSource: undefined,
      page: "main",
      errorMessage: undefined,
      errorDetails: undefined,
      filterValue: null
    };
    this.selectStimulationSource = this.selectStimulationSource.bind(this);
    this.handleNewStimulationSource = this.handleNewStimulationSource.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
  }

  /* Method that handles button click */
  selectStimulationSource (StimulationSource) {
    this.setState({ selectedStimulationSource: StimulationSource });
  }

  handleNewStimulationSource () {
    var defaultStimulationSources = { 'stim_source': { 'type': 'IClamp' } };
    var key = Object.keys(defaultStimulationSources)[0];
    var value = defaultStimulationSources[key];
    var model = { ...this.state.value };
    var StimulationSourceId = Utils.getAvailableKey(model, key);
    var newStimulationSource = Object.assign({ name: StimulationSourceId }, value);
    Utils.execPythonMessage('netpyne_geppetto.netParams.stimSourceParams["' + StimulationSourceId + '"] = ' + JSON.stringify(value));
    model[StimulationSourceId] = newStimulationSource;
    this.setState({
      value: model,
      selectedStimulationSource: StimulationSourceId
    }, () => this.props.updateCards());
  }

  hasSelectedStimulationSourceBeenRenamed (prevState, currentState) {
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
    var newStimulationSourceName = this.hasSelectedStimulationSourceBeenRenamed(prevState, this.state);
    if (newStimulationSourceName !== undefined) {
      this.setState({ selectedStimulationSource: newStimulationSourceName, deletedStimulationSource: undefined });
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
            () => Utils.renameKey('netParams.stimSourceParams', m, newValue, (response, newValue) => this.props.updateCards()));
          }
        }
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed = this.hasSelectedStimulationSourceBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedStimulationSource != nextState.selectedStimulationSource;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails);
    const filterValueChanged = nextState.filterValue !== this.state.filterValue
    return filterValueChanged || newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
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
    const filterName = this.state.filterValue === null ? '' : this.state.filterValue
    var StimulationSources = Object.keys(model || [])
      .filter(stimSource => stimSource.toLowerCase().includes(filterName.toLowerCase()))
      .map(stimSource => (
        <NetPyNEThumbnail 
          name={stimSource} 
          key={stimSource} 
          selected={stimSource == this.state.selectedStimulationSource} 
          paramPath="stimSourceParams"
          handleClick={this.selectStimulationSource} />
      ));
    
    
    var selectedStimulationSource = undefined;
    if ((this.state.selectedStimulationSource !== undefined) && Object.keys(model).indexOf(this.state.selectedStimulationSource) > -1) {
      selectedStimulationSource = <NetPyNEStimulationSource name={this.state.selectedStimulationSource} renameHandler={this.handleRenameChildren} />;
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
              <div >
                <NetPyNEAddNew 
                  id={"newStimulationSourceButton"} 
                  title="Create new stimulation source"
                  handleClick={this.handleNewStimulationSource}
                />
                <div style={{ 
                  textAlign: 'center', 
                  fontFamily: 'Source Sans Pro', 
                  maxWidth: 40, 
                  overflow: 'visible',
                  display: 'flex', 
                  justifyContent: 'center' 
                }}>Source</div>
              </div>
            </div>
            <Divider />
            <RulePath text={`netParams.stimSourceParams["${this.state.selectedStimulationSource}"]`}/>
            <Divider />
            <Filter
              value={this.state.filterValue}
              label="Filter stimulation source rule by name..."
              handleFilterChange={newValue => this.setState({ filterValue: newValue })}
              options={model === undefined ? [] : Object.keys(model)}
            />
          </Accordion>
          
          
        </div>
        
        {StimulationSources}
        {selectedStimulationSource}
        {dialogPop}
      </GridLayout>
    );
  }
}