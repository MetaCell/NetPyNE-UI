/**
 * Wraps the FlexLayout component in order to allow a declarative specification 
 * of the layout and the components displayed.
 */
import React, { Component } from 'react';
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';

import { WidgetStatus } from './constants';

import WidgetFactory from './WidgetFactory';
import TabsetIconFactory from './TabsetIconFactory'
import defaultLayoutConfiguration from './defaultLayout.json';

import { withStyles } from '@material-ui/core/styles'

import { widget2Node, isEqual } from './utils';

const styles = ({ spacing }) => ({
  container: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  spacer: { width: spacing(1) },
  flexlayout: { position: 'relative', flexGrow: 1 }
})


class LayoutManager extends Component {

  constructor (props) {
    super(props);
    this.model = FlexLayout.Model.fromJson(this.props.layout ? this.props.layout : defaultLayoutConfiguration);
    this.destroyWidget = this.props.destroyWidget ? this.props.destroyWidget : () => console.debug('destroyWidget not defined');
    this.activateWidget = this.props.activateWidget ? this.props.activateWidget : () => console.debug('activateWidget not defined');
    this.maximizeWidget = this.props.maximizeWidget ? this.props.maximizeWidget : () => console.debug('maximizeWidget not defined');
    this.minimizeWidget = this.props.minimizeWidget ? this.props.minimizeWidget : () => console.debug('minimizeWidget not defined');
    

    this.widgetFactory = this.props.widgetFactory ? this.props.widgetFactory : new WidgetFactory();
    this.tabsetIconFactory = this.props.TabsetIconFactory ? this.props.TabsetIconFactory : new TabsetIconFactory();

    
  }


  componentDidMount () {
    const { widgets } = this.props;
    this.addWidgets(Object.values(widgets));
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.layout !== this.props.layout) {
      this.model = this.props.layout;
    }

    const { widgets } = this.props;
    const oldWidgets = prevProps.widgets;
    
    const newWidgets = this.findNewWidgets(widgets, oldWidgets);
    if (newWidgets.length > 0) {
      this.addWidgets(newWidgets);
    }
    
    const updatedWidgets = this.findUpdatedWidgets(widgets, oldWidgets);
    if (updatedWidgets) {
      this.updateWidgets(updatedWidgets, oldWidgets);
    }

