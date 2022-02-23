import React from 'react';
import { withStyles } from '@material-ui/core';
import Canvas from '@metacell/geppetto-meta-ui/3d-canvas/Canvas';
import CameraControls from '@metacell/geppetto-meta-ui/camera-controls/CameraControls';
import {
  primaryColor, canvasBgDark, canvasBgLight, bgRegular,
} from '../../theme';
import { THEMES } from '../../constants';

require('source-map-support').install();

const CANVAS_LIGHT = 'canvas-toolbar-btns-light';
const CANVAS_DARK = 'canvas-toolbar-btns-dark';
const SELECTION_COLOR = {
  r: 0, g: 0.8, b: 0.8, a: 1,
};
const DEFAULT_COLOR = {
  g: 0.50, b: 0.60, r: 1, a: 0.80,
};

const styles = () => ({
  container: {
    height: '800px',
    width: '1940px',
    display: 'flex',
    alignItems: 'stretch',
  },
});

class NetPyNEInstantiated extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      cameraOptions: {
        angle: 60,
        near: 10,
        far: 2000000,
        baseZoom: 1,
        position: { x: -97.349, y: 53.797, z: 387.82 },
        rotation: {
          rx: 0.051, ry: -0.192, rz: -0.569, radius: 361.668,
        },
        autoRotate: false,
        movieFilter: true,
        reset: false,
        cameraControls: {
          instance: CameraControls,
          props: {},
        },
      },
    };
    this.canvasRef = React.createRef();

    this.onSelection = this.onSelection.bind(this);
    this.applySelection = this.applySelection.bind(this);
    this.mapToCanvasData = this.mapToCanvasData.bind(this);
  }

  onSelection (selectedInstances) {
    const { selectInstances, data } = this.props;
    selectInstances(this.applySelection(data, selectedInstances));
  }

  updateBtnsWithTheme = (removeClass, addClass) => {
    const element = document.getElementById('CanvasContainer_component');
    if (removeClass) {
      element.classList.remove(removeClass);
    }
    element.classList.add(addClass);
    this.setState({ canvasBtnCls: addClass });
  };

  mapToCanvasData (data) {
    return data.map((item) => (
      {
        visibility: item?.visibility !== undefined ? item.visibility : true,
        color: item.selected ? SELECTION_COLOR : item.color,
        instancePath: item.instancePath,
      }
    ));
  }

  applySelection (data, selectedInstances) {
    const smap = new Map(selectedInstances.map((i) => [i, true]))
    const newData = data.map((item) => {
      if (smap.get(item.instancePath)) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return { ...item };
    });
    const dmap = new Map(newData.map((i) => [i.instancePath, true]));

    smap.forEach((value, key) => {
      if (!dmap.get(key)) {
        newData.push({
          instancePath: key,
          color: undefined,
          selected: true,
        });
      }
    });
    return newData;
  }

  render () {
    const { cameraOptions } = this.state;
    const { data } = this.props;

    const canvasData = this.mapToCanvasData(data);

    let camOptions = cameraOptions;
    if (this.lastCameraUpdate) {
      camOptions = {
        ...cameraOptions,
        position: this.lastCameraUpdate.position,
        rotation: {
          ...this.lastCameraUpdate.rotation,
          radius: cameraOptions.rotation.radius,
        },
      };
    }

    return (
      <div>
        <Canvas
          data={canvasData}
          ref={this.canvasRef}
          key="CanvasContainer"
          cameraOptions={camOptions}
          backgroundColor={bgRegular}
          onSelection={this.onSelection}
        />
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNEInstantiated);
