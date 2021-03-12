import { addWidget, SET_WIDGETS, UPDATE_WIDGET } from '../actions/layout';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS, PLOT_WIDGETS, WidgetStatus } from 'root/constants';
import { processError } from './middleware';
import { SIMULATE_NETWORK, CREATE_SIMULATE_NETWORK, SET_THEME } from '../actions/general';

// A simple cache for plots coming from the backend.
// This is a temporary solution until we have a proper strategy to store the plot data in redux
// and ensured that plot data doesn't lead to performance issues due to possible deep-copy in reducers.
window.plotCache = {};

export default store => next => action => {

  async function setWidget (widget) {

    const {
      plotMethod,
      plotType
    } = widget.method;
    return plotFigure(widget.id, plotMethod, plotType, store.getState().general.theme)
      .then(data => {
        setPlotToWindow(widget.id, data);
        widget.initialized = true;
        if (data) {
          console.debug('Plot retrieved:', widget.id);
          widget.disabled = false;
          return widget;
        } else {
          console.warn('Plot not retrieved:', widget.id);
          widget.disabled = true;
          return widget;
        }
      });
  }

  switch (action.type) {
    case UPDATE_WIDGET: {
      const widget = action.data;
      if (widget.id in PLOT_WIDGETS
        && widget.status === WidgetStatus.ACTIVE
        && !widget.initialized) {
        setWidget(widget)
          .then(widget => widget ? next(action) : null);
      }
      next(action);
      break;
    }
    case SET_WIDGETS: {
      for (let widget of Object.values(action.data)) {
        if (widget.id in PLOT_WIDGETS) {
          setWidget(widget)
            .then(widget => widget ? next(addWidget(widget)) : null);
        }
      }
      next(action);
      break;
    }
    case SIMULATE_NETWORK:
    case CREATE_SIMULATE_NETWORK: {
      window.plotCache = {};
      for (let widget of Object.values(PLOT_WIDGETS)) {
        widget.initialized = false;
        next(addWidget(widget));
      }

      next(action);
      break;
    }
    case SET_THEME: {
      next(action);
      if (!store.getState().general.editMode) {
        for (let widget of Object.values(PLOT_WIDGETS)) {
          setWidget(widget)
            .then(widget => widget ? next(addWidget(widget)) : null);
        }
      }
      break;
    }
    default: {
      next(action);
    }
  }
}

const plotFigure = async (plotId, plotMethod, plotType = false, theme) => {
  try {
    let response = await Promise.race([
      Utils.evalPythonMessage(NETPYNE_COMMANDS.plotFigure, [plotMethod, plotType, theme], false),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(null);
        }, 30000);
      })]);

    console.log('Plot response received for', plotId);
    if (!response) {
      return null;
    }

    // TODO Fix this, use just JSON
    if (typeof response === 'string') {
      if (response.startsWith('{') && response.endsWith('}')) {
        if (processError(response, plotId)) {
          console.error(processError(response, plotId));
          return;
        }
      }
      if (response.startsWith('[') && response.endsWith(']')) {
        response = eval(response);
      }
    }
    if (plotMethod.startsWith('iplot')) {
      let html_text = response.replace ? response.replace(/\\n/g, '')
        .replace(/\\/g, '') : '';
      if (plotId === 'rxdConcentrationPlot') {
        // FIXME: How can we center the bokeh plots when sizing_mode='scale_height'
        html_text = html_text.replace('<head>', '<head><style>.bk {margin: 0 auto!important;}</style>');
      }
      return html_text;
    } else if (response?.length !== undefined) {
      return response[0];
    } else if (response === -1) {
      return null;
    } else {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

const setPlotToWindow = (plotId, data) => {
  if (data === '') {
    console.log('No plot to show');
    return;
  }
  window.plotCache[plotId] = data;
};
