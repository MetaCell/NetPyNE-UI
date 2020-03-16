import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TimeRange from '../TimeRange'
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotGranger extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
  
  render () {
    var tags = "simConfig.analysis['granger']"
    var content = (
      <div>
        <NetPyNEField id="simConfig.analysis.granger.cells1" className="listStyle" >
          <PythonControlledListComponent model={tags + "['cells1']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.cells2" className="listStyle" >
          <PythonControlledListComponent model={tags + "['cells2']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.spks1" className="listStyle" >
          <PythonControlledListComponent model={tags + "['spks1']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.spks2" className="listStyle" >
          <PythonControlledListComponent model={tags + "['spks2']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.label1" >
          <PythonControlledTextField model={tags + "['label1']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.label2" >
          <PythonControlledTextField model={tags + "['label2']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.timeRange" >
          <TimeRange model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.binSize" >
          <PythonControlledTextField model={tags + "['binSize']"} />
        </NetPyNEField>
      </div>
    );
    
    return content;
  }
}
