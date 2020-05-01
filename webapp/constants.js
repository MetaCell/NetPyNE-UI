export const MODULE_NOT_FOUND_ERROR = 'ModuleNotFoundError';
export const NAME_ERROR = "NameError";
export const FILEVARIABLE_LENGTH = 'network.'.length;
import { WidgetStatus } from './components/layout/constants';
import { getPythonDefaultConsoleWidget } from './components/layout/utils';
export {getPythonDefaultConsoleWidget, WidgetStatus};

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
  plotFigure: 'netpyne_geppetto.getPlot'
}

export const FLEXLAYOUT_DEFAULT_STATE = { 
  widgets: { pythonEdit: getPythonDefaultConsoleWidget(true) },
  widgetsBackground: {
    D3Canvas: DEFAULT_MORPHOLOGY_WIDGET,
    pythonExplore: getPythonDefaultConsoleWidget(false),
  }
};2
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
  BACK_TO_EDITION: 'Back to edition'

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
    PYTHON_CONSOLE_EDIT: 'pythonEdit',
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
    PYTHON_CONSOLE_EXPLORE: 'pythonExplore',
  }
  

}



export const DEFAULT_PLOTS_WIDGETS = {
  connectionPlot: {
    id: 'connectionPlot', 
    name: 'Connections Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotConn', 
      plotType: false
    }
  },
  d2NetPlot: {
    id: 'd2NetPlot', 
    name: '2D Net Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plot2Dnet', 
      plotType: false
    }
  },
  shapePlot: {
    id: 'shapePlot', 
    name: 'Shape Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotShape', 
      plotType: false
    }
  },
  tracesPlot: {
    id: 'tracesPlot', 
    name: 'Cell traces', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotTraces', 
      plotType: false
    }
  },
  rasterPlot: {
    id: 'rasterPlot', 
    name: 'Raster plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotRaster', 
      plotType: false
    }
  },
  spikePlot: {
    id: 'spikePlot', 
    name: 'Spike Hist Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotSpikeHist', 
      plotType: false
    }
  },
  spikeStatsPlot: {
    id: 'spikeStatsPlot', 
    name: 'Spike Stats Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotSpikeStats', 
      plotType: false
    }
  },
  ratePSDPlot: {
    id: 'ratePSDPlot', 
    name: 'Rate PSD Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotRatePSD', 
      plotType: false
    }
  },
  LFPTimeSeriesPlot: {
    id: 'LFPTimeSeriesPlot', 
    name: 'LFP Time Series Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotLFP',
      plotType: 'timeSeries'
    }
  },
  LFPPSDPlot: {
    id: 'LFPPSDPlot', 
    name: 'LFP PSD Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotLFP',
      plotType: 'PSD'
    }
  },
  LFPSpectrogramPlot: {
    id: 'LFPSpectrogramPlot', 
    name: 'LFP Spectrogram Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotLFP',
      plotType: 'spectrogram'
    }
  },
  LFPLocationsPlot: {
    id: 'LFPLocationsPlot',
    name: 'LFP Locations Plot',
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotLFP',
      plotType: 'locations'
    }
  },
  grangerPlot: {
    id: 'grangerPlot', 
    name: 'Granger Plot', 
    status: WidgetStatus.ACTIVE, 
    component: 'Plot', 
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'granger',
      plotType: false
    }
  },
  rxdConcentrationPlot: {
    id: 'rxdConcentrationPlot',
    name: 'RxD concentration plot',
    status: WidgetStatus.ACTIVE, 
    component: 'Plot',
    panelName: "plotPanel",
    enableRename: false,
    method: {
      plotMethod: 'plotRxDConcentration',
      plotType: false
    }
  }
}


export const DEFAULT_MORPHOLOGY_WIDGET = {
  id: 'D3Canvas', 
  name: 'Morphology', 
  status: WidgetStatus.ACTIVE, 
  component: 'D3Canvas', 
  panelName: "morphoPanel",
  enableRename: false
}

export const DEFAULT_HLS_WIDGETS = {
  'popParams': { 
    id: 'popParams', 
    name: 'Populations', 
    status: WidgetStatus.ACTIVE, 
    component: 'popParams', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 0
  },
  'cellParams': { 
    id: 'cellParams', 
    name: 'Cell rules', 
    status: WidgetStatus.HIDDEN, 
    component: 'cellParams', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 1
  },
  'synMechParams': { 
    id: 'synMechParams', 
    name: 'Synapses', 
    status: WidgetStatus.HIDDEN, 
    component: 'synMechParams', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 2
  },
  'connParams': { 
    id: 'connParams', 
    name: 'Connections', 
    status: WidgetStatus.HIDDEN, 
    component: 'connParams', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 3
  },
  'stimSourceParams': { 
    id: 'stimSourceParams', 
    name: 'Stim. sources', 
    status: WidgetStatus.HIDDEN, 
    component: 'stimSourceParams', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 4
  },
  'stimTargetParams': { 
    id: 'stimTargetParams',
    name: 'Stim. targets',
    status: WidgetStatus.HIDDEN, 
    component: 'stimTargetParams',
    panelName: "hlsPanel",
    enableRename: false,
    pos: 5
  },
  'simConfig': { 
    id: 'simConfig', 
    name: 'Settings', 
    status: WidgetStatus.HIDDEN, 
    component: 'simConfig', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 6
  },
  'analysis': { 
    id: 'analysis', 
    name: 'Analysis', 
    status: WidgetStatus.HIDDEN, 
    component: 'analysis', 
    panelName: "hlsPanel",
    enableRename: false,
    pos: 7
  }
  

}