import { WidgetStatus } from './components/layout/model';
import { MINIMIZED_PANEL } from './components/layout';

export { WidgetStatus };
export const TOP_PANEL = "hlsPanel";

export const THEMES = {
  DARK: 'gui',
  BLACK: 'contrast',
  LIGHT: 'light_minimal'
}

export const MODEL_STATE = {
  NOT_INSTANTIATED: 'NOT_INSTANTIATED',
  INSTANTIATED: 'INSTANTIATED',
  SIMULATED: 'SIMULATED'

}

export const NETPYNE_COMMANDS = {
  instantiateModel: 'netpyne_geppetto.instantiateNetPyNEModelInGeppetto',
  simulateModel: 'netpyne_geppetto.simulateNetPyNEModelInGeppetto',
  importModel: 'netpyne_geppetto.importModel',
  exportModel: 'netpyne_geppetto.exportModel',
  exportHLS: 'netpyne_geppetto.exportHLS',
  plotFigure: 'netpyne_geppetto.getPlot',
  deleteParam: 'netpyne_geppetto.deleteParam'
}

export const PYTHON_CONSOLE_WIDGET = {
  id: 'python',
  name: 'Python',
  status: WidgetStatus.MINIMIZED,
  component: 'PythonConsole',
  panelName: MINIMIZED_PANEL,
  defaultWeight: 30,
  defaultPosition: 'BOTTOM',
  defaultPanel: "consolePanel",
  enableClose: true,
  enableDrag: true,
  enableRename: false,
  hideOnClose: true,
  pos: 1000
}
/*
 * ------------------------------------------------------------------------------ //
 * ------------------------------------------------------------------------------ //
 */
export const TOPBAR_CONSTANTS = {
  LOAD: 'LOAD',
  SAVE: 'SAVE',
  IMPORT_HLS: 'IMPORT_HLS',
  EXPORT_HLS: 'EXPORT_HLS',
  IMPORT_CELL_TEMPLATE: 'IMPORT_CELL_TEMPLATE',
  NEW_MODEL: 'NEW_MODEL',
  UPLOAD_FILES: 'UPLOAD_FILES',
  DOWNLOAD_FILES: 'DOWNLOAD_FILES',
  CREATE_NETWORK: 'Create network',
  CREATE_AND_SIMULATE_NETWORK: 'Create and simulate network',
  SIMULATE: 'Simulate network',
  EXPLORE_EXISTING_NETWORK: 'Explore model',
  BACK_TO_EDITION: 'Back to edit',
  NEW_PAGE: 'NEW_PAGE'

}

/*
 * ------------------------------------------------------------------------------ //
 * ------------------------------------------------------------------------------ //
 */
export const PLOT_WIDGETS = {
  connectionPlot: {
    id: 'connectionPlot',
    name: 'Connections Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotConn',
      plotType: false
    },
    pos: 1
  },
  d2NetPlot: {
    id: 'd2NetPlot',
    name: '2D Net Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplot2Dnet',
      plotType: false
    },
    pos: 2
  },
  tracesPlot: {
    id: 'tracesPlot',
    name: 'Cell traces',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    method: {
      plotMethod: 'iplotTraces',
      plotType: false
    },
    pos: 3
  },
  rasterPlot: {
    id: 'rasterPlot',
    name: 'Raster plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotRaster',
      plotType: false
    },
    pos: 4
  },
  spikePlot: {
    id: 'spikePlot',
    name: 'Spike Hist Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotSpikeHist',
      plotType: false
    },
    pos: 5
  },
  spikeStatsPlot: {
    id: 'spikeStatsPlot',
    name: 'Spike Stats Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    method: {
      plotMethod: 'iplotSpikeStats',
      plotType: false
    },
    pos: 6
  },
  ratePSDPlot: {
    id: 'ratePSDPlot',
    name: 'Rate PSD Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotRatePSD',
      plotType: false
    },
    pos: 7
  },
  LFPTimeSeriesPlot: {
    id: 'LFPTimeSeriesPlot',
    name: 'LFP Time Series Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotLFP',
      plotType: 'timeSeries'
    },
    pos: 8
  },
  LFPPSDPlot: {
    id: 'LFPPSDPlot',
    name: 'LFP PSD Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    method: {
      plotMethod: 'iplotLFP',
      plotType: 'PSD'
    },
    pos: 9
  },
  LFPSpectrogramPlot: {
    id: 'LFPSpectrogramPlot',
    name: 'LFP Spectrogram Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    method: {
      plotMethod: 'iplotLFP',
      plotType: 'spectrogram'
    },
    pos: 10
  },
  grangerPlot: {
    id: 'grangerPlot',
    name: 'Granger Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    hideOnClose: true,
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    initialized: false,
    method: {
      plotMethod: 'granger',
      plotType: false
    },
    pos: 11
  },
  rxdConcentrationPlot: {
    id: 'rxdConcentrationPlot',
    name: 'RxD concentration plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    method: {
      plotMethod: 'iplotRxDConcentration',
      plotType: false
    },
    pos: 12
  }
}

export const DEFAULT_NETWORK_WIDGETS = {
  PYTHON_CONSOLE_WIDGET,
  D3Canvas: {
    id: 'D3Canvas',
    name: '3D Representation',
    status: WidgetStatus.ACTIVE,
    component: 'D3Canvas',
    panelName: "morphoPanel",
    enableRename: false,
    hideOnClose: true,
    pos: 0
  },
  ...PLOT_WIDGETS,
  [PYTHON_CONSOLE_WIDGET.id]: PYTHON_CONSOLE_WIDGET
}

export const EDIT_WIDGETS = {
  [PYTHON_CONSOLE_WIDGET.id]: PYTHON_CONSOLE_WIDGET,
  'cellParams': {
    id: 'cellParams',
    name: 'Cell Types',
    status: WidgetStatus.ACTIVE,
    component: 'cellParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 0
  },
  'popParams': {
    id: 'popParams',
    name: 'Populations',
    status: WidgetStatus.HIDDEN,
    component: 'popParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 1
  },
  'synMechParams': {
    id: 'synMechParams',
    name: 'Synaptic Mechanisms',
    status: WidgetStatus.HIDDEN,
    component: 'synMechParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 2
  },
  'connParams': {
    id: 'connParams',
    name: 'Connectivity Rules',
    status: WidgetStatus.HIDDEN,
    component: 'connParams',
    panelName: TOP_PANEL,
    hideOnClose: true,
    enableRename: false,
    pos: 3
  },
  'stimSourceParams': {
    id: 'stimSourceParams',
    name: 'Stim. sources',
    status: WidgetStatus.HIDDEN,
    component: 'stimSourceParams',
    hideOnClose: true,
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 4
  },
  'stimTargetParams': {
    id: 'stimTargetParams',
    name: 'Stim. targets',
    status: WidgetStatus.HIDDEN,
    component: 'stimTargetParams',
    hideOnClose: true,
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 5
  },
  'simConfig': {
    id: 'simConfig',
    name: 'Configuration',
    status: WidgetStatus.HIDDEN,
    hideOnClose: true,
    component: 'simConfig',
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 6
  },
  'analysis': {
    id: 'analysis',
    name: 'Plot Settings',
    status: WidgetStatus.HIDDEN,
    hideOnClose: true,
    component: 'analysis',
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 7
  }
}