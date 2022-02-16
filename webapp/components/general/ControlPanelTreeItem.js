import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Visibility from '@material-ui/icons/Visibility';
import ColorLens from '@material-ui/icons/ColorLens';
import Shuffle from '@material-ui/icons/Shuffle';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { experimentLabelColor } from '../../theme';
import { changeInstanceColor } from '../../redux/actions/general';

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
  const dispatch = useDispatch();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [isHoveredOver, setIsHoveredOver] = React.useState(false);
  const [color, setColor] = React.useState('#ff0000');
  const instances = useSelector((state) => state.general.instances);

  const handleColorSelection = (color, event, nodeId) => {
    const newInstances = instances.filter((instance) => !(instance.instancePath.startsWith(nodeId)));
    newInstances.push({
      instancePath: nodeId,
      color: {
        r: color.rgb.r / 255,
        g: color.rgb.g / 255,
        b: color.rgb.b / 255,
        a: color.rgb.a,
      },
    });
    dispatch(changeInstanceColor(newInstances));
    console.log(color);
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
      onLabelClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
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
          <Grid item xs={4}><Typography onClick={() => onNodeSelect(nodeId)}>{label}</Typography></Grid>
          <Grid item xs={4} justifyContent="center"><Typography>{type}</Typography></Grid>
          <Grid item xs={4} justifyContent="flex-end" className={classes.controls}>
            {isHoveredOver
              ? (
                <>

                  <IconButton onClick={(event) => onVisibilityClick(event, nodeId)}><Visibility /></IconButton>
                  <IconButton onClick={generateRandomColor}><Shuffle /></IconButton>
                  <IconButton onClick={() => setShowColorPicker(true)}><ColorLens /></IconButton>
                  {
              showColorPicker
                ? (
                  <Box
                    onMouseLeave={() => setShowColorPicker(false)}
                  >
                    <ChromePicker
                      className={classes.colorPicker}
                      color={color}
                      onChangeComplete={(color, event) => handleColorSelection(color, event, nodeId)}
                    />
                  </Box>
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
