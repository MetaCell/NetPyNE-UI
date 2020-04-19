import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';

import { WidgetStatus } from '../../constants';
import {
  HLS_WIDGETS, getPythonConsoleWidget, 
  MORPHOLOGY_WIDGET,PLOTS_WIDGETS
} from '../../redux/reducers/flexlayout'

import DrawerIcon from '../general/NetPyNEIcons'


// Avoid defining properties with css || inline style
const drawerOpenWidth = 200;
const drawerCloseWidth = 48;

const drawerCss = (entering, transitions, palette, spacing) => ({ 
  overflow: 'hidden',
  marginTop: spacing(1),
  marginBottom: spacing(1),
  marginLeft: spacing(1),
  width: props => props.width,
  flexShrink: 0,
  borderRight: 'none',
  position: 'relative',
  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: entering ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
  })
})

const useStyles = makeStyles(({ transitions, palette, spacing }) => ({
  openDrawer: drawerCss(true, transitions, palette, spacing),

  closeDrawer: drawerCss(false, transitions, palette, spacing),

  buttonContainer: { textAlign: 'end' },
  button: {
    color: 'white',
    marginBottom: spacing(1),
    marginRight: props => props.expand ? spacing(1) : 0,
  },
  text: { paddingLeft: spacing(1) },
  container: { 
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '100%'
  },
  
  selected: { color: palette.primary.main, paddingLeft: spacing(1) },
  unselected: { color: palette.common.white, paddingLeft: spacing(1) },
  icon: { color: 'inherit', minWidth: 'unset' }
}))

export default ({ widgets, newWidget, editMode, activateWidget }) => {
  const [expand, setExpand] = useState({ dark: !editMode })
  
  const classes = useStyles({ width: expand ? drawerOpenWidth : drawerCloseWidth, expand });

  function createFocusWidget (widgetId) {
    if (!widgets[widgetId]) {
      // pick from the list of available widgets
      let widget = ({ ...HLS_WIDGETS, pythonEdit: getPythonConsoleWidget(true) })[widgetId]
      if (!editMode) {
        widget = simulateModeWidget(widgetId)
      }
      
      newWidget({ path: widget.id, ...widget })
    } else {
      if (widgets[widgetId].status !== WidgetStatus.ACTIVE) {
        activateWidget(widgetId)
      }
    }
  }

  function simulateModeWidget (widgetId) {
    if (widgetId.includes('Plot')) {
      return PLOTS_WIDGETS[widgetId]
    }
    // pick from the list of available widgets
    return ({ D3Canvas: MORPHOLOGY_WIDGET, pythonExplore: getPythonConsoleWidget(false) })[widgetId]
  }


  function getMenu () {
    if (editMode) {
      const array = [...Object.values(HLS_WIDGETS), 
                     getPythonConsoleWidget(true)]
      return array
    } else {
      const array = [MORPHOLOGY_WIDGET,
                     ...Object.values(PLOTS_WIDGETS),
                     getPythonConsoleWidget(false)]

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
                onClick={() => createFocusWidget(id)}
              >
                <ListItemIcon className={classes.icon}>
                  <DrawerIcon widgetId={id} selected={!!widgets[id]}/>
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