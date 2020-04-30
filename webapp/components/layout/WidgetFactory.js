import React, { lazy, Suspense } from 'react';

import PythonConsole from '@geppettoengine/geppetto-client/js/components/interface/pythonConsole/PythonConsole';

import { NetPyNEInstantiated, HTMLViewer } from 'netpyne/components';

export default class WidgetFactory{

  constructor () {
    this.widgets = {};
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
      return <PythonConsole pythonNotebookPath={"notebooks/notebook.ipynb"} />;
    }
    case "D3Canvas":
      return <NetPyNEInstantiated/>
    case "Plot": {
      const data = window.plotSvgImages[widgetConfig.id]
      return (
        <HTMLViewer 
          content={data}
          id={widgetConfig.id}
        />
      )
    }
    }
  }

} 