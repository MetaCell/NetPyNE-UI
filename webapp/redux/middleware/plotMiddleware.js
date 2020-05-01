import { ADD_WIDGET, newWidget } from '../actions/layout';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';

import { processError } from './middleware'

export default store => next => action => {
  switch (action.type) {

  case ADD_WIDGET:
    if (action.data.id.includes("Plot")) {
      const { plotMethod, plotType } = action.data.method
      plotFigure(action.data.id, plotMethod, plotType, next, action)
    } else {
      next(action);
    }
    break;
  default: {
    next(action);
  }
  }
}


const plotFigure = (plotId, plotMethod, plotType = false, next, action) => {
  Utils.evalPythonMessage(NETPYNE_COMMANDS.plotFigure, [plotMethod, plotType], false)
    .then(response => {
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
      if ($.isArray(response)) {
        newPlotWidget(plotId, response[0], response, 0, response.length - 1, next, action);
      } else if (response == -1) {
        console.log("Nothing to show in plot " + action.data.name)
      } else {
        newPlotWidget(plotId, response, response, 0, 0, next, action);
      }
    });
}


const newPlotWidget = (plotId, svgResponse, data, i, total, next, action) => {
  if (svgResponse === '') {
    console.log("No plot to show")
    return
  }
  const pathName = `network.${plotId.replace(/ /g, '')}_${i}`
  if (!window.plotSvgImages) {
    window.plotSvgImages = { [plotId]: svgResponse }
  } else {
    window.plotSvgImages[plotId] = svgResponse
  }

  next(newWidget({
    path: plotId,
    name: action.data.name,
    component: 'Plot',
    panelName: 'plotPanel'
  }))

  if (i < total) {
    newPlotWidget(plotId, data[i++], data, i++, total, next, action)
  }
}