import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Visibility from '@material-ui/icons/Visibility';
import ColorLens from '@material-ui/icons/ColorLens';
import Shuffle from '@material-ui/icons/Shuffle';
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

  const handleColorSelection = (color, event, nodeId) => {
    setColor(color.hex);
  };

  const generateRandomColor = () => {
    const randomColor = {
      r: parseFloat((Math.random() * 1.00).toFixed(2)),
      g: parseFloat((Math.random() * 1.00).toFixed(2)),
      b: parseFloat((Math.random() * 1.00).toFixed(2)),
      a: 1,
    };
    setColor(randomColor);
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
          onMouseLeave={() => { setIsHoveredOver(false); setShowColorPicker(false); }}
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
                  <IconButton onClick={generateRandomColor}><Shuffle /></IconButton>
                  <IconButton onClick={() => setShowColorPicker(!showColorPicker)}><ColorLens /></IconButton>
                  {
              showColorPicker
                ? (
                  <ChromePicker
                    className={classes.colorPicker}
                    color={color}
                    onChangeComplete={(e, color) => handleColorSelection(e, color, nodeId)}
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
