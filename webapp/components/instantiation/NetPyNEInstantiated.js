import React, { createRef } from 'react';
import ReactDOM from 'react-dom'
import Canvas from '@geppettoengine/geppetto-client/js/components/interface/3dCanvas/Canvas';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';

import { NetWorkControlButtons } from 'netpyne/components'
import { primaryColor, canvasBgDark, canvasBgLight } from '../../theme'
import { THEMES } from '../../constants'

const CANVAS_LIGHT = 'canvas-toolbar-btns-light'
const CANVAS_DARK = 'canvas-toolbar-btns-dark'

export default class NetPyNEInstantiated extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      model: props.model,
      controlPanelHidden: true,
      bringItToFront: 0,
      update: 0,
      canvasBtnCls: props.theme === THEMES.LIGHT ? CANVAS_LIGHT : CANVAS_DARK
    };
    this.dimensions = { width: 200, height: 200 }
    this.canvasRef = createRef();
  }

  componentDidUpdate (prevProps, prevState){
    this.resizeIfNeeded()
    const { theme } = this.props
    if (prevProps.theme !== this.props.theme) {
      theme === THEMES.LIGHT ? this.updateBtnsWithTheme(CANVAS_DARK, CANVAS_LIGHT)
        : this.updateBtnsWithTheme(CANVAS_LIGHT, CANVAS_DARK)
    }
  }

  componentDidMount () {
    this.canvasRef.current.engine.setLinesThreshold(10000);
    this.canvasRef.current.displayAllInstances();
    this.updateBtnsWithTheme('', this.state.canvasBtnCls)
    window.addEventListener('resize', this.delayedResize.bind(this))
    this.resizeIfNeeded()
    this.updateInstances()

    GEPPETTO.on(GEPPETTO.Events.Control_panel_close, () => {
      this.setState({ bringItToFront: 0 });
    });
  }

  componentWillUnmount () {
    GEPPETTO.off(GEPPETTO.Events.Control_panel_close);
    clearTimeout(this.timer);
    window.removeEventListener("resize", this.delayedResize);
  }

  updateInstances () {
    if (Instances.network) {
      // update canvas only if there are instances to show
      this.canvasRef.current.engine.setLinesThreshold(25000);
      this.canvasRef.current.engine.updateSceneWithNewInstances(
        window.Instances
      );
      this.canvasRef.current.resetCamera();

      this.canvasRef.current.setColor("network", primaryColor, true);
      const spotLight = this.canvasRef.current.engine.scene.children.find(
        child => child.type === "SpotLight"
      );
      if (spotLight) {
        this.canvasRef.current.engine.scene.remove(spotLight);
      }
    }
  }

  resizeCanvas () {
    this.setState({ update: this.state.update++ });
  }

  resizeIfNeeded () {
    const dimensions = this.getParentSize();
    if (dimensions !== false && this.wasParentResized(dimensions)) {
      this.dimensions = dimensions;
      this.resizeCanvas();
    }
  }

  wasParentResized (dimensions) {
    return dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height
  }

  delayedResize () {
    this.timer = setTimeout(() => this.resizeIfNeeded(), 100);
  }

  getParentSize () {
    if (this.canvasRef.current === null) {
      return false;
    }
    const node = ReactDOM.findDOMNode(this);
    return node.parentNode.getBoundingClientRect();
  }

  updateBtnsWithTheme = (removeClass, addClass) => {
    const element = document.getElementById('CanvasContainer_component')
    removeClass && element.classList.remove(removeClass)
    element.classList.add(addClass)
    this.setState({ canvasBtnCls: addClass })
  }

  render () {
    const { update, canvasBtnCls } = this.state;
    const { theme } = this.props;
    const bgColor = theme === THEMES.LIGHT ? canvasBgLight : theme === THEMES.BLACK ? canvasBgDark : 'transparent';
    return (
      <div className="instantiatedContainer" >
        <NetWorkControlButtons canvasBtnCls={canvasBtnCls}/>
        <Canvas
          id="CanvasContainer"
          name="Canvas"
          componentType="Canvas"
          ref={this.canvasRef}
          style={{ height: '100%', width: '100%', background: bgColor }}
          update={update}
        />
        <div id="controlpanel" style={{ top: 0 }}>
           {/*<ControlPanel icon={null} useBuiltInFilters={false}></ControlPanel>*/}
        </div>
      </div>
    );
  }
}
