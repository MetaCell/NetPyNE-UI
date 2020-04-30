import React from 'react';
import TimeRange from '../TimeRange'
import {
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
  NetPyNESelectField,
  ListComponent,
} from 'netpyne/components';

export default class PlotLFP extends React.Component {

  constructor (props) {
    super(props);
    this.state = { plots: '', };
  }
    
  render () {
    var tag = "simConfig.analysis['plotLFP']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotLFP.electrodes" className="listStyle" >
        <ListComponent model={tag + "['electrodes']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotLFP.plots">
        <NetPyNESelectField model={tag + "['plots']"} multiple={true}/>
      </NetPyNEField>
              
      <NetPyNEField id="simConfig.analysis.plotLFP.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.NFFT" >
        <NetPyNETextField model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.noverlap" >
        <NetPyNETextField model={tag + "['noverlap']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.maxFreq" >
        <NetPyNETextField model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.nperseg" >
        <NetPyNETextField model={tag + "['nperseg']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.smooth" >
        <NetPyNETextField model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.separation" >
        <NetPyNETextField model={tag + "['separation']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.includeAxon" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['includeAxon']"} />
      </NetPyNEField>
    </div>
  }
}
