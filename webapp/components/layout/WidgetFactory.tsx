import * as React from 'react';

import {
  HTMLViewer,
  NetPyNEInstantiated,
  NetPyNESynapses,
  NetPyNEConnectivityRules,
  NetPyNECellRules,
  NetPyNEStimulationSources,
  NetPyNEStimulationTargets,
  NetPyNESimConfig,
  NetPyNEPopulations,
  NetPyNEPlots,
  NetPyNEPythonConsole,
  ExperimentManager,
} from '..';

import { WidgetComponent } from './model';

export default class WidgetFactory {
  widgets = {};

  // FIXME didn't found a way to make standard refs work here, so using a custom callback
  refs: { [id: string]: WidgetComponent } = {};

  constructor () {
    this.widgets = {};
  }

  counter = 0

  /**
   * Widget configuration is the same we are using in the flexlayout actions
   *
   * @param { id, name, component, panelName, [instancePath], * } widgetConfig
   */
  factory (widgetConfig) {
    if (!this.widgets[widgetConfig.id]) {
      this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    }

    return this.widgets[widgetConfig.id];
  }

  getComponents (): { [id: string]: WidgetComponent } {
    const confs: { [id: string]: WidgetComponent } = {};
    for (const wid in this.refs) {
      const component = this.refs[wid];
      if (component.exportSession) {
        confs[wid] = component;
      }
    }
    return confs;
  }

  getComponent (widgetId: string) {
    return this.refs[widgetId];
  }

  updateWidget (widgetConfig) {
    this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    return this.widgets[widgetConfig.id];
  }

  newWidget (widgetConfig) {
    const { component } = widgetConfig;
    switch (component) {
      case 'PythonConsole': {
        return <NetPyNEPythonConsole />;
      }
      case 'D3Canvas':
        return <NetPyNEInstantiated />;
      case 'Plot': {
        const data = window['plotCache'][widgetConfig.id];
        if (widgetConfig.method.plotMethod.startsWith('iplot')) {
          return (
            <div style={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
            }}
            >
              <iframe
                name="dipole"
                srcDoc={data}
                // onLoad={() => this.centerIframe('dipole')}
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          );
        }
        return (
          <HTMLViewer
            content={data}
            id={widgetConfig.id}
          />
        );
      }

      case 'popParams': {
        return <NetPyNEPopulations model="netParams.popParams" />;
      }
      case 'cellParams': {
        return <NetPyNECellRules model="netParams.cellParams" />;
      }
      case 'synMechParams': {
        return <NetPyNESynapses model="netParams.synMechParams" />;
      }
      case 'connParams': {
        return <NetPyNEConnectivityRules model="netParams.connParams" />;
      }
      case 'stimSourceParams': {
        return <NetPyNEStimulationSources model="netParams.stimSourceParams" />;
      }
      case 'stimTargetParams': {
        return <NetPyNEStimulationTargets model="netParams.stimTargetParams" />;
      }
      case 'simConfig': {
        return <NetPyNESimConfig model="simConfig" />;
      }
      case 'analysis': {
        return <NetPyNEPlots model="simConfig.analysis" />;
      }
      case 'experimentManager': {
        return <ExperimentManager />;
      }
    }
  }
}
