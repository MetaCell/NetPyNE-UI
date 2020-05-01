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

import { WidgetStatus } from '../layout/constants';
import {
  DEFAULT_HLS_WIDGETS, getPythonDefaultConsoleWidget, 
  DEFAULT_MORPHOLOGY_WIDGET,DEFAULT_PLOTS_WIDGETS
} from '../../constants';

import DrawerIcon from '../general/NetPyNEIcons'
import useStyles from './useStyles'


const drawerOpenWidth = 200;
const drawerCloseWidth = 48;


export default ({ widgets, newWidget, editMode, activateWidget, updateWidget }) => {
  const [expand, setExpand] = useState(false)
  
  const classes = useStyles({ width: expand ? drawerOpenWidth : drawerCloseWidth, expand });

  function createOrFocusWidget (widgetId) {
    if (!widgets[widgetId]) {
      const widgetConf = getNewWidgetConf(widgetId)
      newWidget({ path: widgetConf.id, ...widgetConf })
    } else {
      if (widgets[widgetId].status === WidgetStatus.BORDER) {
        updateBorderWidget(widgetId)
      } else if (widgets[widgetId].status !== WidgetStatus.ACTIVE) {
        activateWidget(widgetId)
      }
    }
  }

  // Move python widget from BORDER to a visible tabset
  function updateBorderWidget (widgetId) {
    const updatedWidget = { ...widgets[widgetId] }
    updatedWidget.status = WidgetStatus.ACTIVE
    updatedWidget.panelName = getPythonDefaultConsoleWidget(editMode).panelName
    updateWidget(updatedWidget)
  }

  function getNewWidgetConf (widgetId) {
    if (editMode) {
      // return a High Level Specification widget
      return ({ ...DEFAULT_HLS_WIDGETS, pythonEdit: getPythonDefaultConsoleWidget(true) })[widgetId]
    }
    
    if (widgetId.includes('Plot')) {
      // return a plot widget
      return DEFAULT_PLOTS_WIDGETS[widgetId]
    }
    // return either 3dcanvas or python console
    return ({ D3Canvas: DEFAULT_MORPHOLOGY_WIDGET, pythonExplore: getPythonDefaultConsoleWidget(false) })[widgetId]
  }


  function getMenu () {
    if (editMode) {
      const array = [...Object.values(DEFAULT_HLS_WIDGETS), 
                     getPythonDefaultConsoleWidget(true)]
      return array
    } else {
      const array = [DEFAULT_MORPHOLOGY_WIDGET,
                     ...Object.values(DEFAULT_PLOTS_WIDGETS),
                     getPythonDefaultConsoleWidget(false)]

      return array
    }
    
  }
  
  return (
    <Paper className={expand ? classes.openDrawer : classes.closeDrawer}>
      <div className={classes.container}>
        <div >
          <List dense>
            {getMenu().map(({ name, id }) => (
              <ListItem 
                button
                key={name}
                dense
                disableGutters
                className={widgets[id] ? classes.selected : classes.unselected}
                onClick={() => createOrFocusWidget(id)}
              >
                <ListItemIcon className={classes.icon}>
                  <DrawerIcon widgetId={id} selected={!!widgets[id] && widgets[id].status !== WidgetStatus.BORDER}/>
                </ListItemIcon>
                <ListItemText className={classes.text}>
                  <Typography noWrap>{name}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
        <div></div>
          
        <div className={classes.buttonContainer}>
          <IconButton
            className={classes.button}
            onClick={() => {
              setExpand(!expand)
              setTimeout(() => window.dispatchEvent(new Event('resize')), 400)
            }}
          >
            {expand ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </div>
      </div>
    </Paper>
  )
}