import { 
  ADD_WIDGET,
  UPDATE_WIDGET,
  RESET_LAYOUT,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET,
  SET_LAYOUT
} from '../actions/layout';

import { MODEL_LOADED } from '../actions/general';
import { WidgetStatus } from '../../components/layout/constants';

import {
  DEFAULT_HLS_WIDGETS, getPythonDefaultConsoleWidget, 
  DEFAULT_MORPHOLOGY_WIDGET
} from '../../constants';

function removeUndefined (obj) {
  return Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
}



export const FLEXLAYOUT_DEFAULT_STATE = { 
  widgets: { pythonEdit: getPythonDefaultConsoleWidget(true) },
  widgetsBackground: {
    D3Canvas: DEFAULT_MORPHOLOGY_WIDGET,
    pythonExplore: getPythonDefaultConsoleWidget(false),
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
        ...activateWidget(state.widgets, activatedWidget.panelName), 
        [action.data.id]: { ...activatedWidget, status: WidgetStatus.ACTIVE }
      }
    }
  }

  case RESET_LAYOUT:
    return FLEXLAYOUT_DEFAULT_STATE;

  case MODEL_LOADED: 
    return { ...state, widgets: { ...DEFAULT_HLS_WIDGETS, ...state.widgets } }
  
  case SET_LAYOUT: {
    const { widgets, ...others } = state
    return 
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


function activateWidget ( widgets, panelName) {
  const newWidgets = {}
  Object.values(widgets).forEach(widget => {
    newWidgets[widget.id] = { ...widget }
    if (widget.panelName === panelName) {
      newWidgets[widget.id].status = WidgetStatus.HIDDEN
    }
  })
  return newWidgets
}