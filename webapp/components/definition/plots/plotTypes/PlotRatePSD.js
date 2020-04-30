import React, { Component } from 'react';

import TimeRange from '../TimeRange'
import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField
} from 'netpyne/components';

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
        <NetPyNETextField model={tag + "['binSize']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq" >
        <NetPyNETextField model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT" >
        <NetPyNETextField model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap" >
        <NetPyNETextField model={tag + "['noverlap']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth" >
        <NetPyNETextField model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.overlay" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  }
}
