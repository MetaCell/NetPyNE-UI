import React, { Component } from 'react';
import Checkbox from '../../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import Select from '../../../general/Select';
import ListComponent from '../../../general/List'; 
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledCheckbox = PythonControlledCapability.createPythonControlledControl(Checkbox);
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(Select);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class PlotShape extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    var tag = "simConfig.analysis['plotShape']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotShape.includePre" className="listStyle" >
        <PythonControlledListComponent model={tag + "['includePre']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.includePost" className="listStyle" >
        <PythonControlledListComponent model={tag + "['includePost']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.synStyle" >
        <PythonControlledTextField model={tag + "['synStyle']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.dist" >
        <PythonControlledTextField model={tag + "['dist']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.synSize" >
        <PythonControlledTextField model={tag + "['synSize']"} />
      </NetPyNEField>

      <NetPyNEField id={"simConfig.analysis.plotShape.cvar"} >
        <PythonControlledSelectField model={tag + "['cvar']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.cvals" className="listStyle" >
        <PythonControlledListComponent model={tag + "['cvals']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.bkgColor" className="listStyle" >
        <PythonControlledListComponent model={tag + "['bkgColor']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.ivprops" >
        <PythonControlledTextField model={tag + "['ivprops']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.iv" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['iv']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.includeAxon" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['includeAxon']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.showSyns" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['showSyncs']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.showElectrodes" className={"netpyneCheckbox"} >
        <PythonControlledCheckbox model={tag + "['showElectrodes']"} />
      </NetPyNEField>
    </div>
  }
}
