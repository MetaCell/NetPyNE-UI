import React, { Component } from 'react';
import TimeRange from '../TimeRange'

import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
  NetPyNESelectField
} from 'netpyne/components';

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
        <NetPyNETextField model={tag + "['binSize']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.graphType" className="listStyle" >
        <NetPyNESelectField model={tag + "['graphType']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.yaxis" className="listStyle" >
        <NetPyNESelectField model={tag + "['yaxis']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotSpikeHist.overlay" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  }
}
