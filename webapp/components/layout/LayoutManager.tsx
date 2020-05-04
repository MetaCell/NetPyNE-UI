/**
 * Wraps the FlexLayout component in order to allow a declarative specification
 * of the layout and the components displayed.
 */
import * as React from 'react';
import * as FlexLayout from "@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/index";
import Actions from "@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/model/Actions";
import DockLocation from "@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/DockLocation";
import Model from "@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/model/Model";
import { WidgetStatus, Widget, ExtendedNode } from "./model";
import { withStyles, createStyles } from '@material-ui/core/styles'
import WidgetFactory from "./WidgetFactory";
import TabsetIconFactory from "./TabsetIconFactory";
import defaultLayoutConfiguration from "./defaultLayout";
import { widget2Node, isEqual } from "./utils";

import {
  ADD_WIDGET,
  ADD_WIDGETS,
  UPDATE_WIDGET,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET,
  SET_LAYOUT,
  SET_WIDGETS,
  setLayout
} from "./actions";

import { MINIMIZED_PANEL } from '.';

const styles = (theme) => createStyles({
  container: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  spacer: { width: theme.spacing(1) },
  flexlayout: { position: 'relative', flexGrow: 1 }
});

let instance = null;

class LayoutManager {
  model: Model;
  widgetFactory: WidgetFactory;
  tabsetIconFactory: TabsetIconFactory;
  dispatch;
  layoutManager = this;
  enableMinimize = false;

  constructor(
    model,
    widgetFactory: WidgetFactory = null,
    tabsetIconFactory: TabsetIconFactory = null,
    enableMinimize = false
  ) {
    this.model = FlexLayout.Model.fromJson(
      model ? model : defaultLayoutConfiguration
    );

    this.widgetFactory = widgetFactory ? widgetFactory : new WidgetFactory();
    this.tabsetIconFactory = tabsetIconFactory
      ? tabsetIconFactory
      : new TabsetIconFactory();
    this.middleware = this.middleware.bind(this);
    this.factory = this.factory.bind(this);
    this.enableMinimize = enableMinimize;
  }

  addWidget(widgetConfiguration: Widget) {
    if(this.getWidget(widgetConfiguration.id)) {
      return this.updateWidget(widgetConfiguration);
    }
    const { model } = this;
    let tabset = model.getNodeById(widgetConfiguration.panelName);
    if (tabset === undefined) {
      this.createTabSet(widgetConfiguration.panelName);
    }
    this.model.doAction(
      Actions.addNode(
        widget2Node(widgetConfiguration),
        widgetConfiguration.panelName,
        DockLocation.CENTER,
        widgetConfiguration.pos ? widgetConfiguration.pos : -1
      )
    );
  }