    const deletedWidgets = this.findDeletedWidgets(widgets, oldWidgets);
    if (deletedWidgets) {
      this.deleteWidgets(deletedWidgets);
    }
    console.log(this.model.toJson());
  }
 
  
  addWidgets (widgets) {
    const { model } = this;
    for (let newWidgetDescriptor of widgets) {

      if (!model.getNodeById(newWidgetDescriptor.id)) {
        this.addWidget(newWidgetDescriptor);
      } else {
        console.warn('Should not be here in addWidgets...');
      }
      
    }
    for (let widget of widgets) {
   
      if (widget.status == WidgetStatus.ACTIVE) {
        model.doAction(FlexLayout.Actions.selectTab(widget.id));
      }
      
    }
    // window.dispatchEvent(new Event('resize'));
  }

  deleteWidgets (widgets) {
    const { model } = this;
    for (let widget of widgets) {
      model.doAction(FlexLayout.Actions.deleteTab(widget.id));
    }
  }

  addWidget (widgetConfiguration) {
    const { model } = this;
    let tabset = model.getNodeById(widgetConfiguration.panelName)
    if (tabset === undefined) {
      this.createTabSet(widgetConfiguration.panelName)
    }
    if (widgetConfiguration.status === WidgetStatus.BORDER){
      this.refs.layout.addTabToTabSet('border_bottom', widget2Node(widgetConfiguration))
    } else {
      this.refs.layout.addTabToTabSet(widgetConfiguration.panelName, widget2Node(widgetConfiguration))
    }
    
  }
  
  createTabSet (tabsetID) {
    // In case the tabset doesn't exist
    const { model } = this;
    const rootNode = model.getNodeById("root")

    let hrow = new FlexLayout.RowNode(model, {});
    hrow._setWeight(100)

    const tabset = new FlexLayout.TabSetNode(model, { id: tabsetID });
    tabset._setWeight(80)
      
    hrow._addChild(tabset)
      
    rootNode.getChildren().forEach(child => {
      const newWeight = child.getWeight() / 2
      child._setWeight(newWeight)
      hrow._addChild(child)
    })

    rootNode._removeAll()
    rootNode._addChild(hrow, 0);
    if (!this.props.editMode && tabsetID === 'plotPanel') {
      // We need to resize Geppetto 3D canvas to new panel sizes
      setTimeout(() => window.dispatchEvent(new Event('resize')), 1000)
    }
  }

  updateWidgets (widgets, oldWidgets) {
    const { model } = this;
    for (let widget of widgets) {

      this.updateWidget(widget);
      if (oldWidgets[widget.id].status === WidgetStatus.BORDER && widget.status !== WidgetStatus.BORDER) {
        this.restoreWidget(widget)
      } else if (oldWidgets[widget.id].status !== WidgetStatus.BORDER && widget.status === WidgetStatus.BORDER){
        this.moveWidget(widget)
      } else {
        // update plotly.js plots to new panel sizes
        if (widget.status == WidgetStatus.ACTIVE) {
          model.doAction(FlexLayout.Actions.selectTab(widget.id));
        }
      }
      
    }
  }

  updateWidget (widget) {
    const { model } = this;
    if (widget) {
      this.widgetFactory.updateWidget(widget);
      model.doAction(Actions.updateNodeAttributes(widget.id, widget2Node(widget))); 
    }
    
  }


  onAction (action) {

    const { model } = this;
    switch (action.type){
    case Actions.SET_ACTIVE_TABSET:
      break;
    case Actions.SELECT_TAB: 
      this.activateWidget(action.data.tabNode);
      break;
    case Actions.DELETE_TAB:{
      this.onActionDeleteWidget(action);
      if (action.data.node.includes('python')) {
        // prevent python widget from been destroyed
        return
      } 
      break;
    }
    case Actions.MAXIMIZE_TOGGLE:
      this.onActionMaximizeWidget(action);
      break;
    case Actions.ADJUST_SPLIT:
      break;
    case Actions.ADD_NODE:{
      action.data.index = this.findWidgetInsertionIndex(action);
      break
    }
    case Actions.MOVE_NODE:{
      // If the new tabset already exists, set insertion position
      if (action.data.location === 'center') {
        action.data.index = this.findWidgetInsertionIndex(action);
      }
      // store the tabset id where the node will be moved from
      var fromTabsetId = this.getTabsetId(action)
      break
    }
    }
    
    model.doAction(action);
  
    // Flexlayout needs to create a tabset before we can update the panelName for the moved widget
    if (action.type === Actions.MOVE_NODE){
      this.moveNode(action)
    }
    window.dispatchEvent(new Event('resize'));
  }




getTabsetId (action) {
  const widgetId = action.data.fromNode
  return model.getNodeById(widgetId).getParent().getId()
}

moveNode = (action, fromTabsetId) => {
  // Update widget.panelName for new tabset location
  const { widgets, model } = this;
  const widgetId = action.data.fromNode;
  const widget = { ...widgets[widgetId] }
  const panelName = this.getTabsetId(action, model)
  widget.status = WidgetStatus.ACTIVE
  widget.panelName = panelName
  widget.instancePath = widgetId
  this.udpateWidget(widget)

  // Elect a new active widget in old panel
  const fromTabset = model.getNodeById(fromTabsetId)
  
  if (fromTabset) {
    const fromTabsetChildren = fromTabset.getChildren().filter(child => child.getId() !== action.data.fromNode)
    if (fromTabsetChildren.length > 0) {
      const newActiveWidget = fromTabsetChildren[0].getConfig()
      newActiveWidget.status = WidgetStatus.ACTIVE
      newActiveWidget.instancePath = newActiveWidget.id
      this.activateWidget(newActiveWidget.id)
    }
  }
    
  
}

findWidgetInsertionIndex (action) {
  const { widgets, model } = this;
  var position = 0
  if (action.type === Actions.ADD_NODE) {
    position = action.data.json.config.pos;
  } else {
    position = widgets[action.data.fromNode].pos;
  }
  
  const tabset = model.getNodeById(action.data.toNode);

  const nodes = tabset.getChildren();
  for (let i = 0; i < nodes.length; i++) {
    if (position < nodes[i].getConfig().pos) {
      return i;
    }
  }
  return -1;
}

findMaximizedWidget = widgets => Object.values(widgets).find(widget => widget && widget.status == WidgetStatus.MAXIMIZED)

findWidget(id) {
  return this.widgets[id];
}

