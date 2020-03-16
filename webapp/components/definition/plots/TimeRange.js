import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import AdapterComponent from '../../general/AdapterComponent';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledAdapterComponent = PythonControlledCapability.createPythonControlledControl(AdapterComponent);
 
export default class TimeRange extends Component {
 
  constructor (props) {
    super(props);
  }
 
  render () {
    return (
      <div className={"netpyneRightField"}>
        <PythonControlledAdapterComponent 
          model={this.props.model}
          convertToPython={state => {
            if (state[state.lastUpdated].toString().endsWith(".")) {
              return undefined;
            }
            if (!isNaN(parseFloat(state.min)) && !isNaN(parseFloat(state.max))) {
              return [parseFloat(state.min), parseFloat(state.max)];
            }
          }}
          convertFromPython={(prevProps, prevState, value) => {
            if (value != undefined && prevProps.value != value && value != '') {
              return { min: value[0], max: value[1] };
            }
          }}
        >
          <TextField label="Starting time" id="min" style={{ marginLeft: 10 }}/>
          <TextField label="Ending time" id="max" style={{ marginLeft: 10 }}/>
        </PythonControlledAdapterComponent>
      </div>
    );
  }
}