  onRenderTabSet = (panel, renderValues) => {
    if (panel.getType() === "tabset" && this.enableMinimize) {
      if (panel.getId() != 'leftPanel' && panel.getChildren().length > 0){
        renderValues.buttons.push(<div key={panel.getId()} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
          this.minimizeWidget(panel.getSelectedNode().getId()) 
        }} />);
      }
    }
  }

  Component = (layoutManager: LayoutManager) => ({classes}) =>  (
        <div className={classes.container}>
          <div className={classes.spacer}/>
          <div className={classes.flexlayout}>
            <FlexLayout.Layout
              model={this.model}
              factory={this.factory}
              // iconFactory={layoutManager.iconFactory.bind(this)}
              onAction={action => layoutManager.onAction(action)}
              onRenderTab={(node,renderValues) => layoutManager.onRenderTabSet(node, renderValues)}
            />
          </div>
          <div className={classes.spacer}/>
        </div>
      );

  getComponent = () => withStyles(styles)(this.Component(this));


  private createTabSet(tabsetID) {
    // In case the tabset doesn't exist
    const { model } = this;
    const rootNode = model.getNodeById("root");

    let hrow = new FlexLayout.RowNode(model, {});
    hrow._setWeight(100);

    const tabset = new FlexLayout.TabSetNode(model, { id: tabsetID });
    tabset._setWeight(80);

    hrow._addChild(tabset);

    rootNode.getChildren().forEach(child => {
      if(child['getWeight']){
        const newWeight = (child as FlexLayout.TabSetNode).getWeight() / 2;
        child._setWeight(newWeight);
        hrow._addChild(child);
      }
      
    });

    rootNode._removeAll();
    rootNode._addChild(hrow, 0);

    setTimeout(() => window.dispatchEvent(new Event("resize")), 1000);
  }

  middleware = (store) => (next) => (action) => {
    const model = this.model;
    console.debug(action);
    switch (action.type) {
      case ADD_WIDGET: {

        this.addWidget(action.data);
        
        break;
      }
      case ADD_WIDGETS: {
        this.addWidgets(action.data);
        break;
      }
      case UPDATE_WIDGET: {
        this.updateWidget(action.data);
        break;
      }

      case DESTROY_WIDGET: {
        const widget = action.data;
        this.deleteWidget(widget);
        break;
      }

      case ACTIVATE_WIDGET: {
        action.data.status = WidgetStatus.ACTIVE;
        this.updateWidget(action.data);
        break;
      }
      case SET_WIDGETS: {
        const newWidgets: Map<string, Widget> = action.data;
        for(let widget of this.getWidgets()) {
          if(!newWidgets[widget.id]){
            this.deleteWidget(widget);
          }
        }
        this.addWidgets(Object.values(newWidgets));
        break;

      }

      case SET_LAYOUT: {
        this.model = FlexLayout.Model.fromJson(action.data);
        next(action);
        return;
      }

      default: {
        next(action);
        return;
      }
    }

    next(setLayout(model.toJson()));
  };

  private addWidgets(newWidgets: Array<Widget>) {
    let active = null;
    for (let widget of newWidgets) {
      if (widget.status == WidgetStatus.ACTIVE) {
        active = widget.id;
      }

      this.addWidget(widget);
      
    }
    if (active) {
      this.model.doAction(FlexLayout.Actions.selectTab(active));
    }
  }

  private deleteWidget( widget: any) {
   this.model.doAction(Actions.deleteTab(widget.id));
  }

  getWidgets() {
 
    let nodes = [];
    this.model.visitNodes((node, level) => {
      // TODO access through public api. getConfig is hiding our data (using extraData maybe works)
      if((node['_attributes'] as ExtendedNode).config) {
        nodes.push((node['_attributes'] as ExtendedNode).config);
      }
    });
    return nodes;
  }
  
  onAction(action) {
    const { model } = this;
    const oldModel = model.toJson();
    let defaultAction = true;
    switch (action.type) {
      case Actions.SET_ACTIVE_TABSET:
        break;
      case Actions.SELECT_TAB:
        break;
      case Actions.DELETE_TAB: {
        if (this.getWidget(action.data.node).hideOnClose) {
          this.minimizeWidget(action.data.node);
          defaultAction = false;
        }
        break;
      }
      case Actions.MAXIMIZE_TOGGLE:
        // this.onActionMaximizeWidget(action);
        break;
      case Actions.ADJUST_SPLIT:
        break;
      case Actions.ADD_NODE: {
        // action.data.index = this.findWidgetInsertionIndex(action);
        break;
      }
      case Actions.MOVE_NODE: {

        break;
      }
      default: {
        model.doAction(action);
      }
    }
    if(defaultAction) {
      model.doAction(action);
    }
    
    
    const newModel = model.toJson();
    if(!isEqual(oldModel, newModel)){
      this.dispatch(setLayout(newModel));
    }
    
  
    window.dispatchEvent(new Event("resize"));
  }

  getTabsetId(action) {
    const widgetId = action.data.fromNode;
    return this.model
      .getNodeById(widgetId)
      .getParent()
      .getId();
  }

  

  findMaximizedWidget() {
    return this.getWidgets().find(
      (widget) => widget && widget.status == WidgetStatus.MAXIMIZED
    );
  }
    

  getWidget(id): Widget {
    const node = this.model.getNodeById(id);
    return node && node['_attributes'] ? (node['_attributes'] as ExtendedNode).config: null;
  }


  updateMaximizedWidget(action) {
    const {  model } = this;
    const maximizedWidget = this.findMaximizedWidget();
    // check if the current maximized widget is the same than in the action dispatched
    if (maximizedWidget && maximizedWidget.id == action.data.node) {
      // find if there exists another widget in the maximized panel that could take its place
      const panelChildren = model.getActiveTabset().getChildren();
      const index = panelChildren.findIndex(
        (child) => child.getId() == action.data.node
      );
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

   


  minimizeWidget(widgetId) {

    var updatedWidget = {...this.getWidget(widgetId)};
    if (updatedWidget === undefined) {
      return;
    }
    updatedWidget.status = WidgetStatus.MINIMIZED;
    updatedWidget.defaultPanel = updatedWidget.panelName;
    updatedWidget.panelName = MINIMIZED_PANEL;
    this.updateWidget(updatedWidget);
    // this.model.doAction(FlexLayout.Actions.moveNode(widgetId, "border_bottom", FlexLayout.DockLocation.CENTER, 0));
  }

  updateWidget (widget: Widget) {
    const { model } = this;
    if(!widget){
      debugger;
    }
      const previousWidget = this.getWidget(widget.id);
      if(previousWidget.status != widget.status) {
        if(previousWidget.status == WidgetStatus.MINIMIZED) {
          this.restoreWidget(widget);
        }
        else {
          this.moveWidget(widget);
        }
      }
      this.widgetFactory.updateWidget(widget);
      model.doAction(Actions.updateNodeAttributes(widget.id, widget2Node(widget))); 
      if (widget.status == WidgetStatus.ACTIVE) {
        model.doAction(FlexLayout.Actions.selectTab(widget.id));
      }
  }

  onActionMaximizeWidget(action) {
    // const { model } = this;
    // const panel2maximize = <Panel>model.getNodeById(action.data.node);

    // if (panel2maximize.getChildren().length > 0) {
    //   const widgetId2maximize = panel2maximize.getSelectedNode().getId();
    //   const maximizedWidget = this.findMaximizedWidget();
    //   if (maximizedWidget) {
    //     if (maximizedWidget.id !== widgetId2maximize) {
    //       this.maximizeWidget(widgetId2maximize);
    //     }
    //     this.activateWidget(maximizedWidget.id);
    //   } else {
    //     this.maximizeWidget(widgetId2maximize);
    //   }
    // }
  }

  factory(node) {
    return this.widgetFactory.factory(node.getConfig());
  }

  iconFactory(node) {
    // TODO move to newest flexlayout-react to add this functionality
    return this.tabsetIconFactory.factory(node.getConfig());
  }

  restoreWidget(widget: Widget) {
    const { model } = this;
    widget.panelName = widget.defaultPanel;
    const panelName = widget.panelName ;
    let tabset = model.getNodeById(panelName);
    if (tabset === undefined) {
      this.createTabSet(panelName);
    }
    this.moveWidget(widget);
  }

  moveWidget(widget) {
    const { model } = this;
    model.doAction(
      FlexLayout.Actions.moveNode(
        widget.id,
        widget.panelName,
        FlexLayout.DockLocation.CENTER,
        widget.pos
      )
    );
    // Resize of canvas and SVG images
    window.dispatchEvent(new Event("resize"));
  }
}

export function initLayoutManager(model, factory: WidgetFactory, iconFactory: TabsetIconFactory) {
  instance = new LayoutManager(model, factory, iconFactory);
  return instance;
}

export const getInstance = () => instance;
