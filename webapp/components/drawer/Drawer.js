import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { WidgetStatus } from '../layout/model';
import {
  EDIT_WIDGETS,
  DEFAULT_NETWORK_WIDGETS, TOP_PANEL,
} from '../../constants';

import DrawerIcon from '../general/NetPyNEIcons';
import useStyles from './useStyles';
import Tooltip from '../general/Tooltip';

const drawerOpenWidth = 'auto';
const drawerCloseWidth = 55;

const DrawerItem = ({
  id,
  name,
  widget,
  expanded,
  createOrFocusWidget,
  disabled,
  status,
  classes,
}) => (
  <Tooltip title={expanded ? '' : name} placement="right">
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
  </Tooltip>
);

export default ({
  newWidget,
  editMode,
  activateWidget,
  updateWidget,
}) => {
  const [expand, setExpand] = useState(false);

  const classes = useStyles({
    width: expand ? drawerOpenWidth : drawerCloseWidth,
    expand,
  });
  const layoutManager = require('../layout/LayoutManager')
    .getLayoutManagerInstance();

  function createOrFocusWidget (widgetId) {
    const widget = { ...layoutManager.getWidget(widgetId) };
    if (!widget) {
      const widgetConf = getNewWidgetConf(widgetId);
      newWidget({ path: widgetConf.id, ...widgetConf });
    } else if (widget.status === WidgetStatus.MINIMIZED) {
      updateBorderWidget(widgetId);
    } else {
      activateWidget(widgetId);
    }
  }

  // Move python widget from BORDER to a visible tabset
  function updateBorderWidget (widgetId) {
    const updatedWidget = { ...layoutManager.getWidget(widgetId) };
    updatedWidget.status = WidgetStatus.ACTIVE;
    updatedWidget.panelName = updatedWidget.defaultPanel || TOP_PANEL;
    updateWidget(updatedWidget);
  }

  function getNewWidgetConf (widgetId) {
    if (editMode) {
      // return a High Level Specification widget
      return EDIT_WIDGETS[widgetId];
    }

    // return either 3dcanvas or python console
    return DEFAULT_NETWORK_WIDGETS[widgetId];
  }

  function getMenu () {
    return layoutManager.getWidgets()
      .sort((w1, w2) => w1.pos - w2.pos);
  }

  const mapItem = ({
    name,
    id,
  }) => {
    const widget = layoutManager.getWidget(id);
    const status = layoutManager.getWidgetStatus(id);

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
    );
  };

  return (
    <Paper elevation={0} className={expand ? classes.openDrawer : classes.closeDrawer}>
      <div className={classes.container}>
        <Box p={2}>
          <List dense disablePadding>
            {getMenu()
              .map(mapItem)}
          </List>
        </Box>

        <div className={expand ? classes.buttonContainerOpen : classes.buttonContainerClosed}>
          <Tooltip title={expand ? 'Collapse' : 'Expand'}>
            <IconButton
              className={classes.button}
              size="medium"
              onClick={() => {
                setExpand(!expand);
                setTimeout(() => window.dispatchEvent(new Event('resize')), 400);
              }}
            >
              {expand ? <DrawerIcon name="arrow-left" fontSize="inherit" />
                : <DrawerIcon name="arrow-right" fontSize="inherit" />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Paper>
  );
};
