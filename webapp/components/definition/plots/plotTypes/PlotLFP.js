import React from 'react';
import TimeRange from '../TimeRange'
import {
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
  SelectField,
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
        <SelectField model={tag + "['plots']"} multiple={true}/>
      </NetPyNEField>
              
      <NetPyNEField id="simConfig.analysis.plotLFP.timeRange" >
        <TimeRange model={tag + "['timeRange']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.NFFT" >
        <NetPyNETextField variant="filled" model={tag + "['NFFT']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.noverlap" >
        <NetPyNETextField variant="filled" model={tag + "['noverlap']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.maxFreq" >
        <NetPyNETextField variant="filled" model={tag + "['maxFreq']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.nperseg" >
        <NetPyNETextField variant="filled" model={tag + "['nperseg']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.smooth" >
        <NetPyNETextField variant="filled" model={tag + "['smooth']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.separation" >
        <NetPyNETextField variant="filled" model={tag + "['separation']"}/>
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotLFP.includeAxon" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['includeAxon']"} />
      </NetPyNEField>
    </div>
  }
}
