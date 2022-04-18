import {
  NETPYNE_COMMANDS, NETWORK_PLOT_WIDGETS, PLOT_WIDGETS, WidgetStatus,
} from 'root/constants';
import { VIEW_EXPERIMENTS_RESULTS } from 'root/redux/actions/experiments';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import Utils from '../../Utils';
import { processError } from './middleware';
import {
  SIMULATE_NETWORK,
  CREATE_SIMULATE_NETWORK,
  SET_THEME,
  CREATE_NETWORK,
} from '../actions/general';
import { hideSpinner, showSpinner } from '@metacell/geppetto-meta-client/common/actions/actions';

// A simple cache for plots coming from the backend.
// This is a temporary solution until we have a proper strategy to store the plot data in redux
// and ensured that plot data doesn't lead to performance issues due to possible deep-copy in reducers.
window.plotCache = {};

const isDisabled = (widget, plots) => !plots[widget.config.method.plotKey] ?? true;

const setPlotToWindow = (plotId, data) => {
  if (data === '') {
    console.log('No plot to show');
    return;
  }
  window.plotCache[plotId] = data;
};

const plotFigure = async (plotId, plotMethod, plotType = false, uri = null, theme) => {
  try {
    let response = await Promise.race([
      Utils.evalPythonMessage(NETPYNE_COMMANDS.plotFigure, [plotMethod, plotType, theme], false),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(null);
        }, 30000);
      })]);

    console.log('Plot response received for', plotId);
    if (!response && !uri) { //png plots return null response but they provide a uri so they can be grabbed from the workspace
      return null;
    }

    // TODO Fix this, use just JSON
    if (typeof response === 'string') {
      if (response.startsWith('{') && response.endsWith('}')) {
        if (processError(response, plotId)) {
          console.error(processError(response, plotId));
          return null;
        }
      }
      if (response.startsWith('[') && response.endsWith(']')) {
        response = eval(response);
      }
    }
    if (plotMethod.startsWith('iplot')) {
      let htmlText = response.replace ? response.replace(/\\n/g, '')
        .replace(/\\/g, '') : '';
      if (plotId === 'rxdConcentrationPlot') {
        // FIXME: How can we center the bokeh plots when sizing_mode='scale_height'
        htmlText = htmlText.replace('<head>', '<head><style>.bk {margin: 0 auto!important;}</style>');
      }
      return htmlText;
    }
    if ((plotMethod == 'plotDipole' || plotMethod == 'plotEEG' )) { //uri is available here
      const plotUri = uri.replace('{name}', response);
      return (`<img src="${plotUri}"></img>`) ;
    }
    if (response?.length !== undefined) {
      return response[0];
    }
    if (response === -1) {
      return null;
    }
    return response;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const updatePlots = (next) => {
  Utils.evalPythonMessage(NETPYNE_COMMANDS.checkAvailablePlots, [])
    .then((plots) => {
      window.plotCache = {};
      Object.values(PLOT_WIDGETS)
        .forEach((widget) => {
          widget.initialized = false;
          widget.disabled = isDisabled(widget, plots);
          next(GeppettoActions.addWidget(widget));
        });
    });
};

export default (store) => (next) => (action) => {
  async function setWidget (widget) {
    const {
      method,
      uri,
    } = widget.config;
    showSpinner("Loading plot...");
    return plotFigure(widget.id, method.plotMethod, method.plotType, uri, store.getState().general.theme)
      .then((data) => {
        setPlotToWindow(widget.id, data);
        widget.initialized = true;
        hideSpinner();
        if (data) {
          console.debug('Plot retrieved:', widget.id);
          return widget;
        }
        console.warn('Plot not retrieved:', widget.id);
        return widget;
      });
  }

  switch (action.type) {
    case GeppettoActions.layoutActions.UPDATE_WIDGET: {
      // Triggered on tab of widget icon in sidebar
      // and refreshes widget data if widget wasn't initialized before.
      const widget = action.data;
      if (widget.id in PLOT_WIDGETS
        && widget.status === WidgetStatus.ACTIVE
        && !widget.initialized) {
        setWidget(widget)
          .then((w) => (w ? next(action) : null));
      }
      next(action);
      break;
    }
    case GeppettoActions.layoutActions.SET_WIDGETS: {
      // This is triggered once when we change the layout from Edit > Explore.
      // We add the widgets (back) to the sidebar but without fetching any data.
      Object.values(action.data)
        .filter((widget) => widget.id in PLOT_WIDGETS)
        .forEach((widget) => next(GeppettoActions.addWidget(widget)));
      next(action);
      break;
    }
    case CREATE_NETWORK: {
      Utils.evalPythonMessage(NETPYNE_COMMANDS.checkAvailablePlots, [])
        .then((plots) => {
          // Only reset network plots
          Object.values(NETWORK_PLOT_WIDGETS)
            .forEach((widget) => {
              delete window.plotCache[widget.id];
              widget.initialized = false;
              widget.disabled = isDisabled(widget, plots);
              next(GeppettoActions.addWidget(widget));
            });
        });

      next(action);
      break;
    }
    case VIEW_EXPERIMENTS_RESULTS:
    case SIMULATE_NETWORK:
    case CREATE_SIMULATE_NETWORK: {
      updatePlots(next);
      next(action);
      break;
    }
    case SET_THEME: {
      next(action);
      if (!store.getState().general.editMode) {
        for (const widget of Object.values(PLOT_WIDGETS)) {
          setWidget(widget)
            .then((w) => (w ? next(GeppettoActions.addWidget(w)) : null));
        }
      }
      break;
    }
    default: {
      next(action);
    }
  }
};
