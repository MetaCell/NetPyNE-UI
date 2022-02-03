import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core';
import Canvas from '@metacell/geppetto-meta-ui/3d-canvas/Canvas';
import CameraControls from '@metacell/geppetto-meta-ui/camera-controls/CameraControls';
// TODO: replace this with the list viewer during refactoring
// import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';

import { NetWorkControlButtons } from 'netpyne/components';
import {
  primaryColor, canvasBgDark, canvasBgLight, bgRegular,
} from '../../theme';
import { THEMES } from '../../constants';

const CANVAS_LIGHT = 'canvas-toolbar-btns-light';
const CANVAS_DARK = 'canvas-toolbar-btns-dark';
const SELECTION_COLOR = {
  r: 0.8, g: 0.8, b: 0, a: 1,
};
const DEFAULT_COLOR = {
  r: 1, g: 0, b: 0, a: 0.5,
};

const styles = () => ({
  container: {
    height: '800px',
    width: '1240px',
    display: 'flex',
    alignItems: 'stretch',
  },
});

class NetPyNEInstantiated extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showLoader: false,
      hasModelLoaded: false,
      intersected: [],
      tooltipVisible: false,
      data: [
        {
          instancePath: 'network',
          color: {
            g: 0.50, b: 0.60, r: 1, a: 0.80,
          },
        },
      ],
      selected: {},
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
    this.dimensions = {
      width: '1980px',
      height: '1900px',
    };
    this.canvasRef = React.createRef();
    this.controlPanelToggle = this.controlPanelToggle.bind(this);
  }

  updateBtnsWithTheme = (removeClass, addClass) => {
    const element = document.getElementById('CanvasContainer_component');
    if (removeClass) {
      element.classList.remove(removeClass);
    }
    element.classList.add(addClass);
    this.setState({ canvasBtnCls: addClass });
  };

  resizeCanvas () {
    this.setState((prevState) => ({ update: prevState.update + 1 }));
  }

  resizeIfNeeded () {
    const dimensions = this.getParentSize();
    if (dimensions !== false && this.wasParentResized(dimensions)) {
      this.dimensions = dimensions;
      this.resizeCanvas();
    }
  }

  wasParentResized (dimensions) {
    return dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height;
  }

  delayedResize () {
    this.timer = setTimeout(() => this.resizeIfNeeded(), 100);
  }

  getParentSize () {
    if (this.canvasRef.current === null) {
      return false;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    return node.parentNode.getBoundingClientRect();
  }

  controlPanelToggle () {
    if (!this.state.controlPanelInitialized) {
      this.setState({ controlPanelInitialized: true });
    } else {
      $('#controlpanel')
        .show();
    }
  }

  mapToCanvasData (data) {
    return data.map((item) => (
      {
        color: item.selected ? SELECTION_COLOR : item.color,
        instancePath: item.instancePath,
      }
    ));
  }

  render () {
    const {
      update,
      canvasBtnCls,
      controlPanelInitialized,
    } = this.state;
    const { theme } = this.props;
    const { controlPanelToggle } = this;
    const bgColor = theme === THEMES.LIGHT ? canvasBgLight : theme === THEMES.BLACK ? canvasBgDark : 'transparent';

    const { data, cameraOptions } = this.state;

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
      <div className="instantiatedContainer">
        <Canvas
          ref={this.canvasRef}
          cameraOptions={camOptions}
          key="CanvasContainer"
          data={canvasData}
          backgroundColor={bgRegular}
        />
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNEInstantiated);
