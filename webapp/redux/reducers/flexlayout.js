import { 
  ADD_WIDGET,
  UPDATE_WIDGET,
  RESET_LAYOUT,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET,
  SWITCH_LAYOUT
} from '../actions/flexlayout';

import { MODEL_LOADED } from '../actions/general';
import { WidgetStatus } from '../../constants';


function removeUndefined (obj) {
  return Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
}

export const PYTHON_CONSOLE_WIDGET = { 
  id: 'python', 
  name: 'Python', 
  status: WidgetStatus.ACTIVE, 
  icon: 'fa fa-code',
  component: 'PythonConsole', 
  panelName: "consolePanel",
  enableClose: false,
  enableDrag: false,
  enableRename: false
};

export const MORPHOLOGY_WIDGET = {
  id: 'D3Canvas', 
  name: 'Morphology', 
  status: WidgetStatus.ACTIVE, 
  icon: 'fa fa-dot-circle-o',
  component: 'D3Canvas', 
  panelName: "morphoPanel",
  enableRename: false
}

export const HLS_WIDGETS = {
  'popParams': { 
    id: 'popParams', 
    name: 'Populations', 
    status: WidgetStatus.ACTIVE, 
    icon: 'fa fa-dot-circle-o',
    component: 'popParams', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'cellParams': { 
    id: 'cellParams', 
    name: 'Cell rules', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'cellParams', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'synMechParams': { 
    id: 'synMechParams', 
    name: 'Synapses', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'synMechParams', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'connParams': { 
    id: 'connParams', 
    name: 'Connections', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'connParams', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'stimSourceParams': { 
    id: 'stimSourceParams', 
    name: 'Stim. sources', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'stimSourceParams', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'stimTargetParams': { 
    id: 'stimTargetParams',
    name: 'Stim. targets',
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'stimTargetParams',
    panelName: "hlsPanel",
    enableRename: false
  },
  'simConfig': { 
    id: 'simConfig', 
    name: 'Settings', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'simConfig', 
    panelName: "hlsPanel",
    enableRename: false
  },
  'analysis': { 
    id: 'analysis', 
    name: 'Anaylysis', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'analysis', 
    panelName: "hlsPanel",
    enableRename: false
  }
  

}

export const FLEXLAYOUT_DEFAULT_STATE = { 
  widgets: { 'python': PYTHON_CONSOLE_WIDGET },
  widgetsBackground: {
    'D3Canvas': MORPHOLOGY_WIDGET,
    'python': PYTHON_CONSOLE_WIDGET,
  }
};


export default (state = FLEXLAYOUT_DEFAULT_STATE, action) => {
  if (action.data) {
    removeUndefined(action.data); // Prevent deletion in case of unpolished update action
  }
  
  switch (action.type) {
    
  case ADD_WIDGET:
  case UPDATE_WIDGET: { 
    const newWidget = { ...state.widgets[action.data.id], panelName: extractPanelName(action), ...action.data };
    return {
      ...state, widgets: { 
        ...updateWidgetState(state.widgets, newWidget), 
        [action.data.id]: newWidget 
      }
    } ;
  }

  case DESTROY_WIDGET:{
    const newWidgets = { ...state.widgets };
    delete newWidgets[action.data.id];
    return { ...state, widgets: newWidgets };
  }

  case ACTIVATE_WIDGET: { 
    const activatedWidget = state.widgets[action.data.id];
    
    return {
      ...state, widgets: { 
        ...updateWidgetState(state.widgets, { panelName: state.widgets[action.data.id], status: WidgetStatus.ACTIVE }), 
        [action.data.id]: { ...activatedWidget, status: WidgetStatus.ACTIVE }
      }
    }
  }

  case RESET_LAYOUT:
    return FLEXLAYOUT_DEFAULT_STATE;

  case MODEL_LOADED: 
    return { ...state, widgets: { ...HLS_WIDGETS, ...state.widgets } }
  
  case SWITCH_LAYOUT: {
    const { widgets, widgetsBackground, ...others } = state
    return { ...others, widgets: { ...widgetsBackground }, widgetsBackground: { ...widgets } }
  }
    
  
  default:
    return state
  }
}

function filterWidgets (widgets, filterFn) {
  return Object.fromEntries(Object.values(widgets).filter(filterFn));
}

/**
 * Ensure there is one only active widget in the same panel
 * @param {*} widgets 
 * @param {*} param1 
 */
function updateWidgetState (widgets, { status, panelName }) {
  if (status != WidgetStatus.ACTIVE) {
    return widgets;
  }
  return Object.fromEntries(Object.values(widgets).filter(widget => widget).map(widget => [
    widget.id,
    {
      ...widget,
      status: widget.panelName == panelName ? WidgetStatus.HIDDEN : widget.status
    }
  ]));
}

function extractPanelName (action) {
  return action.data.component == "Plot" ? "bottomPanel" : "leftPanel";
}