onActionDeleteWidget (action)  {
  
  if (this.findWidget(action.data.node).hideOnClose){
    this.moveWidgetToBorder(action)
  } else {
    this.destroyWidget(action.data.node);
  }
  // change widget status
  this.updateMaximizedWidget(action);
}

updateMaximizedWidget (action) {
  const { widgets, model } = this;
  const maximizedWidget = this.findMaximizedWidget(widgets);
  // check if the current maximized widget is the same than in the action dispatched
  if (maximizedWidget && maximizedWidget.id == action.data.node) {
  // find if there exists another widget in the maximized panel that could take its place
    const panelChildren = model.getActiveTabset().getChildren();
    const index = panelChildren.findIndex(child => child.getId() == action.data.node);
    // Understand if the tab to the left or right of the destroyed tab will be the next one to be maximized
    if (index != -1 && panelChildren.length > 1) {
      if (index == 0) {
        this.onActionMaximizeWidget(panelChildren[1].getId());
      } else {
        this.onActionMaximizeWidget(panelChildren[index - 1].getId());
      }
    }
  }
}

moveWidgetToBorder (action) {
  const {widgets} = this;
  var updatedWidget = { ...widgets[action.data.node] };
  if (updatedWidget === undefined) {
    return;
  }
  updatedWidget.status = WidgetStatus.BORDER;
  updatedWidget.panelName = "border_bottom";
  this.udpateWidget(updatedWidget);
}

onActionMaximizeWidget (action) {
  const { widgets, model } = this;
  const panel2maximize = model.getNodeById(action.data.node);
  
  if (panel2maximize.getChildren().length > 0) {
    const widgetId2maximize = panel2maximize.getSelectedNode().getId();
    const maximizedWidget = this.findMaximizedWidget(widgets);
    if (maximizedWidget) {
      if (maximizedWidget.id !== widgetId2maximize) {
        this.maximizeWidget(widgetId2maximize);
      }
      this.activateWidget(maximizedWidget.id);
    
    } else {
      this.maximizeWidget(widgetId2maximize);
    }
  }
  
}
  
  factory (node) {
    return this.widgetFactory.factory(node.getConfig());
  }

  iconFactory (node) {
    // TODO move to newest flexlayout-react to add this functionality
    return this.tabsetIconFactory.factory(node.getConfig());
  }


  findNewWidgets (widgets, oldWidgets) {
    if (oldWidgets) {
      return Object.values(widgets).filter(widget => widget && !oldWidgets[widget.id])
    }
    return Object.values(widgets)
  }

  findUpdatedWidgets (widgets, oldWidgets) {
    return oldWidgets 
      ? Object.values(widgets)
        .filter(widget => widget && oldWidgets[widget.id] && !isEqual(widget, oldWidgets[widget.id])) 
      : Object.values(widgets);
  }

  findDeletedWidgets (widgets, oldWidgets) {
    return oldWidgets ? Object.values(oldWidgets).filter(widget => widget && !widgets[widget.id]) : Object.values(widgets);
  }

  findMaximizedWidget (widgets) {
    return Object.values(widgets).find(widget => widget && widget.status == WidgetStatus.MAXIMIZED);
  }
  

  restoreWidget (widget) {
    const { model } = this;
    const panelName = widget.panelName
    let tabset = model.getNodeById(panelName)
    if (tabset === undefined) {
      this.createTabSet(panelName)
    }
    this.moveWidget(widget)
  }

  
  moveWidget (widget) {
    const { model } = this;
    model.doAction(FlexLayout.Actions.moveNode(widget.id, widget.panelName, FlexLayout.DockLocation.CENTER, 0));
    // Resize of canvas and SVG images
    window.dispatchEvent(new Event('resize'));
  }
  
  onRenderTab (node,renderValues) {
  }
  render () {
    const { classes, widgets } = this.props
    const { model } = this;
    return (
      <div className={classes.container}>
        <div className={classes.spacer}/>
        <div className={classes.flexlayout}>
          <FlexLayout.Layout
            ref="layout"
            model={model}
            factory={this.factory.bind(this)}
            iconFactory={this.iconFactory.bind(this)}
            onAction={action => this.onAction(action)}
            onRenderTab={(node,renderValues) => this.onRenderTab(node,renderValues)}
          />
        </div>
        <div className={classes.spacer}/>
      </div>
    )
  }
}


export default withStyles(styles)(LayoutManager)