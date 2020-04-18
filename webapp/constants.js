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