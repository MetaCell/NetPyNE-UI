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

const PYTHON_CONSOLE_WIDGET = { 
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

const MORPHOLOGY_WIDGET = {
  id: 'D3Canvas', 
  name: 'Morphology', 
  status: WidgetStatus.ACTIVE, 
  icon: 'fa fa-dot-circle-o',
  component: 'D3Canvas', 
  panelName: "morphoPanel",
  enableClose: false,
  enableDrag: false,
  enableRename: false
}
const HLS_WIDGETS = {
  'popParams': { 
    id: 'popParams', 
    name: 'popParams', 
    status: WidgetStatus.ACTIVE, 
    icon: 'fa fa-dot-circle-o',
    component: 'popParams', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'cellParams': { 
    id: 'cellParams', 
    name: 'cellParams', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'cellParams', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'synMechParams': { 
    id: 'synMechParams', 
    name: 'synMechParams', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'synMechParams', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'connParams': { 
    id: 'connParams', 
    name: 'connParams', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'connParams', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'stimSourceParams': { 
    id: 'stimSourceParams', 
    name: 'stimSourceParams', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'stimSourceParams', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'stimTargetParams': { 
    id: 'stimTargetParams',
    name: 'stimTargetParams',
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'stimTargetParams',
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'simConfig': { 
    id: 'simConfig', 
    name: 'simConfig', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'simConfig', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  },
  'analysis': { 
    id: 'analysis', 
    name: 'analysis', 
    status: WidgetStatus.HIDDEN, 
    icon: 'fa fa-dot-circle-o',
    component: 'analysis', 
    panelName: "hlsPanel",
    enableClose: false,
    enableDrag: false,
    enableRename: false
  }
  

}

export const FLEXLAYOUT_DEFAULT_STATE = { 
  widgets: { 'python': PYTHON_CONSOLE_WIDGET },
  widgetsBackground: {
    'python': PYTHON_CONSOLE_WIDGET,
    'D3Canvas': MORPHOLOGY_WIDGET
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
    return { ...state, widgets: { ...state.widgets, ...HLS_WIDGETS } }
  
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
