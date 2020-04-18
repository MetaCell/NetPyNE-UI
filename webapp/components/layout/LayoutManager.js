import React, { Component } from 'react';
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from '@geppettoengine/geppetto-client/js/components/interface/flexLayout2/src/model/Actions';


import { WidgetStatus } from '../../constants';
import { isEqual } from '../../Utils';
import WidgetFactory from './WidgetFactory';
import TabsetIconFactory from './TabsetIconFactory'
import defaultLayoutConfiguration from './layoutConf.json';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles'
import onAction from './OnLayoutAction';

/**
 * Transforms a widget configutation into a flexlayout node descriptor
 */
function widget2Node (configuration) {
  const { id, name, component, instancePath, status, panelName, enableClose = true, ...others } = configuration;
  return {
    id,
    name,
    status,
    component,
    type: "tab",
    enableRename: false,
    enableClose,
    // attr defined inside config, will also be available from within flexlayout nodes.  For example:  node.getNodeById(id).getConfig()
    config: configuration ,
    ...others
  };
}

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
    const layout = this.props.layout ? this.props.layout : defaultLayoutConfiguration;
    this.destroyWidget = this.props.destroyWidget ? this.props.destroyWidget : () => console.debug('destroyWidget not defined');
    this.activateWidget = this.props.activateWidget ? this.props.activateWidget : () => console.debug('activateWidget not defined');
    this.maximizeWidget = this.props.maximizeWidget ? this.props.maximizeWidget : () => console.debug('maximizeWidget not defined');
    this.minimizeWidget = this.props.minimizeWidget ? this.props.minimizeWidget : () => console.debug('minimizeWidget not defined');
    

    this.widgetFactory = this.props.widgetFactory ? this.props.widgetFactory : new WidgetFactory();
    this.tabsetIconFactory = this.props.TabsetIconFactory ? this.props.TabsetIconFactory : new TabsetIconFactory();

    this.cacheModels = { 
      edit: FlexLayout.Model.fromJson(layout), 
      simulate: FlexLayout.Model.fromJson(layout) 
    }
  }


  componentDidMount () {
    const { widgets } = this.props;
    this.addWidgets(Object.values(widgets));
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.editMode !== this.props.editMode) {
      return 
    }

    const { widgets } = this.props;
    const oldWidgets = prevProps.widgets;
    const newWidgets = this.findNewWidgets(widgets, oldWidgets);
    if (newWidgets.length > 0) {
      this.addWidgets(newWidgets);
    }
    
    const updatedWidgets = this.findUpdatedWidgets(widgets, oldWidgets);
    if (updatedWidgets) {
      this.updateWidgets(updatedWidgets);
    }

    const deletedWidgets = this.findDeletedWidgets(widgets, oldWidgets);

    if (deletedWidgets) {
      this.deleteWidgets(deletedWidgets);
    }
  }
 
  getModel () {
    if (this.props.editMode) {
      return this.cacheModels.edit
    }
    return this.cacheModels.simulate
  }
  
  addWidgets (widgets) {
    const model = this.getModel()
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
    const model = this.getModel()
    for (let widget of widgets) {
      model.doAction(FlexLayout.Actions.deleteTab(widget.id));
    }
  }

  addWidget (widgetConfiguration) {
    const model = this.getModel()
    let tabset = model.getNodeById(widgetConfiguration.panelName)
    if (tabset === undefined) {
      this.createTabSet(widgetConfiguration.panelName)
    }
    this.refs.layout.addTabToTabSet(widgetConfiguration.panelName, widget2Node(widgetConfiguration))
  }
  
  createTabSet (tabsetID) {
    // In case the tabset doesn't exist
    const model = this.getModel()
    const rootNode = model.getNodeById("root")

    const pyPanel = model.getNodeById('consolePanel')
    if (pyPanel) {
      pyPanel._setWeight(20)
    }

    let hrow = new FlexLayout.RowNode(model, {});
    hrow._setWeight(100)

    const tabset = new FlexLayout.TabSetNode(model, { id: tabsetID });
    tabset._setWeight(80)
    
    hrow._addChild(tabset)
    
    rootNode.getChildren().forEach(child => hrow._addChild(child))
    rootNode._removeAll()
    rootNode._addChild(hrow, 0);
    if (!this.props.editMode && tabsetID === 'plotPanel') {
      // We need to resize Geppetto 3D canvas to new panel sizes
      setTimeout(() => window.dispatchEvent(new Event('resize')), 1000)
      
    }
  }

  updateWidgets (widgets) {
    const model = this.getModel()
    for (let widget of widgets) {

      this.updateWidget(widget);
   
      // This updates plotly.js plots to new panel sizes
      if (widget.status == WidgetStatus.ACTIVE) {
        model.doAction(FlexLayout.Actions.selectTab(widget.id));
      }
      
    }
    // window.dispatchEvent(new Event('resize'));
  }

  updateWidget (widget) {
    const model = this.getModel()
    if (widget) {
      this.widgetFactory.updateWidget(widget);
      model.doAction(Actions.updateNodeAttributes(widget.id, widget2Node(widget))); 
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
  

  clickOnBordersAction (node) {
    const model = this.getModel()
    let tabset = model.getNodeById('consolePanel')
    if (tabset === undefined) {
      this.createTabSet('consolePanel')
    }
    model.doAction(FlexLayout.Actions.moveNode(node.getId(), 'consolePanel', FlexLayout.DockLocation.CENTER, 0));
  }

  onRenderTab (node,renderValues) {
    renderValues.leading = <Icon className={node.getConfig().icon}/>
  }
  render () {
    const { classes, widgets } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.spacer}/>
        <div className={classes.flexlayout}>
          <FlexLayout.Layout
            ref="layout"
            model={this.getModel()}
            factory={this.factory.bind(this)}
            iconFactory={this.iconFactory.bind(this)}
            onAction={action => onAction(action, widgets, this.getModel(), this.props.updateWidget, this.activateWidget, this.destroyWidget, this.maximizeWidget, this.minimizeWidget)}
            clickOnBordersAction={node => this.clickOnBordersAction(node)}
            onRenderTab={(node,renderValues) => this.onRenderTab(node,renderValues)}
          />
        </div>
        <div className={classes.spacer}/>
      </div>
    )
  }
}


export default withStyles(styles)(LayoutManager)