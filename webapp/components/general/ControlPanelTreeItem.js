import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Visibility from '@material-ui/icons/Visibility';
import ColorLens from '@material-ui/icons/ColorLens';

const useStyles = makeStyles(() => ({
  networkItem: {
    '&:hover': {
      '& .MuiSvgIcon-root': {
        display: 'block',
      },
    },
  },
}));

const ControlPanelTreeItem = (props) => {
  const classes = useStyles();
  const {
    label,
    type,
    nodeId,
    onNodeSelect,
    onVisibilityClick,
    onColorClick,
    children,
    ...other
  } = props;

  return (
    <TreeItem
      nodeId={nodeId}
      label={(
        <Box className={classes.networkItem} display="flex" flexDirection="row" justifyContent="space-between">
          <Typography>{label}</Typography>
          <Typography>{type}</Typography>
          <Box display="none">
            <IconButton onClick={(event) => onVisibilityClick(event, nodeId)}><Visibility /></IconButton>
            <IconButton onClick={(event) => onColorClick(event, nodeId)}><ColorLens /></IconButton>
          </Box>
        </Box>
        )}
      onClick={(event) => onNodeSelect(event, nodeId)}
    >
      {children}
    </TreeItem>
  );
};

export default ControlPanelTreeItem;
