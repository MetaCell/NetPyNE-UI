import React, { Component } from 'react';
import Select from '../../../general/Select';
import NetPyNEIncludeConnection from '../../../../redux/reduxconnect/NetPyNEIncludeConnection';
import NetPyNEField from '../../../general/NetPyNEField';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledControl(Select);

export default class plotConn extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
  
  render () {
    var tag = "simConfig.analysis['plotConn']"
    return <div>
      <NetPyNEIncludeConnection
        id={"simConfig.analysis.plotConn.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
        
      <NetPyNEField id="simConfig.analysis.plotConn.feature" className="listStyle" >
        <PythonControlledSelectField model={tag + "['feature']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.groupBy" className="listStyle" >
        <PythonControlledSelectField model={tag + "['groupBy']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.orderBy" className="listStyle" >
        <PythonControlledSelectField model={tag + "['orderBy']"} />
      </NetPyNEField>
    </div>
  }
}
