import React, { createRef } from 'react';
import ReactDOM from 'react-dom'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Canvas from '@geppettoengine/geppetto-client/js/components/interface/3dCanvas/Canvas';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';
import IconButton from '@geppettoengine/geppetto-client/js/components/controls/iconButton/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../Utils';


import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  modal: {
    position: 'absolute !important',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: '999',
    height: '100%',
    width: '100%',
    top: 0
  },

  menuItemDiv: {
    fontSize: '12px',
    lineHeight: '28px'
  },

  menuItem: {
    lineHeight: '28px',
    minHeight: '28px'
  },
  instantiatedContainer: {
    height: '100%', 
    width: '100%', 
  },
  controlpanelBtn: {
    position: 'absolute', 
    left: 34, 
    top: 280 
  },
  plotBtn: {
    position: 'absolute', 
    left: 34, 
    top: 317 
  }
        
};
const plots = [
  { id: 'connectionPlot', primaryText: 'Connectivity', plotName: 'Connections Plot', plotMethod: 'plotConn', plotType: false },
  { id: '2dNetPlot', primaryText: '2D network', plotName: '2D Net Plot', plotMethod: 'plot2Dnet', plotType: false },
  { id: 'shapePlot', primaryText: 'Cell shape', plotName: 'Shape Plot', plotMethod: 'plotShape', plotType: false },
  { id: 'tracesPlot', primaryText: 'Cell traces', plotName: 'Traces Plot', plotMethod: 'plotTraces', plotType: false },
  { id: 'rasterPlot', primaryText: 'Raster plot', plotName: 'Raster Plot', plotMethod: 'plotRaster', plotType: false },
  { id: 'spikePlot', primaryText: 'Spike histogram', plotName: 'Spike Hist Plot', plotMethod: 'plotSpikeHist', plotType: false },
  { id: 'spikeStatsPlot', primaryText: 'Spike stats', plotName: 'Spike Stats Plot', plotMethod: 'plotSpikeStats', plotType: false },
  { id: 'ratePSDPlot', primaryText: 'Rate PSD', plotName: 'Rate PSD Plot', plotMethod: 'plotRatePSD', plotType: false },
  { id: 'LFPTimeSeriesPlot', primaryText: 'LFP time-series', plotName: 'LFP Time Series Plot', plotMethod: 'plotLFP', plotType: 'timeSeries' },
  { id: 'LFPLocationsPlot', primaryText: 'LFP PSD', plotName: 'LFP PSD Plot', plotMethod: 'plotLFP', plotType: 'PSD' },
  { id: 'LFPSpectrogramPlot', primaryText: 'LFP spectrogram', plotName: 'LFP Spectrogram Plot', plotMethod: 'plotLFP', plotType: 'spectrogram' },
  { id: 'LFPLocationsPlot', primaryText: 'LFP locations', plotName: 'LFP Locations Plot', plotMethod: 'plotLFP', plotType: 'locations' },
  { id: 'grangerPlot', primaryText: 'Granger causality plot', plotName: 'Granger Plot', plotMethod: 'granger', plotType: false },
  { id: 'rxdConcentrationPlot',primaryText: 'RxD concentration plot', plotName: 'RxD concentration plot', plotMethod: 'plotRxDConcentration', plotType: false }
];

