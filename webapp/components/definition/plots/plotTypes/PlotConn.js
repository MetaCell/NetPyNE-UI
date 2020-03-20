import React, { Component } from 'react';

import {
  NetPyNEInclude,
  NetPyNEField,
  SelectField
} from 'netpyne/components';


export default class plotConn extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
  
  render () {
    var tag = "simConfig.analysis['plotConn']"
    return <div>
      <NetPyNEInclude
        id={"simConfig.analysis.plotConn.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
        
      <NetPyNEField id="simConfig.analysis.plotConn.feature" className="listStyle" >
        <SelectField model={tag + "['feature']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.groupBy" className="listStyle" >
        <SelectField model={tag + "['groupBy']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.orderBy" className="listStyle" >
        <SelectField model={tag + "['orderBy']"} />
      </NetPyNEField>
    </div>
  }
}
