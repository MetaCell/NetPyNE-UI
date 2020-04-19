export const MODULE_NOT_FOUND_ERROR = 'ModuleNotFoundError';
export const NAME_ERROR = "NameError";
export const FILEVARIABLE_LENGTH = 'network.'.length;
/*
 * status can be one of:
 *  - ACTIVE: the user can see the tab content.
 *  - MINIMIZED: the tab is minimized.
 *  - HIDDEN:  other tab in the node is currently selected
 *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
 */
export const WidgetStatus = {
  HIDDEN: 'HIDDEN',
  ACTIVE: 'ACTIVE',
  MAXIMIZED: 'MAXIMIZED',
  MINIMIZED: 'MINIMIZED',
  BORDER: 'BORDER'
};

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
  POP_PARAMS: 'popParams',
  CELL_PARAMS: 'celParams',
  SYN_MECH_PARAMS: 'synMechParams',
  CONN_PARAMS: 'connParams',
  STIM_SOURCE_PARAMS: 'stimSourceParams',
  STIM_TARGET_PARAMS: 'stimTargetParams',
  SIM_CONFIG: 'simConfig',
  ANALYSIS: "analysis",
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
  PYTHON_CONSOLE_EDIT: 'pythonEdit',
  PYTHON_CONSOLE_EXPLORE: 'pythonExplore',

}