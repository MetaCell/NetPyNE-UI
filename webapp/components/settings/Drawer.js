import React, { useState } from 'react'


import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';

import { WidgetStatus } from '../layout/model';
import {
  EDIT_WIDGETS, getPythonDefaultConsoleWidget, 
  DEFAULT_NETWORK_WIDGETS, TOP_PANEL
} from '../../constants';

import DrawerIcon from '../general/NetPyNEIcons';
import useStyles from './useStyles';
import Tooltip from '../general/Tooltip'

const drawerOpenWidth = 160;
const drawerCloseWidth = 44;


const DrawerItem = ({ id, name, widget, expanded, createOrFocusWidget, disabled, status, classes }) => (
  <Tooltip title={expanded ? "" : name} placement="right" >
    <div>
      <ListItem
        button
        key={id}
        dense
        disableGutters
        disabled={disabled}
        className={widget ? classes.selected : classes.unselected}
        onClick={() => createOrFocusWidget(id)}
      >
        <ListItemIcon className={classes.icon}>
          <DrawerIcon 
            name={id} 
            selected={status !== WidgetStatus.MINIMIZED} 
            disabled={status !== WidgetStatus.ACTIVE}
            highlight={status === WidgetStatus.ACTIVE}
          />
        </ListItemIcon>
        <ListItemText className={classes.text}>
          <Typography noWrap>{name}</Typography>
        </ListItemText>
      </ListItem>
    </div>
    
  </Tooltip>
)

export default ({ newWidget, editMode, activateWidget, updateWidget }) => {
  const [expand, setExpand] = useState(false)
  
  const classes = useStyles({ width: expand ? drawerOpenWidth : drawerCloseWidth, expand });
  const layoutManager = require('../layout/LayoutManager').getLayoutManagerInstance();

  function createOrFocusWidget (widgetId) {
    const widget = { ...layoutManager.getWidget(widgetId) };
    if (!widget) {
      const widgetConf = getNewWidgetConf(widgetId)
      newWidget({ path: widgetConf.id, ...widgetConf })
    } else {
      if (widget.status === WidgetStatus.MINIMIZED) {
        updateBorderWidget(widgetId)
      } else {
        activateWidget(widgetId)
      }
    }
  }

  // Move python widget from BORDER to a visible tabset
  function updateBorderWidget (widgetId) {
    const updatedWidget = { ...layoutManager.getWidget(widgetId) }
    updatedWidget.status = WidgetStatus.ACTIVE
    updatedWidget.panelName = updatedWidget.defaultPanel || TOP_PANEL;
    updateWidget(updatedWidget)
  }

  function getNewWidgetConf (widgetId) {
    if (editMode) {
      // return a High Level Specification widget
      return EDIT_WIDGETS[widgetId]
    }
    
    // return either 3dcanvas or python console
    return DEFAULT_NETWORK_WIDGETS[widgetId]
  }


  function getMenu () {
    return layoutManager.getWidgets().sort((w1, w2) => w1.pos - w2.pos);
  }
  
  const mapItem = ({ name, id }) => {
    const widget = layoutManager.getWidget(id);
    let visible = false
    const status = layoutManager.getWidgetStatus(id)
    
    return (
      <DrawerItem 
        key={id}
        id={id}
        name={name}
        widget={widget}
        disabled={widget.disabled}
        expanded={expand}
        classes={classes}
        createOrFocusWidget={createOrFocusWidget}
        status={status}
      />
      
    )
    
  };
  
  return (
    <Paper elevation={0} className={expand ? classes.openDrawer : classes.closeDrawer}>
      <div className={classes.container}>
        <div >
          <List dense>
            {getMenu().map(mapItem)}
          </List>
        </div>

        <div/>

        <div className={classes.buttonContainer}>
          <Tooltip title={expand ? "Collapse" : "Expand"}>  
            <IconButton
              className={classes.button}
              size="small"
              onClick={() => {
                setExpand(!expand)
                setTimeout(() => window.dispatchEvent(new Event('resize')), 400)
              }}
            >
              {expand ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
            </IconButton>
          </Tooltip>  
        </div>
        
        
      </div>
    </Paper>
  )
}