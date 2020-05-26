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
        <NetPyNETextField variant="filled" model={tag + "['binSize']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq" >
        <NetPyNETextField variant="filled" model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT" >
        <NetPyNETextField variant="filled" model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap" >
        <NetPyNETextField variant="filled" model={tag + "['noverlap']"}/>
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth" >
        <NetPyNETextField variant="filled" model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotRatePSD.overlay" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['overlay']"} />
      </NetPyNEField>
    </div>
  }
}
