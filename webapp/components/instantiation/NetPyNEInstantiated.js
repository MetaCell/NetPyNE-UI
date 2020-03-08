import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Canvas from 'geppetto-client/js/components/interface/3dCanvas/Canvas';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';
import IconButton from 'geppetto-client/js/components/controls/iconButton/IconButton';
import Popover from '@material-ui/core/Popover';
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
    position: 'fixed'
  },
  controlpanelBtn: {
    position: 'absolute', 
    left: 34, 
    top: 16 
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
      bringItToFront: 0
    };
        
    this.widgets = [];
    this.plotFigure = this.plotFigure.bind(this);
    this.newPlotWidget = this.newPlotWidget.bind(this);
    this.getOpenedWidgets = this.getOpenedWidgets.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
    
    handleCloseDialog = () => {
      this.setState({ openDialog: false });
    };

    newPlotWidget (name, svgResponse, data, i, total) {
      var s = svgResponse;
      var that = this;
      G.addWidget(1).then(w => {
        if (total == 0) {
          w.setName(name);
        } else {
          w.setName(name + " " + i);
        }
        w.$el.append(s);
        var svg = $(w.$el).find("svg")[0];
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '98%');
        that.widgets.push(w);
        if (i < total) {
          that.newPlotWidget(name, data[i++], data, i++, total)
        }
        w.showHistoryIcon(false);
        w.showHelpIcon(false);
      });
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

    getOpenedWidgets () {
      return this.widgets;
    }

    showWidgets (visible) {
      GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.POPUP).then(controller => {
        controller.widgets.forEach(widget => {
          if (visible){
            widget.show()
          } else {
            widget.hide()
          }
        })
      })
    }

    componentDidMount () {
      this.refs.canvas.engine.setLinesThreshold(10000);
      this.refs.canvas.displayAllInstances();
      GEPPETTO.on(GEPPETTO.Events.Control_panel_close, () => {
        this.setState({ bringItToFront: 0 })
        this.showWidgets(true)
      });
    }

    componentWillUnmount (){
      GEPPETTO.off(GEPPETTO.Events.Control_panel_close)
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

    render () {
      var controls;
      if (this.props.page == 'simulate') {
        controls = (
          <Menu>
            {plots.map((plot, index) => (
              <MenuItem 
                id={plot.id} 
                key={index}
                style={styles.menuItem}
                innerDivStyle={styles.menuItemDiv}
                onClick={() => { 
                  this.plotFigure(plot.plotName, plot.plotMethod, plot.plotType)
                }}
              >
                {plot.primaryText}
              </MenuItem>
            ))}
          </Menu>
        );
      }

      return (
        <div id="instantiatedContainer" style={{ ...styles.instantiatedContainer, zIndex: this.state.bringItToFront }}>
          <Canvas
            id="CanvasContainer"
            name={"Canvas"}
            componentType={'Canvas'}
            ref={"canvas"}
            style={{ height: '100%', width: '100%' }}
          />
          <div id="controlpanel" style={{ top: 0 }}>
            <ControlPanel
              icon={"styles.Modal"}
              useBuiltInFilters={false}
            >
            </ControlPanel>
          </div>
          <IconButton style={styles.controlpanelBtn}
            onClick={() => {
              $('#controlpanel').show(); this.showWidgets(false); this.setState({ bringItToFront: 1 })
            }}
            icon={"fa-list"}
            id={"ControlPanelButton"} />
          <div>
            <IconButton
              onClick={this.handleClick}
              style={styles.plotBtn}
              label="Plot"
              icon={"fa-bar-chart"}
              id="PlotButton"
            />
            <Popover
              open={this.state.plotButtonOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              onClose={this.handleRequestClose}
            >
              {controls}
            </Popover>
          </div>

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