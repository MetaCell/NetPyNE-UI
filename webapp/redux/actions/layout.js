import { WidgetStatus } from '../../components/layout/constants';

export const SET_LAYOUT = 'SET_LAYOUT';
export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const ACTIVATE_WIDGET = 'ACTIVATE_WIDGET';
export const ADD_WIDGET = 'ADD_WIDGET';
export const RESET_LAYOUT = 'RESET_LAYOUT';
export const DESTROY_WIDGET = 'DESTROY_WIDGET';
export const ADD_PLOT_TO_EXISTING_WIDGET = 'ADD_PLOT_TO_EXISTING_WIDGET'


export const newWidget = ({ path, component, panelName, ...others }) => ({
  type: ADD_WIDGET,
  data: {
    id: path,
    instancePath: path,
    component: component,
    name: path,
    status: WidgetStatus.ACTIVE,
    panelName: panelName,
    ...others
  }
});

export const updateWidget = (newConf => ({
  type: UPDATE_WIDGET,
  data: newConf
}))

export const setLayout = (newLayout => ({
  type: SET_LAYOUT,
  data: newLayout
}))


export const minimizeWidget = id => ({
  type: UPDATE_WIDGET,
  data: {
    id,
    status: WidgetStatus.MINIMIZED
  }

});

export const maximizeWidget = id => ({
  type: UPDATE_WIDGET,
  data: {
    id,
    status: WidgetStatus.MAXIMIZED
  }
});
export const activateWidget = id => ({
  type: ACTIVATE_WIDGET,
  data: { id }

});

export const destroyWidget = id => ({
  type: DESTROY_WIDGET,
  data: { id }

});

export const resetLayout = { type: RESET_LAYOUT, };
