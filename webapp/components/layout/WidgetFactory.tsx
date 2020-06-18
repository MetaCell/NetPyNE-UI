import * as React from 'react'

import { NetPyNEInstantiated, HTMLViewer } from '..';

import {
  NetPyNESynapses,
  NetPyNEConnectivityRules,
  NetPyNECellRules,
  NetPyNEStimulationSources,
  NetPyNEStimulationTargets,
  NetPyNESimConfig,
  NetPyNEPopulations,
  NetPyNEPlots,
  NetPyNEPythonConsole
} from "../";
import { Widget } from './model';

export default class WidgetFactory{

  widgets: Map<string, Widget>;

  constructor () {
    this.widgets = new Map();
  }

  /**
   * Widget configuration is the same we are using in the flexlayout actions
   *
   * @param { id, name, component, panelName, [instancePath], * } widgetConfig 
   */
  factory (widgetConfig) {

    // With this lazy construction we avoidto trigger an update on every layout event.
    if (!this.widgets[widgetConfig.id]) {
      this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    }
    
    return this.widgets[widgetConfig.id];
  }
  
  updateWidget (widgetConfig) {
    this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    return this.widgets[widgetConfig.id];
  }
  
  newWidget (widgetConfig) {
    const component = widgetConfig.component;
    switch (component) {
    case "PythonConsole": {
      return <NetPyNEPythonConsole />;
    }
    case "D3Canvas":
      return <NetPyNEInstantiated/>
    case "Plot": {
      const data = window['plotSvgImages'][widgetConfig.id]
      if (widgetConfig.method.plotMethod.startsWith("iplot")) {
        return (
          <div style={{ width: '100%', height: '100%', textAlign: "center" }}>
            <iframe name='dipole' srcDoc={data}
              // onLoad={() => this.centerIframe('dipole')}
              style={{ border: 0, width: '100%', height: '100%' }}/>
          </div>
        )
      }
      return (
        <HTMLViewer 
          content={data}
          id={widgetConfig.id}
        />
      )
    }

    case "popParams":{
      return <NetPyNEPopulations model={"netParams.popParams"} />
    }
    case "cellParams":{
      return <NetPyNECellRules model={"netParams.cellParams"} />
    }
    case "synMechParams":{
      return <NetPyNESynapses model={"netParams.synMechParams"} />
    }
    case "connParams":{
      return <NetPyNEConnectivityRules model={"netParams.connParams"} />
    }
    case "stimSourceParams":{
      return <NetPyNEStimulationSources model={"netParams.stimSourceParams"} />
    }
    case "stimTargetParams":{
      return <NetPyNEStimulationTargets model={"netParams.stimTargetParams"} />
    }
    case "simConfig":{
      return <NetPyNESimConfig model={"simConfig"} />
    }
    case "analysis":{
      return <NetPyNEPlots model={"simConfig.analysis"} />
    }
    }
  }

} 