export const MODULE_NOT_FOUND_ERROR = 'ModuleNotFoundError';
export const NAME_ERROR = "NameError";
export const FILEVARIABLE_LENGTH = 'network.'.length;
import { WidgetStatus } from './components/layout/model';
import { MINIMIZED_PANEL } from './components/layout';
export { WidgetStatus };
export const TOP_PANEL = "hlsPanel";

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
  CREATE_NETWORK: 'Create Network',
  CREATE_AND_SIMULATE_NETWORK:'Create and Simulate Network',
  EXPLORE_EXISTING_NETWORK:'Explore Existing Network',
  BACK_TO_EDITION: 'Back to edit'

}

/*
 * ------------------------------------------------------------------------------ //
 * ------------------------------------------------------------------------------ //
 */

export const WIDGETS_IDS = {
  EDIT_MODE: {
    POP_PARAMS: 'popParams',
    CELL_PARAMS: 'cellParams',
    SYN_MECH_PARAMS: 'synMechParams',
    CONN_PARAMS: 'connParams',
    STIM_SOURCE_PARAMS: 'stimSourceParams',
    STIM_TARGET_PARAMS: 'stimTargetParams',
    SIM_CONFIG: 'simConfig',
    ANALYSIS: "analysis",
    
  },
  EXPLORE_MODE: {
    MORPHOLOGY: 'D3Canvas',
    CONNECTION_PLOT: 'connectionPlot',
    D2_NET_PLOT: 'd2NetPlot',
    SHAPE_PLOT: 'shapePlot',
    TRACES_PLOT: 'tracesPlot',
    RASTER_PLOT: 'rasterPlot',
    SPIKE_PLOT: 'spikePlot',
    SPIKE_STATS_PLOT: 'spikeStatsPlot',
    RATE_PSD_PLOT: 'ratePSDPlot',
    LFP_TIMESERIES_PLOT: 'LFPTimeSeriesPlot',
    LFP_PSD_PLOT: 'LFPPSDPlot',
    LFP_SPECTROGRAM_PLOT: 'LFPSpectrogramPlot',
    LFP_LOCATION_PLOT: 'LFPLocationsPlot',
    GRAGER_PLOT: 'grangerPlot',
    RXD_CONCENTRATION_PLOT: 'rxdConcentrationPlot',
  },
  PYTHON_CONSOLE: PYTHON_CONSOLE_WIDGET.id
  

}
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
    method: {
      plotMethod: 'plotConn', 
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
    method: {
      plotMethod: 'plot2Dnet', 
      plotType: false
    },
    pos: 2
  },
  shapePlot: {
    id: 'shapePlot', 
    name: 'Shape Plot', 
    status: WidgetStatus.MINIMIZED, 
    component: 'Plot', 
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    method: {
      plotMethod: 'plotShape', 
      plotType: false
    },
    pos: 3
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
    method: {
      plotMethod: 'plotTraces', 
      plotType: false
    },
    pos: 4
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
    method: {
      plotMethod: 'plotRaster', 
      plotType: false
    },
    pos: 5
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
    method: {
      plotMethod: 'plotSpikeHist', 
      plotType: false
    },
    pos: 6
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
    method: {
      plotMethod: 'plotSpikeStats', 
      plotType: false
    },
    pos: 7
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
    method: {
      plotMethod: 'plotRatePSD', 
      plotType: false
    },
    pos: 8
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
    method: {
      plotMethod: 'plotLFP',
      plotType: 'timeSeries'
    },
    pos: 9
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
    method: {
      plotMethod: 'plotLFP',
      plotType: 'PSD'
    },
    pos: 10
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
    method: {
      plotMethod: 'plotLFP',
      plotType: 'spectrogram'
    },
    pos: 11
  },
  LFPLocationsPlot: {
    id: 'LFPLocationsPlot',
    name: 'LFP Locations Plot',
    status: WidgetStatus.MINIMIZED, 
    component: 'Plot', 
    panelName: MINIMIZED_PANEL,
    defaultPanel: "plotPanel",
    enableRename: false,
    hideOnClose: true,
    method: {
      plotMethod: 'plotLFP',
      plotType: 'locations'
    },
    pos: 12
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
    method: {
      plotMethod: 'granger',
      plotType: false
    },
    pos: 13
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
    method: {
      plotMethod: 'plotRxDConcentration',
      plotType: false
    },
    pos: 14
  }
}

export const DEFAULT_NETWORK_WIDGETS = {
  PYTHON_CONSOLE_WIDGET,
  D3Canvas: {
    id: 'D3Canvas', 
    name: 'Morphology', 
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
    name: 'Cell types', 
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
    name: 'Synapses', 
    status: WidgetStatus.HIDDEN, 
    component: 'synMechParams', 
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 2
  },
  'connParams': { 
    id: 'connParams', 
    name: 'Connections', 
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
    name: 'Settings', 
    status: WidgetStatus.HIDDEN,
    hideOnClose: true, 
    component: 'simConfig', 
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 6
  },
  'analysis': { 
    id: 'analysis', 
    name: 'Analysis', 
    status: WidgetStatus.HIDDEN,
    hideOnClose: true, 
    component: 'analysis', 
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 7
  }
  

}