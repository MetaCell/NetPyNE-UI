import React, { Component } from 'react';
import Checkbox from '../../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import Select from '../../../general/Select';
import TimeRange from '../TimeRange'
import NetPyNEInclude from '../NetPyNEInclude';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(Select);

export default class PlotSpikeHist extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
    
  render () {
    var tag = "simConfig.analysis['plotSpikeHist']"
    return <div >
      <NetPyNEInclude
        id={"simConfig.analysis.plotSpikeHist.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.binSize" >
        <PythonControlledTextField model={tag + "['binSize']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.graphType" className="listStyle" >
        <PythonControlledSelectField model={tag + "['graphType']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.yaxis" className="listStyle" >
        <PythonControlledSelectField model={tag + "['yaxis']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.overlay" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  }
}
