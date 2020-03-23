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
  MINIMIZED: 'MINIMIZED'
};


export const NETPYNE_COMMANDS = { 
  instantiateModel: 'netpyne_geppetto.instantiateNetPyNEModelInGeppetto',
  simulateModel: 'netpyne_geppetto.simulateNetPyNEModelInGeppetto'
}

