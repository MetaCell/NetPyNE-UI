import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../../Utils';

import NetPyNEField from '../../general/NetPyNEField';
var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');

var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

/**
 * Population Dimensions Component
 */
export default class DimensionsComponent extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modelName: props.modelName,
      dimension: 'numCells'
    };
    this.popDimensionsOptions = [{ label: 'Number of cells', value: 'numCells' }, { label: 'Density', value: 'density' }, { label: 'Grid spacing', value: 'gridSpacing' }];

  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.modelName != prevState.modelName) {
      this.updateLayout();
    }
  }


  componentDidMount () {
    this.updateLayout();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.modelName != nextProps.modelName) {
      this.setState({ modelName: nextProps.modelName, dimension: 'numCells' });
    }
  }

  updateLayout () {
    let requests = this.popDimensionsOptions.map(popDimensionsOption => 
    // FIXME Better to wrap calls rather than directly accessing objects
      Utils
        .evalPythonMessage("'" + popDimensionsOption.value + "' in netpyne_geppetto.netParams.popParams['" + this.state.modelName + "']")

    );

    // Get population dimension by asking each for each key
    Promise.all(requests).then(values => {
      var index = values.indexOf(true);
      if (index == -1) {
        this.setState({ dimension: 'numCells' });
      } else {
        this.setState({ dimension: this.popDimensionsOptions[index].value });
      }
    });
  }

  handleDimValueChange (event) {
    var newValue = (event.target.type == 'number') ? parseFloat(event.target.value) : event.target.value;
    // Update State
    if (Object.is(newValue, NaN)) {
      newValue = 0
    }
    this.setState({ value: newValue });
    this.triggerUpdate(() => {
      // Set Population Dimension Python Side
      Utils
        .evalPythonMessage('netpyne_geppetto.netParams.popParams.setParam', [this.props.modelName, this.props.dimensionType, newValue])
        .then(function (response) {
          GEPPETTO.trigger("population_update_dimension")
        });
    });
  }

  render () {

    return (
      <div>
        <NetPyNEField id="netParams.popParams.numCells" className={"netpyneFieldNoWidth"} noStyle>
          <Select
            id={"popParamsDimensionsSelect"}
            value={this.state.dimension}
            onChange={event => this.setState({ dimension: event.target.value })}
          >
            {(this.popDimensionsOptions != undefined)
              ? this.popDimensionsOptions.map(popDimensionsOption => (
                <MenuItem 
                  id={"popParamS" + popDimensionsOption.value} 
                  key={popDimensionsOption.value}
                  value={popDimensionsOption.value}
                >
                  {popDimensionsOption.label}
                </MenuItem>
              )) : null}
          </Select>
        </NetPyNEField>
        {
          this.state.dimension != undefined && this.state.dimension != ""
            ? <NetPyNEField id={"netParams.popParams." + this.state.dimension} className={"netpyneRightField"} noStyle>
              <PythonControlledTextField
                id={"popParamsDimensions"}
                handleChange={this.handleDimValueChange}
                model={"netParams.popParams['" + this.state.modelName + "']['" + this.state.dimension + "']"}
                modelName={this.state.modelName}
                dimensionType={this.state.dimension}
              />
            </NetPyNEField>
            : null
        }
      </div>
    )
  }
}
