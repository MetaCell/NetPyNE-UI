import Actions from '@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/model/Actions';
import { WidgetStatus } from '../../constants';

const onAction = (action, widgets, model, udpateWidget, activateWidget, destroyWidget, maximizeWidget, minimizeWidget) => {
  switch (action.type){
  case Actions.SET_ACTIVE_TABSET:
    break;
  case Actions.SELECT_TAB: 
    activateWidget(action.data.tabNode);
    break;
  case Actions.DELETE_TAB:
    onActionDeleteWidget(action, widgets, model, destroyWidget);
    break;
  case Actions.MAXIMIZE_TOGGLE:
    onActionMaximizeWidget(action, widgets, model, maximizeWidget);
    break;
  case Actions.ADJUST_SPLIT:
    break;
  case Actions.ADD_NODE:{
    action.data.index = findWidgetInsertionIndex(action, widgets, model)
    break
  }
  case Actions.MOVE_NODE:{
    // If the new tabset already exists, set insertion position
    if (action.data.location === 'center') {
      action.data.index = findWidgetInsertionIndex(action, widgets, model)
    }
    // store the tabset id where the node will be moved from
    var fromTabsetId = getTabsetId(action, model)
    break
  }
  }
  
  model.doAction(action);

  // Flexlayout needs to create a tabset before we can update the panelName for the moved widget
  if (action.type === Actions.MOVE_NODE){
    moveNode(action, widgets, model, fromTabsetId, udpateWidget, activateWidget)
  }
  window.dispatchEvent(new Event('resize'));
}

const getTabsetId = (action, model) => {
  const widgetId = action.data.fromNode
  return model.getNodeById(widgetId).getParent().getId()
}

const moveNode = (action, widgets, model, fromTabsetId, udpateWidget, activateWidget, minimizeWidget) => {
  // Update widget.panelName for new tabset location
  const widgetId = action.data.fromNode
  const widget = { ...widgets[widgetId] }
  const panelName = getTabsetId(action, model)
  widget.status = WidgetStatus.ACTIVE
  widget.panelName = panelName
  widget.instancePath = widgetId
  udpateWidget(widget)

  // Elect a new active widget in old panel
  const fromTabset = model.getNodeById(fromTabsetId)
  
  if (fromTabset) {
    const fromTabsetChildren = fromTabset.getChildren().filter(child => child.getId() !== action.data.fromNode)
    if (fromTabsetChildren.length > 0) {
      const newActiveWidget = fromTabsetChildren[0].getConfig()
      newActiveWidget.status = WidgetStatus.ACTIVE
      newActiveWidget.instancePath = newActiveWidget.id
      activateWidget(newActiveWidget.id)
    }
  }
    
  
}

const findWidgetInsertionIndex = (action, widgets, model) => {
  var position = 0
  if (action.type === Actions.ADD_NODE) {
    position = action.data.json.config.pos
  } else {
    position = widgets[action.data.fromNode].pos
  }
  
  const tabset = model.getNodeById(action.data.toNode)
  const positions = tabset.getChildren().map(node => node.getConfig().pos)
  var index = -1
  for (let i = 0; i < positions.length; i++) {
    if (position < positions[i]) {
      index = i
      break
    }
  }
  return index
}

const findMaximizedWidget = widgets => Object.values(widgets).find(widget => widget && widget.status == WidgetStatus.MAXIMIZED)

const onActionDeleteWidget = (action, widgets, model, destroyWidget) => {
  const maximizedWidget = findMaximizedWidget(widgets);
  // change widget status
  destroyWidget(action.data.node);
  // check if the current maximized widget is the same than in the action dispatched
  if (maximizedWidget && maximizedWidget.id == action.data.node) {
    // find if there exists another widget in the maximized panel that could take its place
    const panelChildren = model.getActiveTabset().getChildren();
    const index = panelChildren.findIndex(child => child.getId() == action.data.node);
    // Understand if the tab to the left or right of the destroyed tab will be the next one to be maximized
    if (index != -1 && panelChildren.length > 1) {
      if (index == 0) {
        onActionMaximizeWidget(panelChildren[1].getId(), widgets, model);
      } else {
        onActionMaximizeWidget(panelChildren[index - 1].getId(), widgets, model);
      }
    }
  }
}

const onActionMaximizeWidget = (action, widgets, model, activateWidget, maximizeWidget) => {
  const panel2maximize = model.getNodeById(action.data.node);
  
  if (panel2maximize.getChildren().length > 0) {
    const widgetId2maximize = panel2maximize.getSelectedNode().getId();
    const maximizedWidget = this.findMaximizedWidget(widgets);
    if (maximizedWidget) {
      if (maximizedWidget.id !== widgetId2maximize) {
        maximizeWidget(widgetId2maximize, maximizeWidget);
      }
      activateWidget(maximizedWidget.id, activateWidget);
    
    } else {
      maximizeWidget(widgetId2maximize);
    }
  }
  
}

export default onAction