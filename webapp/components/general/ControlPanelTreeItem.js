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
import {
  RandomColorLensIcon,
  SquareIcon,
} from './NetPyNEIcons';
import { changeInstanceColor } from '../../redux/actions/general';

const useStyles = makeStyles((theme) => ({
  treeItem: {
    '& .MuiTreeItem-iconContainer': {
      marginRight: '5px',
    },
    '& .MuiTreeItem-label': {
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingRight: '8px',
      borderRadius: radius,
      '&:hover': {
        backgroundColor: '#333333',
      },
    },
  },
  leafTreeItem: {
    '& .MuiTreeItem-iconContainer': {
      width: 0,
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
    top: '1.6rem',
    right: '0',
    height: '3rem',
  },
  triangleIcon: {
    marginBottom: '-7px',
    color: bgDarker,
  },
  colorPicker: {
    position: 'absolute',
    zIndex: 1000,
    right: '0',
    backgroundColor: `${bgDarker} !important`,
    padding: '0.2rem',
    '& label': {
      color: '#ffffff !important',
      fontFamily: 'Roboto, arial',
      fontSize: '11px',
      fontWeight: 400,
    },
    '& input': {
      backgroundColor: `${bgLight} !important`,
      color: '#ffffff !important',
      boxShadow: 'none !important',
      fontFamily: 'Roboto, arial',
      fontSize: '11px',
      fontWeight: 400,
    },
    '& svg': {
      fill: '#ffffff !important',
    },
    '& svg:hover': {
      background: 'transparent !important',
    },
    '& .hue-horizontal': {
      borderRadius: '10px',
    },
    '& :nth-child(2)': {
      '& :nth-child(1)': {
        '& :nth-child(2)': {
          '& :nth-child(2)': {
            '& :nth-child(1)': {
              '& :nth-child(2)': {
                borderRadius: '10px',
              },
            },
          },
        },
      },
    },
  },
  activeColorPicker: {
    '& path': {
      fill: '#ffffff',
    },
  },
}));

const ControlPanelTreeItem = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [isHoveredOver, setIsHoveredOver] = React.useState(false);
  const [visibility, setVisibility] = React.useState(true);
  const instances = useSelector((state) => state.general.instances);
  const defaultColor = {
    g: 0.50,
    b: 0.60,
    r: 1,
    a: 1,
    hex: "#FF7F99"
  };

  const getColor = (nodeId) => {
    const insts = instances.filter((instance) => instance.instancePath === nodeId);
    const hasChildren = instances.some((instance) => instance.instancePath.startsWith(nodeId) && instance.instancePath !== nodeId);
    if (props.children.length === 0 && insts.length > 0 && "color" in insts[0]) {
      return insts[0].color
    }
    // we check if all children have the same color
    const children = instances.filter((instance) => instance.instancePath.startsWith(nodeId) && instance.instancePath !== nodeId);
    if (children.length === 0) {
      return defaultColor;
    }
    const color = children[0].color;
    if (children.every(x => x.color && x.color.hex === color.hex)) {
      return color
    }
    return { hex: "#989898" }
  }

  const randomColor = () => {
    const [r, g, b] = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
    return {
      r: parseFloat(r.toFixed(2)),
      g: parseFloat(g.toFixed(2)),
      b: parseFloat(b.toFixed(2)),
      a: 1,
      hex: "#" + (r >> 0).toString(16) + (g >> 0).toString(16) + (b >> 0).toString(16)
    }
  }

  const translateColor = (_color) => {
     return {
        r: _color.r / 255,
        g: _color.g / 255,
        b: _color.b / 255,
        a: _color.a,
        hex: _color.hex
      }
  }

  const collectAllChildren = (instance) => {
    const children = [...instance.getChildren()]
    children.forEach(child => children.push(...collectAllChildren(child)))
    return children
  }

  const handleLeafColorChange = (event, nodeId, colorGenerator) => {
    const updateInstances = instances.filter((instance) => !instance.instancePath.startsWith(nodeId));
    updateInstances.push({
      instancePath: nodeId,
      color: translateColor(colorGenerator())
    });
    dispatch(changeInstanceColor(updateInstances));
  }

  const handleContainerColorChange = (event, nodeId, colorGenerator) => {
    event.stopPropagation();
    event.preventDefault();

    const childrenPaths = collectAllChildren(window.Instances.getInstance(nodeId))
                            .filter((instance) => !instance.getChildren() || instance.getChildren().length === 0)
                            .map((instance) => instance.getInstancePath());
    const children = childrenPaths.filter((path) => path.startsWith(nodeId));
    const updateInstances = instances.filter((instance) => {
      let condition = true;
      children.forEach((child) => {
        if (instance.instancePath.startsWith(child)) {
          condition = false;
        }
      });
      return condition;
    });
    children.forEach((child) => {
      updateInstances.push({
        instancePath: child,
        color: translateColor(colorGenerator())
      });
    });
    dispatch(changeInstanceColor(updateInstances));
  }

  const handleColorChange = (event, nodeId, colorGenerator) => {
    if (props.children.length === 0) {
      handleLeafColorChange(event, nodeId, colorGenerator);
      return
    }
    handleContainerColorChange(event, nodeId, colorGenerator);
  }

  const changeVisibility = (event, nodeId) => {
    event.stopPropagation();
    event.preventDefault();
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
    disableRandom,
    ...other
  } = props;

  return (
    <TreeItem
      className={`${classes.treeItem} ${children?.length === 0 ? classes.leafTreeItem : ''}`}
      nodeId={nodeId}
      label={(
        <Grid
          container
          onMouseEnter={() => setIsHoveredOver(true)}
          onMouseLeave={() => { setIsHoveredOver(false); setShowColorPicker(false) }}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >

          <Grid item xs={4}>
            <Typography onClick={(event) => {
              onNodeSelect(nodeId);
              event.stopPropagation();
              event.preventDefault();
            }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid item xs={4} justifyContent="center"><Typography>{type}</Typography></Grid>
          <Grid item xs={4} justifyContent="flex-end" className={classes.controls}>
            {isHoveredOver
              ? (
                <>
                  <IconButton onClick={(event) => changeVisibility(event, nodeId)}>
                    { visibility ? <Visibility style={{ marginRight: '0.5rem' }} /> : <VisibilityOff style={{ marginRight: '0.5rem' }} /> }
                  </IconButton>
                  <IconButton disabled={disableRandom} onClick={(event) => handleColorChange(event, nodeId, randomColor)}>
                      <RandomColorLensIcon style={{ marginRight: '0.5rem' }} />
                  </IconButton>
                </>
              )
              : null}
              <IconButton onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setShowColorPicker(true)
              }}>
                <SquareIcon fillColor={getColor(nodeId).hex}/>

              </IconButton>
                {showColorPicker && isHoveredOver
                ? (
                  <Box
                    className={classes.colorPickerBox}
                    onMouseLeave={() => setShowColorPicker(false)}
                  >
                    <ChromePicker
                      className={classes.colorPicker}
                      color={getColor(nodeId).hex}
                      onChangeComplete={(color, event) => {
                        handleColorChange(event, nodeId, () => {return {...color.rgb, hex: color.hex}});
                      }}
                    />
                  </Box>
                ) : null
                }
          </Grid>
        </Grid>
      )}
    >
      {children}
    </TreeItem>
  );
};

export default ControlPanelTreeItem;
