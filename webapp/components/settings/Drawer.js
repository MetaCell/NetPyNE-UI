import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';

import AdjustIcon from '@material-ui/icons/Adjust';
import {
  HLS_WIDGETS, PYTHON_CONSOLE_WIDGET, 
  FLEXLAYOUT_DEFAULT_STATE, MORPHOLOGY_WIDGET,
  PLOTS_WIDGETS
} from '../../redux/reducers/flexlayout'


const drawerOpenWidth = 200;
const drawerCloseWidth = 54;

const drawerCss = (entering, transitions, palette) => ({ 
  overflow: 'hidden',
  width: props => props.width,
  flexShrink: 0,
  borderRight: 'none',
  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: entering ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
  })
})

const useStyles = makeStyles(({ transitions, palette }) => ({
  openDrawer: drawerCss(true, transitions, palette),

  closeDrawer: drawerCss(false, transitions, palette),

  colapse: {
    color: 'white',
    position: 'absolute',
    bottom: 0,
    right: 2
  },
  paper: { backgroundColor: palette.grey['900'] },
  
  selected: { height: 48, color: palette.primary.main },
  unselected: { height: 48, color: palette.common.white },
  noColor: { color: 'inherit' }
}))

export default ({ widgets, newWidget, editMode }) => {
  const [expand, setExpand] = useState({ dark: !editMode })
  
  const classes = useStyles({ width: expand ? drawerOpenWidth : drawerCloseWidth });

  function createWidget (widgetId) {
    if (!widgets[widgetId]) {
      let widget = HLS_WIDGETS[widgetId]
      if (!editMode) {
        widget = simulateModeWidget(widgetId)
      }
      
      newWidget({ path: widget.id, ...widget })
    }
  }

  function simulateModeWidget (widgetId) {
    if (widgetId.includes('Plot')) {
      return PLOTS_WIDGETS[widgetId]
    }
    return MORPHOLOGY_WIDGET
  }


  function getMenu () {
    if (editMode) {
      return Object.values({ ...HLS_WIDGETS, python: PYTHON_CONSOLE_WIDGET })
    } else {
      return Object.values({ 
        ...FLEXLAYOUT_DEFAULT_STATE.widgetsBackground,
        ...PLOTS_WIDGETS,
        python: PYTHON_CONSOLE_WIDGET 
      })
    }
    
  }
  
  return (
    <div>
      <Drawer
        variant="permanent"
        className={expand ? classes.openDrawer : classes.closeDrawer}
        classes={{ paper: expand ? classes.openDrawer : classes.closeDrawer }}
      >
        <div>
          <Toolbar/>
          <List dense>
            {getMenu().map(({ name, id }) => (
              <ListItem 
                button
                key={name}
                className={widgets[id] ? classes.selected : classes.unselected}
                onClick={() => createWidget(id)}
              >
                <ListItemIcon className={classes.noColor}>
                  <AdjustIcon/>
                </ListItemIcon>
                <ListItemText>
                  <Typography noWrap>{name}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          
          
          <IconButton
            className={classes.colapse}
            onClick={() => {
              setExpand(!expand)
              setTimeout(() => window.dispatchEvent(new Event('resize')), 400)
              // pepe()
            }}
          >
            {expand ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>

          
        </div>
        
      </Drawer>
    </div>
  )
  
}

const pepe = () => {
  window.expansionTransit = {
    timer: setInterval(() => {
      window.dispatchEvent(new Event('resize'))
      console.log(window.expansionTransit.count)
      if (window.expansionTransit.count > 0) {
        window.expansionTransit.count -= 1
      } else {
        clearInterval(window.expansionTransit.timer)
        console.log('clear')
      }
      
    }, 150), 
    count: 1
  }
}