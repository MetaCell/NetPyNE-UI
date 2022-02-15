import React from 'react';
import { withStyles } from '@material-ui/core';
import Canvas from '@metacell/geppetto-meta-ui/3d-canvas/Canvas';
import CameraControls from '@metacell/geppetto-meta-ui/camera-controls/CameraControls';
import { applySelection, mapToCanvasData } from '@metacell/geppetto-meta-ui/3d-canvas/showcase/utils/SelectionUtils';
import {
  primaryColor, canvasBgDark, canvasBgLight, bgRegular,
} from '../../theme';
import { THEMES } from '../../constants';

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
  }

  onSelection (selectedInstances) {
    const { selectInstances, data } = this.props;
    selectInstances(applySelection(data, selectedInstances));
  }

  updateBtnsWithTheme = (removeClass, addClass) => {
    const element = document.getElementById('CanvasContainer_component');
    if (removeClass) {
      element.classList.remove(removeClass);
    }
    element.classList.add(addClass);
    this.setState({ canvasBtnCls: addClass });
  };

  render () {
    const { cameraOptions } = this.state;
    const { data } = this.props;

    const canvasData = mapToCanvasData(data);

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
