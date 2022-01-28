import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Visibility from '@material-ui/icons/Visibility';
import ColorLens from '@material-ui/icons/ColorLens';
import { ChromePicker } from 'react-color';
import { experimentLabelColor } from '../../theme';

const useStyles = makeStyles((theme) => ({
  networkItem: {
    paddingTop: '2px',
    paddingBottom: '2px',
  },
  controls: {
    '& .MuiIconButton-root': {
      padding: 0,
      marginLeft: '0.5rem',
      color: experimentLabelColor,
      '&:hover': {
        color: 'white',
      },
    },
  },
  colorPicker: {
    position: 'absolute',
    zIndex: 1000,
    right: 0,
  },
}));

const ControlPanelTreeItem = (props) => {
  const classes = useStyles();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [isHoveredOver, setIsHoveredOver] = React.useState(false);
  const [color, setColor] = React.useState('#ff0000');

  const handleColorSelection = (color) => {
    setColor(color.hex);
  };

  const {
    label,
    type,
    nodeId,
    onNodeSelect,
    onVisibilityClick,
    children,
    ...other
  } = props;

  return (
    <TreeItem
      nodeId={nodeId}
      label={(
        <Grid
          container
          className={classes.networkItem}
          onMouseEnter={() => setIsHoveredOver(true)}
          onMouseLeave={() => setIsHoveredOver(false)}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Grid item xs={4}><Typography onClick={(event) => onNodeSelect(event, nodeId)}>{label}</Typography></Grid>
          <Grid item xs={4} justifyContent="center"><Typography>{type}</Typography></Grid>
          <Grid item xs={4} justifyContent="flex-end" className={classes.controls}>
            {isHoveredOver
              ? (
                <>

                  <IconButton onClick={(event) => onVisibilityClick(event, nodeId)}><Visibility /></IconButton>
                  <IconButton onClick={() => setShowColorPicker(!showColorPicker)}><ColorLens /></IconButton>
                  {
              showColorPicker
                ? (
                  <ChromePicker
                    className={classes.colorPicker}
                    color={color}
                    onChangeComplete={handleColorSelection}
                  />
                ) : null
            }

                </>
              )
              : null}
          </Grid>
        </Grid>
        )}
    >
      {children}
    </TreeItem>
  );
};

export default ControlPanelTreeItem;
