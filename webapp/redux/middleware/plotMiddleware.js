import { ADD_WIDGET, addWidget, SET_WIDGETS } from '../actions/layout';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS, PLOT_WIDGETS } from '../../constants';

import { processError } from './middleware';
import { SIMULATE_NETWORK, CREATE_SIMULATE_NETWORK } from '../actions/general';

// Cache for plots coming from the backend
window.plotSvgImages = {};

async function setWidget (widget) {
  
  const { plotMethod, plotType } = widget.method;
  const result = await plotFigure(widget.id, plotMethod, plotType);

  if (!result) {
    console.warn('Plot not retrieved:', widget.id);
    widget.disabled = true;
    return widget;
    // return null;

  } else {
    console.log('Plot retrieved:', widget.id);
    widget.disabled = false;
    return widget;
  }
  
}

export default store => next => action => {
  switch (action.type) {

  case SET_WIDGETS: {
    for (let widget of Object.values(action.data)) {
      if ((widget.id in PLOT_WIDGETS) && widget.method) {
        setWidget(widget).then(widget => widget ? next(addWidget(widget)) : null);
      }
    }
    next(action);
    break;
  }
  case SIMULATE_NETWORK:
  case CREATE_SIMULATE_NETWORK: {
    for (let widget of Object.values(PLOT_WIDGETS)) {
      setWidget(widget).then(widget => widget ? next(addWidget(widget)) : null);
    }
    next(action);
    break
  }
  default: {
    next(action);
  }
  }
}


const plotFigure = async (plotId, plotMethod, plotType = false) => {
  try {
    let response = await Promise.race([
      Utils.evalPythonMessage(NETPYNE_COMMANDS.plotFigure, [plotMethod, plotType], false),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(null)
        }, 30000)
      })]);
    console.log('Plot response received for', plotId);
    if (!response) {
      return null;
    }
    // TODO Fix this, use just JSON
    if (typeof response === 'string'){
      if (response.startsWith("{") && response.endsWith("}")) {
        if (processError(response, plotId)){
          console.error(processError(response, plotId))
          return;
        }
      }
      if (response.startsWith("[") && response.endsWith("]")) {
        response = eval(response);
      }
    }
    if (plotMethod.startsWith("iplot")) {
      let html_text = response.replace ? response.replace(/\\n/g, '').replace(/\\/g, '') : ''

      setPlotToWindow(plotId, html_text)
    } else if (response?.length !== undefined) {
      setPlotToWindow(plotId, response[0]);
    } else if (response == -1) {
      return null;
    } else {
      setPlotToWindow(plotId, response);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
  

}

const setPlotToWindow = (plotId, svgResponse) => {
  if (svgResponse === '') {
    console.log("No plot to show")
    return
  }
  window.plotSvgImages[plotId] = svgResponse
}
