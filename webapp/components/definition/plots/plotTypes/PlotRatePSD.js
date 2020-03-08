import React, { Component } from 'react';
import Checkbox from '../../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import TimeRange from '../TimeRange'
import NetPyNEInclude from '../NetPyNEInclude';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

export default class PlotRatePSD extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
  
  render () {
    var tag = "simConfig.analysis['plotRatePSD']"
    return <div>
      <NetPyNEInclude
        id={"simConfig.analysis.plotRatePSD.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.binSize" >
        <PythonControlledTextField model={tag + "['binSize']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq" >
        <PythonControlledTextField model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT" >
        <PythonControlledTextField model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap" >
        <PythonControlledTextField model={tag + "['noverlap']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth" >
        <PythonControlledTextField model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.overlay" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  }
}
