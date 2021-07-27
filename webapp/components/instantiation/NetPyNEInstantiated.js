import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import Canvas from '@geppettoengine/geppetto-client/js/components/interface/3dCanvas/Canvas';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';

import { NetWorkControlButtons } from 'netpyne/components';
import { primaryColor, canvasBgDark, canvasBgLight } from '../../theme';
import { THEMES } from '../../constants';

const CANVAS_LIGHT = 'canvas-toolbar-btns-light';
const CANVAS_DARK = 'canvas-toolbar-btns-dark';

export default class NetPyNEInstantiated extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      model: props.model,
      controlPanelInitialized: false,
      bringItToFront: 0,
      update: 0,
      canvasBtnCls: props.theme === THEMES.LIGHT ? CANVAS_LIGHT : CANVAS_DARK,
    };
    this.dimensions = {
      width: 200,
      height: 200,
    };
    this.canvasRef = createRef();
    this.controlPanelToggle = this.controlPanelToggle.bind(this);
  }

  componentDidMount () {
    this.canvasRef.current.engine.setLinesThreshold(10000);
    this.canvasRef.current.displayAllInstances();
    this.updateBtnsWithTheme('', this.state.canvasBtnCls);
    window.addEventListener('resize', this.delayedResize.bind(this));
    this.resizeIfNeeded();
    this.updateInstances();

    GEPPETTO.on(GEPPETTO.Events.Control_panel_close, () => {
      this.setState({ bringItToFront: 0 });
    });
  }

  componentDidUpdate (prevProps, prevState) {
    this.resizeIfNeeded();
    const { theme } = this.props;
    if (prevProps.theme !== this.props.theme) {
      theme === THEMES.LIGHT ? this.updateBtnsWithTheme(CANVAS_DARK, CANVAS_LIGHT)
        : this.updateBtnsWithTheme(CANVAS_LIGHT, CANVAS_DARK);
    }
    if (prevState.controlPanelInitialized !== this.state.controlPanelInitialized) {
      if (this.state.controlPanelInitialized) {
        $('#controlpanel')
          .show();
      }
    }
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Control_panel_close);
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.delayedResize);
  }

  updateBtnsWithTheme = (removeClass, addClass) => {
    const element = document.getElementById('CanvasContainer_component');
    if (removeClass) {
      element.classList.remove(removeClass);
    }
    element.classList.add(addClass);
    this.setState({ canvasBtnCls: addClass });
  };

  updateInstances () {
    if (window.Instances != null && window.Instances.network) {
      // update canvas only if there are instances to show
      this.canvasRef.current.engine.setLinesThreshold(25000);
      this.canvasRef.current.engine.updateSceneWithNewInstances(
        window.Instances,
      );
      this.canvasRef.current.resetCamera();

      this.canvasRef.current.setColor('network', primaryColor, true);
      const spotLight = this.canvasRef.current.engine.scene.children.find(
        (child) => child.type === 'SpotLight',
      );
      if (spotLight) {
        this.canvasRef.current.engine.scene.remove(spotLight);
      }
    }
  }

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

  render () {
    const {
      update,
      canvasBtnCls,
      controlPanelInitialized,
    } = this.state;
    const { theme } = this.props;
    const { controlPanelToggle } = this;
    const bgColor = theme === THEMES.LIGHT ? canvasBgLight : theme === THEMES.BLACK ? canvasBgDark : 'transparent';
    return (
      <div className="instantiatedContainer">
        <NetWorkControlButtons canvasBtnCls={canvasBtnCls} controlPanelShow={controlPanelToggle} />
        <Canvas
          id="CanvasContainer"
          name="Canvas"
          componentType="Canvas"
          ref={this.canvasRef}
          style={{
            height: '100%',
            width: '100%',
            background: bgColor,
          }}
          update={update}
        />
        <div id="controlpanel" style={{ top: 0 }}>
          {controlPanelInitialized
          && <ControlPanel icon={null} useBuiltInFilters={false} />}
        </div>
      </div>
    );
  }
}
