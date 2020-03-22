import React, { Component } from 'react';

import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNESelectField
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
        <NetPyNESelectField model={tag + "['feature']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.groupBy" className="listStyle" >
        <NetPyNESelectField model={tag + "['groupBy']"} />
      </NetPyNEField>
        
      <NetPyNEField id="simConfig.analysis.plotConn.orderBy" className="listStyle" >
        <NetPyNESelectField model={tag + "['orderBy']"} />
      </NetPyNEField>
    </div>
  }
}
