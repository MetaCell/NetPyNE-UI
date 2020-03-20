import { 
  ADD_WIDGET,
  UPDATE_WIDGET,
  RESET_LAYOUT,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET,
} from '../actions/flexlayout';

import { MODEL_LOADED } from '../actions/general';
import { WidgetStatus } from '../../constants';


function removeUndefined (obj) {
  return Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
}

export const FLEXLAYOUT_DEFAULT_STATE = { 
  widgets: {
    
    'python': { 
      id: 'python', 
      name: 'Python', 
      status: WidgetStatus.MINIMIZED, 
      icon: 'fa-python',
      component: 'PythonConsole', 
      panelName: "bottomPanel",
      enableClose: false
    },
    
  },

};


const MODEL_LOADED_STATE_WIDGETS = {
  '3dcanvas': { 
    id: '3DCanvas', 
    name: 'Network', 
    status: WidgetStatus.MINIMIZED, 
    icon: 'fa-python',
    component: '3DCanvas', 
    panelName: "topPanel",
    enableClose: false
  }
}


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
    return {
      ...state, widgets: { 
        ...state.widgets,
        ...MODEL_LOADED_STATE_WIDGETS
      }
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

    
