import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@geppettoengine/geppetto-client/js/components/controls/iconButton/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../Utils';
import { Tooltip } from 'netpyne/components';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

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


const styles = ({ spacing }) => ({})


class PlotButtons extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      plotButtonOpen: false,
      openDialog: false,
    };
    
    this.plotFigure = this.plotFigure.bind(this);
    this.newPlotWidget = this.newPlotWidget.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

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
      panelName: 'plotPanel'
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
      const payload = {
        errorMessage: parsedResponse['message'],
        errorDetails: parsedResponse['details'],
      }
      this.props.pythonCallErrorDialogBox(payload)
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

  handleCloseDialog () {
    this.props.closeBackendErrorDialog()
  }
  

  render () {
    const { classes } = this.props
    return (
      <div>
        <Tooltip placement="left" title="Plot graph">
          <IconButton
            onClick={this.handleClick}
            label="Plot"
            icon="fa-bar-chart"
            id="PlotButton"
          />
        </Tooltip>
          
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
              onClick={() => {
                this.plotFigure(plot.plotName, plot.plotMethod, plot.plotType)
              }}
            >
              {plot.primaryText}
            </MenuItem>
          ))}
        </Menu>

        <Dialog
          fullWidth
          maxWidth='md'
          transitionDuration={{ exit: 0 }}
          open={!!this.props.errorDetails}
          onClose={() => this.handleCloseDialog()}
          style={{ whiteSpace: "pre-wrap" }}
        >
          <DialogTitle>{this.props.errorMessage}</DialogTitle>
          <DialogContent>
            {Utils.parsePythonException(this.props.errorDetails)}
          </DialogContent>
          <DialogActions>
            <Button
              id="netPyneDialog"
              color="primary"
              onClick={() => this.handleCloseDialog()}
            >Ok</Button>
          </DialogActions>
        </Dialog>
      </div>

    );
  }
}

export default withStyles(styles)(PlotButtons)