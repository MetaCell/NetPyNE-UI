import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import {
  experimentLabelColor,
  bgDarker,
  bgLight,
  radius,
} from '../../theme';
import { RandomColorLensIcon, ColorLensIcon, TriangleIcon } from './NetPyNEIcons';
import { changeInstanceColor } from '../../redux/actions/general';

const useStyles = makeStyles((theme) => ({
  networkItem: {
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '8px',
    paddingRight: '8px',
    borderRadius: radius,
    '&:hover': {
      backgroundColor: '#333333',
    },
  },
  controls: {
    '& .MuiIconButton-root': {
      padding: '0 !important',
      marginLeft: '0.5rem',
      color: experimentLabelColor,
      '&:hover': {
        color: 'white',
      },
    },
  },
  colorPickerBox: {
    position: 'absolute',
    top: '1rem',
  },
  triangleIcon: {
    marginBottom: '-7px',
    color: bgDarker,
  },
  colorPicker: {
    position: 'absolute',
    zIndex: 1000,
    right: 0,
    backgroundColor: `${bgDarker} !important`,
    padding: '0.2rem',
    '& label': {
      color: '#ffffff !important',
    },
    '& input': {
      backgroundColor: `${bgLight} !important`,
      color: '#ffffff !important',
      boxShadow: 'none !important',
    },
    '& svg': {
      fill: '#ffffff !important',
    },
    '& svg:hover': {
      background: 'transparent !important',
    },
  },
}));

const ControlPanelTreeItem = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [isHoveredOver, setIsHoveredOver] = React.useState(false);
  const [color, setColor] = React.useState({
    g: 0.50, b: 0.60, r: 1, a: 1,
  });
  const [visibility, setVisibility] = React.useState(true);
  const instances = useSelector((state) => state.general.instances);

  const handleColorSelection = (_color, event, nodeId) => {
    const newInstances = instances.filter((instance) => !(instance.instancePath.startsWith(nodeId)));
    newInstances.push({
      instancePath: nodeId,
      color: {
        r: _color.rgb.r / 255,
        g: _color.rgb.g / 255,
        b: _color.rgb.b / 255,
        a: _color.rgb.a,
      },
    });
    dispatch(changeInstanceColor(newInstances));
    setColor(_color.rgb);
  };

  const generateRandomColor = (event, nodeId) => {
    const newInstances = instances.filter((instance) => !(instance.instancePath.startsWith(nodeId)));
    const randomColor = {
      r: parseFloat((Math.random() * 255).toFixed(2)),
      g: parseFloat((Math.random() * 255).toFixed(2)),
      b: parseFloat((Math.random() * 255).toFixed(2)),
      a: 1,
    };

    newInstances.push({
      instancePath: nodeId,
      color: {
        r: randomColor.r / 255,
        g: randomColor.g / 255,
        b: randomColor.b / 255,
        a: randomColor.a,
      },
    });
    dispatch(changeInstanceColor(newInstances));
    setColor(randomColor);
  };

  const changeVisibility = (event, nodeId) => {
    const copiedInstances = instances.slice();
    let oldIndex = null;
    let oldInstance = copiedInstances.find((pInstance, index) => {
      if (pInstance.instancePath === nodeId) {
        oldIndex = index;
        return true;
      }
      return false;
    });
    if (!oldInstance) {
      oldInstance = {
        instancePath: nodeId,
        visibility: false,
      };
    } else {
      copiedInstances.splice(oldIndex, 1);
      oldInstance.visibility = (oldInstance?.visibility !== undefined) ? !oldInstance.visibility : false;
    }

    const newInstances = instances.map((instance) => {
      if (!(instance.instancePath.startsWith(nodeId))) {
        return instance;
      }
      const newInstance = instance;
      newInstance.visibility = oldInstance.visibility;
      return newInstance;
    });

    newInstances.push(oldInstance);

    dispatch(changeInstanceColor(newInstances));
    setVisibility(oldInstance.visibility);
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

                  <IconButton onClick={(event) => changeVisibility(event, nodeId)}>
                    { visibility ? <Visibility /> : <VisibilityOff /> }
                  </IconButton>
                  <IconButton onClick={(event) => generateRandomColor(event, nodeId)}>
                    <RandomColorLensIcon />
                  </IconButton>
                  <IconButton onClick={() => setShowColorPicker(true)}><ColorLensIcon /></IconButton>
                  {
              showColorPicker
                ? (
                  <Box
                    className={classes.colorPickerBox}
                    onMouseLeave={() => setShowColorPicker(false)}
                  >
                    <TriangleIcon className={classes.triangleIcon} />
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
