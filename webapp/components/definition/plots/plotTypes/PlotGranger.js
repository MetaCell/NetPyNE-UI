import React, { Component } from 'react';
import TimeRange from '../TimeRange'

import {
  NetPyNEField,
  NetPyNETextField,
  ListComponent
} from 'netpyne/components';

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
          <ListComponent model={tags + "['cells1']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.cells2" className="listStyle" >
          <ListComponent model={tags + "['cells2']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.spks1" className="listStyle" >
          <ListComponent model={tags + "['spks1']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.spks2" className="listStyle" >
          <ListComponent model={tags + "['spks2']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.label1" >
          <NetPyNETextField variant="filled" model={tags + "['label1']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.label2" >
          <NetPyNETextField variant="filled" model={tags + "['label2']"}/>
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.timeRange" >
          <TimeRange model={tags + "['timeRange']"} />
        </NetPyNEField>
        
        <NetPyNEField id="simConfig.analysis.granger.binSize" >
          <NetPyNETextField variant="filled" model={tags + "['binSize']"} />
        </NetPyNEField>
      </div>
    );
    
    return content;
  }
}
