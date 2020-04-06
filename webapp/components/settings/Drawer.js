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
  FLEXLAYOUT_DEFAULT_STATE, MORPHOLOGY_WIDGET 
} from '../../redux/reducers/flexlayout'


const drawerOpenWidth = 200;
const drawerCloseWidth = 54;

const createTransition = (entering, transitions) => (
  transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: entering ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
  })
)

const drawerCss = (entering, transitions, palette) => ({ 
  overflow: 'hidden',
  width: props => props.width,
  flexShrink: 0,
  backgroundColor: props => props.dark ? palette.grey[900] : palette.grey[800],
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
  
  selected: { height: 60, color: palette.primary.main },
  unselected: { height: 60, color: palette.common.white },
  noColor: { color: 'inherit' }
}))

export default ({ widgets, newWidget, editMode }) => {
  const [expand, setExpand] = useState({ dark: !editMode })
  
  const classes = useStyles({ dark: !editMode, width: expand ? drawerOpenWidth : drawerCloseWidth });

  function createWidget (widgetId) {
    if (!widgets[widgetId]) {
      let widget = HLS_WIDGETS[widgetId]
      if (!editMode) {
        widget = MORPHOLOGY_WIDGET
      }
      
      newWidget({ path: widget.id, ...widget })
    }
  }

  function getMenu () {
    if (editMode) {
      return Object.values({ ...HLS_WIDGETS, python: PYTHON_CONSOLE_WIDGET })
    } else {
      return Object.values({ ...FLEXLAYOUT_DEFAULT_STATE.widgetsBackground, python: PYTHON_CONSOLE_WIDGET })
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
          <List>
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
            onClick={() => setExpand(!expand)}
          >
            {expand ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>

          
        </div>
        
      </Drawer>
    </div>
  )
  
}