export default class NetPyNEInstantiated extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      model: props.model,
      controlPanelHidden: true,
      plotButtonOpen: false,
      openDialog: false,
      bringItToFront: 0,
      update: 0
    };
    this.dimensions = { width: 200, height: 200 }
    this.canvasRef = createRef();
        
    
    this.plotFigure = this.plotFigure.bind(this);
    this.newPlotWidget = this.newPlotWidget.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentDidUpdate (){
    this.resizeIfNeeded()
  }
    
  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  newPlotWidget (name, svgResponse, data, i, total) {
    if (svgResponse === '') {
      return
    }
    const pathName = `network.${name.replace(/ /g, '')}_${i}`
    if (!window.plotSvgImages) {
      window.plotSvgImages = { [pathName]: svgResponse }
    } else {
      window.plotSvgImages[pathName] = svgResponse
    }

    this.props.newWidget({
      path: pathName,
      component: 'Plot',
      panelName: 'topPanel'
    })

    if (i < total) {
      this.newPlotWidget(name, data[i++], data, i++, total)
    }

    if (i === total) {
      this.handleRequestClose()
    }
  }

  processError (response, plotName) {
    var parsedResponse = Utils.getErrorResponse(response);
    if (parsedResponse) {
      this.setState({
        dialogTitle: "NetPyNE returned an error plotting " + plotName,
        dialogMessage: parsedResponse['message'] + "\n " + parsedResponse['details'],
        openDialog: true
      });
      return true;
    }
    return false;
  }

  plotFigure (plotName, plotMethod, plotType = false) {
    Utils.evalPythonMessage('netpyne_geppetto.getPlot', [plotMethod, plotType], false)
      .then(response => {
        // TODO Fix this, use just JSON
        if (typeof response === 'string'){
          if (response.startsWith("{") && response.endsWith("}")) {
            if (this.processError(response, plotName)){
              return;
            }
          }
          if (response.startsWith("[") && response.endsWith("]")) {
            response = eval(response);
          }
        }
        if ($.isArray(response)) {
          this.newPlotWidget(plotName, response[0], response, 0, response.length - 1);
        } else if (response == -1) {
          this.processError(response, plotName)
        } else {
          this.newPlotWidget(plotName, response, response, 0, 0);
        }
      });
  }


  componentDidMount () {
    this.canvasRef.current.engine.setLinesThreshold(10000);
    this.canvasRef.current.displayAllInstances();
    if (Instances.length > 2) {
      // update canvas only if there are instances to show
      this.canvasRef.current.engine.updateSceneWithNewInstances(window.Instances);
    }
    
    this.canvasRef.current.setBackgroundColor('#191919')
    
    window.addEventListener('resize', this.delayedResize.bind(this))
    this.resizeIfNeeded()


    GEPPETTO.on(GEPPETTO.Events.Control_panel_close, () => {
      this.setState({ bringItToFront: 0 })
    });
  }

  componentWillUnmount (){
    GEPPETTO.off(GEPPETTO.Events.Control_panel_close)
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.delayedResize)
  }

  handleClick (event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      plotButtonOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose () {
    this.setState({ plotButtonOpen: false, });
  }
    
  updateInstances () {
    this.canvasRef.current.engine.updateSceneWithNewInstances(window.Instances);
  }

  resizeCanvas () {
    this.setState({ update: this.state.update++ })
  }

  resizeIfNeeded (){
    const dimensions = this.getParentSize()
    if (dimensions !== false && this.wasParentResized(dimensions)) {
      this.dimensions = dimensions
      this.resizeCanvas()
    }
  }
  
  wasParentResized (dimensions) {
    return dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height
  }

  delayedResize () {
    this.timer = setTimeout(() => this.resizeIfNeeded(), 100)
  }

  getParentSize () {
    if (this.canvasRef.current === null) {
      return false
    }
    const node = ReactDOM.findDOMNode(this)
    return node.parentNode.getBoundingClientRect()
  }

  render () {
    const { update } = this.state
    return (
      <div id="instantiatedContainer" style={{ ...styles.instantiatedContainer }}>
          
        <Canvas
          id="CanvasContainer"
          name="Canvas"
          componentType='Canvas'
          ref={this.canvasRef}
          style={{ height: '100%', width: '100%' }}
          update={update}
        />
        <div id="controlpanel" style={{ top: 0 }}>
          <ControlPanel
            icon={styles.Modal}
            useBuiltInFilters={false}
          >
          </ControlPanel>
        </div>
        <IconButton style={styles.controlpanelBtn}
          onClick={() => {
            $('#controlpanel').show(); this.setState({ bringItToFront: 1 })
          }}
          icon={"fa-list"}
          id="ControlPanelButton" />
        <div>
          <IconButton
            onClick={this.handleClick}
            style={styles.plotBtn}
            label="Plot"
            icon="fa-bar-chart"
            id="PlotButton"
          />
          <Menu
            open={this.state.plotButtonOpen}
            onClose={this.handleRequestClose}
            anchorEl={this.state.anchorEl}
          >
            {plots.map((plot, index) => (
              <MenuItem 
                id={plot.id} 
                key={index}
                style={styles.menuItem}
                onClick={() => this.plotFigure(plot.plotName, plot.plotMethod, plot.plotType)}
              >
                {plot.primaryText}
              </MenuItem>
            ))}
          </Menu>
        </div>

          
        <IconButton 
          color='secondary' 
          id={"refreshInstanciatedNetworkButton"} 
          key={"refreshInstanceButton"}
          icon="fa-refresh"
          onClick={() => this.instantiate({ usePrevInst: false })} 
          style={{ position: 'absolute', right: 30, top: 80, zIndex: 1 }} 
          tooltip-data={this.props.freezeInstance ? "Your network is in sync" : "Synchronise network"} 
          disabled={!!this.props.freezeInstance} 
        />
        
        
        <IconButton 
          color='secondary' 
          id={"launchSimulationButton"}
          icon="fa-rocket"
          onClick={() => this.setState({ openDialog: true })} 
          style={{ position: 'absolute', right: 30, top: 120, zIndex: 1 }} 
          tooltip-data={this.props.freezeSimulation ? "You have already simulated your network" : "Simulate your network"} 
          disabled={!!this.props.freezeSimulation} 
        />
        
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleCloseDialog}
          style={{ whiteSpace: "pre-wrap" }}
        >
          <DialogTitle>{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              id="netPyneDialog"
              color="primary"
              onClick={this.handleCloseDialog}
            >Ok</Button>
          </DialogActions>
        </Dialog>
      </div>

    );
  }
}