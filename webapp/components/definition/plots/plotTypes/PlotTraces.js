import React, { Component } from 'react';
import TimeRange from '../TimeRange'

import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNESelectField,
} from 'netpyne/components';

export default class PlotTraces extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }
    
  render () {
    var tag = "simConfig.analysis['plotTraces']"
    return <div>
      <NetPyNEInclude
        id={"simConfig.analysis.plotTraces.include"}
        model={tag + "['include']"} 
        defaultOptions={['all', 'allCells', 'allNetStims']}
        initialValue={'all'}
      />
      
      <NetPyNEField id="simConfig.analysis.plotTraces.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.oneFigPer" className="listStyle" >
        <NetPyNESelectField model={tag + "['oneFigPer']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.overlay" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['overlay']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotTraces.rerun" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['rerun']"} />
      </NetPyNEField>
    </div>
  }
}
