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
import * as General from '../../redux/actions/general';

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
import { TabsetPosition } from './model';
import { Tab } from '@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/view/Tab';

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

let instance: LayoutManager = null;

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
    widgets: Widget[] = null,
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
    if (widgets) {
      this.addWidgets(widgets);
    }
  }

  addWidget(widgetConfiguration: Widget) {
    if (this.getWidget(widgetConfiguration.id)) {
      return this.updateWidget(widgetConfiguration);
    }
    const { model } = this;
    let tabset = model.getNodeById(widgetConfiguration.panelName);
    if (tabset === undefined) {
      this.createTabSet(widgetConfiguration.panelName, widgetConfiguration.defaultPosition, widgetConfiguration.defaultWeight);
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
      if (panel.getId() != 'leftPanel' && panel.getChildren().length > 0) {
        renderValues.buttons.push(<div key={panel.getId()} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
          this.minimizeWidget(panel.getActiveNode().getId())
        }} />);
      }
    }
  }

  Component = (layoutManager: LayoutManager) => ({ classes }) => (
    <div className={classes.container}>
      <div className={classes.flexlayout}>
        <FlexLayout.Layout
          model={this.model}
          factory={this.factory}
          // iconFactory={layoutManager.iconFactory.bind(this)}
          onAction={action => layoutManager.onAction(action)}
          onRenderTab={(node, renderValues) => layoutManager.onRenderTabSet(node, renderValues)}
        />
      </div>
    </div>
  );

  getComponent = () => withStyles(styles)(this.Component(this));


  private createTabSet(tabsetID, position = TabsetPosition.RIGHT, weight = 50) {
    // In case the tabset doesn't exist
    const { model } = this;
    const rootNode = model.getNodeById("root");



    const tabset = new FlexLayout.TabSetNode(model, { id: tabsetID });
    tabset._setWeight(weight);
    let hrow = rootNode.getChildren().find(child => child.getType() === 'row');
    let hrowRowRow = null;
    switch (position) {
      case TabsetPosition.RIGHT:
        rootNode.getChildren().forEach(node => node._setWeight(100 - weight));
        rootNode._addChild(tabset);
        break;
      case TabsetPosition.LEFT:
        rootNode.getChildren().forEach(node => node._setWeight(100 - weight));
        rootNode._addChild(tabset, 0);
        break;
      case TabsetPosition.BOTTOM:
      case TabsetPosition.TOP: {
        if (!hrow) {
          hrow = new FlexLayout.RowNode(model, {});
          hrow._setWeight(100);

          hrowRowRow = new FlexLayout.RowNode(model, {});
          hrowRowRow._setWeight(100 - weight);
          hrow._addChild(hrowRowRow);
          rootNode.getChildren().forEach(child => {
            hrowRowRow._addChild(child);
          });
          rootNode._removeAll();
          rootNode._addChild(hrow);
        }

        if (position === TabsetPosition.BOTTOM) {
          hrow._addChild(tabset)
        } else {
          hrow._addChild(tabset, 0);
        }

        break;
      }

    }


    setTimeout(() => window.dispatchEvent(new Event("resize")), 1000);
  }

  exportSession(): { [id: string]: any } {
    const confs = {};
    const components = this.widgetFactory.getComponents();
    for (const wid in components) {
      confs[wid] = components[wid].exportSession();
    }
    return confs;
  }

  importWidgetSession(widgetId: string, conf: any) {
    const component = this.widgetFactory.getComponent(widgetId);
    if (component) {
      component.importSession(conf);
    } else {
      // The component may not be yet initialized when loading the session
      setTimeout(() => this.importWidgetSession(widgetId, conf), 100);
    }
  }

  importSession(confs: { [id: string]: any }): void {
    const imported = new Set();
    for (const wid in confs) {
      this.importWidgetSession(wid, confs[wid]);
      imported.add(wid);
    }

    // Some components may have a current status here but no state exported in the session file
    for (const wid in this.widgetFactory.getComponents()) {
      if (!imported.has(wid)) {
        this.importWidgetSession(wid, null);
      }
    }
  }

  middleware = (store) => (next) => (action) => {

    console.debug(action);
    let nextAction = true;
    let nextSetLayout = true;


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
        const widget = this.getWidget(action.data.id)
        widget.status = WidgetStatus.ACTIVE;
        this.updateWidget(widget);
        break;
      }
      case SET_WIDGETS: {
        const newWidgets: Map<string, Widget> = action.data;
        for (let widget of this.getWidgets()) {
          if (!newWidgets[widget.id]) {
            this.deleteWidget(widget);
          }
        }
        this.addWidgets(Object.values(newWidgets));
        break;

      }

      case SET_LAYOUT: {
        if (!isEqual(this.model.toJson(), action.data)) {
          this.model = FlexLayout.Model.fromJson(action.data);
        }
        break;
      }
      case General.IMPORT_APPLICATION_STATE: {
        const incomingState = action.data.redux.layout;
        this.model = FlexLayout.Model.fromJson(incomingState);
        this.importSession(action.data.sessions);

        nextSetLayout = false;
      }

      default: {
        nextSetLayout = false;
      }
    }

    if (nextAction) {
      next(action);
    }
    if (nextSetLayout) {
      next(setLayout(this.model.toJson()));
    }

  };

  private addWidgets(newWidgets: Array<Widget>) {
    let actives = [];
    for (let widget of newWidgets) {
      if (widget.status == WidgetStatus.ACTIVE) {
        actives.push(widget.id);
      }
      this.addWidget(widget);
    }

    for (const active of actives) {
      this.model.doAction(FlexLayout.Actions.selectTab(active));
    }

  }

  private deleteWidget(widget: any) {
    this.model.doAction(Actions.deleteTab(widget.id));
  }

  private getWidgets() {

    let nodes = [];
    this.model.visitNodes((node, level) => {
      // TODO access through public api. getConfig is hiding our data (using extraData maybe works)
      if ((node['_attributes'] as ExtendedNode).config) {
        nodes.push((node['_attributes'] as ExtendedNode).config);
      }
    });
    return nodes;
  }

  onAction(action) {
    const oldModel = this.model.toJson();
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
        this.model.doAction(action);
      }
    }
    if (defaultAction) {
      this.model.doAction(action);
    }


    const newModel = this.model.toJson();
    if (!isEqual(oldModel, newModel)) {
      this.dispatch(setLayout(newModel));
    }


    window.dispatchEvent(new Event("resize"));
  }

  private getWidget(id): Widget {
    const node = this.model.getNodeById(id);
    return node && node['_attributes'] ? (node['_attributes'] as ExtendedNode).config : null;
  }

  private minimizeWidget(widgetId) {

    var updatedWidget = { ...this.getWidget(widgetId) };
    if (updatedWidget === undefined) {
      return;
    }
    updatedWidget.status = WidgetStatus.MINIMIZED;
    updatedWidget.defaultPanel = updatedWidget.panelName;
    updatedWidget.panelName = MINIMIZED_PANEL;
    this.updateWidget(updatedWidget);
    // this.model.doAction(FlexLayout.Actions.moveNode(widgetId, "border_bottom", FlexLayout.DockLocation.CENTER, 0));
  }

  private updateWidget(widget: Widget) {
    const { model } = this;
    if (!widget) {
      debugger;
    }
    const previousWidget = this.getWidget(widget.id);
    if (previousWidget.status != widget.status) {
      if (previousWidget.status == WidgetStatus.MINIMIZED) {
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

  factory(node) {
    return this.widgetFactory.factory(node.getConfig());
  }

  iconFactory(node) {
    // TODO move to newest flexlayout-react to add this functionality
    return this.tabsetIconFactory.factory(node.getConfig());
  }

  private restoreWidget(widget: Widget) {
    const { model } = this;
    widget.panelName = widget.defaultPanel;
    const panelName = widget.panelName;
    let tabset = model.getNodeById(panelName);
    if (tabset === undefined) {
      this.createTabSet(panelName, widget.defaultPosition, widget.defaultWeight);
    }
    this.moveWidget(widget);
  }

  private moveWidget(widget) {
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

  getWidgetStatus(widgetId) {
    const { model } = this
    const parent = model.getNodeById(widgetId).getParent() as any;
    if (parent.getId() === "border_bottom") {
      return WidgetStatus.MINIMIZED
    }
    else {
      const selectedIndex = parent.getSelected()
      if (parent.getChildren()[selectedIndex].getId() === widgetId) {
        return WidgetStatus.ACTIVE
      }
      return WidgetStatus.HIDDEN
    }
  }
}

export function initLayoutManager(model, factory: WidgetFactory, widgets: Widget[], iconFactory: TabsetIconFactory) {
  instance = new LayoutManager(model, factory, widgets, iconFactory);
  return instance;
}

export const getLayoutManagerInstance = () => instance;