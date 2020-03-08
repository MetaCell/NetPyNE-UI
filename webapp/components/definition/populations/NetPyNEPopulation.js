import React from 'react';
import TextField from '@material-ui/core/TextField';
import { CardContent } from '@material-ui/core';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FontIcon from '@material-ui/core/Icon';
import Utils from '../../../Utils';
import NetPyNEField from '../../general/NetPyNEField';
import DimensionsComponent from './Dimensions';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';


var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);


export default class NetPyNEPopulation extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name, selectedIndex: 0, sectionId: "General" });
  }

  setPopulationDimension = value => {
    // this.setState({ cellModel: value });
    this.triggerUpdate(() => {
      // Set Population Dimension Python Side
      Utils
        .evalPythonMessage('api.getParametersForCellModel', [value])
        .then(response => {

          var cellModelFields = "";
          if (Object.keys(response).length != 0) {
            // Merge the new metadata with the current one
            window.metadata = Utils.mergeDeep(window.metadata, response);
            // console.log("New Metadata", window.metadata);
            cellModelFields = [];
            // Get Fields for new metadata
            cellModelFields = Utils.getFieldsFromMetadataTree(response, key => (<NetPyNEField id={key} >
              <PythonControlledTextField
                model={"netParams.popParams['" + this.state.currentName + "']['" + key.split(".").pop() + "']"}
              />
            </NetPyNEField>));
          }
          this.setState({ cellModelFields: cellModelFields, cellModel: value });
        });
    });

  }

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })

    var modelParameters = [];
    modelParameters.push(<BottomNavigationAction id={'generalPopTab'} key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationAction id={'spatialDistPopTab'} key={'SpatialDistribution'} label={'Spatial Distribution'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'SpatialDistribution')} />);
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      modelParameters.push(<BottomNavigationAction key={this.state.cellModel} label={this.state.cellModel + " Model"} icon={<FontIcon className={"fa fa-balance-scale"} />} onClick={() => select(2, this.state.cellModel)} />);
    }
    modelParameters.push(<BottomNavigationAction key={'CellList'} label={'Cell List'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => select(3, 'CellList')} />);

    return modelParameters;
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.model == undefined
      || this.state.currentName != nextState.currentName
      || this.state.cellModelFields != nextState.cellModelFields
      || this.state.sectionId != nextState.sectionId
      || this.state.selectedIndex != nextState.selectedIndex;
  }

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "Population");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.popParams', storedValue, newValue, (response, newValue) => { 
          this.renaming = false
          GEPPETTO.trigger('populations_change');
        });
        this.renaming = true;
      });
    }
  }

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
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
    if (this.state.sectionId == "General") {
      var content
        = <div id="populationMetadata">
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            label="The name of your population"
            className={"netpyneField"}
            id={"populationName"}
          />

          <NetPyNEField id="netParams.popParams.cellType" >
            <PythonControlledTextField
              callback={(newValue, oldValue) => {
                Utils.evalPythonMessage("netpyne_geppetto.propagate_field_rename", ['cellType', newValue, oldValue])
                GEPPETTO.trigger('cellType_change')
              }}
              model={"netParams.popParams['" + this.props.name + "']['cellType']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.popParams.cellModel" >
            <PythonControlledTextField
              callback={(newValue, oldValue) => {
                Utils.evalPythonMessage("netpyne_geppetto.propagate_field_rename", ['cellModel', newValue, oldValue])
                GEPPETTO.trigger('cellModel_change')
              }}
              model={"netParams.popParams['" + this.props.name + "']['cellModel']"}
            />
          </NetPyNEField>

          <DimensionsComponent modelName={this.props.name} />
          {dialogPop}
        </div>
    } else if (this.state.sectionId == "SpatialDistribution") {
      var content 
        = <div>
          <NetPyNECoordsRange
            id={"xRangePopParams"}
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'xRange', label:'Absolute' }, 
              { value: 'xnormRange', label:'Normalized' }
            ]}
          />

          <NetPyNECoordsRange 
            id="yRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'yRange', label:'Absolute' }, 
              { value: 'ynormRange', label:'Normalized' }
            ]}
          />

          <NetPyNECoordsRange 
            id="zRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'zRange', label:'Absolute' }, 
              { value: 'znormRange', label:'Normalized' }
            ]}
          />
        </div>
    } else if (this.state.sectionId == "CellList") {
      var content = <div>Option to provide individual list of cells. Coming soon ...</div>
    } else {
      var content = <div>{this.state.cellModelFields}</div>;
    }

    return (
      <div>
        <CardContent>
          <BottomNavigation value={this.state.selectedIndex}>
            {this.getModelParameters()}
          </BottomNavigation>
        </CardContent>
        <br />
        {content}
      </div>
    );
  }
}
