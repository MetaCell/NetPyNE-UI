import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '../../../general/Select';
import TimeRange from '../TimeRange'
import NetPyNEIncludeConnection from '../../../../redux/reduxconnect/NetPyNEIncludeConnection';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(Select);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotSpikeStats extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
    
  render () {
    var tag = "simConfig.analysis['plotSpikeStats']"
    return <div>
      <NetPyNEIncludeConnection
        id={"simConfig.analysis.plotSpikeStats.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.popColors" className="listStyle">
        <PythonControlledListComponent model={tag + "['popColors']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.graphType" className="listStyle" >
        <PythonControlledSelectField model={tag + "['graphType']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeStats.stats" className="listStyle" >
        <PythonControlledSelectField model={tag + "['stats']"} />
      </NetPyNEField>
    </div>
  }
}
