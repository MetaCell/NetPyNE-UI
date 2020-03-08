import React, { Component } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import Utils from '../../../Utils';
import PlotLFP from './plotTypes/PlotLFP';
import PlotConn from './plotTypes/PlotConn';
import PlotShape from './plotTypes/PlotShape';
import Plot2Dnet from './plotTypes/Plot2Dnet';
import PlotRaster from './plotTypes/PlotRaster';
import PlotTraces from './plotTypes/PlotTraces';
import PlotGranger from './plotTypes/PlotGranger';
import PlotRatePSD from './plotTypes/PlotRatePSD';
import PlotSpikeHist from './plotTypes/PlotSpikeHist';
import PlotSpikeStats from './plotTypes/PlotSpikeStats';
import NetPyNENewPlot from './NetPyNENewPlot';
import NetPyNEPlotThumbnail from './NetPyNEPlotThumbnail';

export default class NetPyNEPlots extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedPlot: undefined,
      page: "main"
    };
    this.selectPlot = this.selectPlot.bind(this);
    this.handleNewPlot = this.handleNewPlot.bind(this);
  }

  selectPlot (plot) {
    this.setState({ selectedPlot: plot });
  }

  handleNewPlot (plot) {
    if (this.state.value != undefined) {
      var model = this.state.value;
      model[plot] = true;
    } else {
      var model = { plot: true }
    }
    Utils
      .evalPythonMessage("netpyne_geppetto.getAvailablePlots", [])
      .then(response => {
        if (response.includes(plot)) {
          if (plot == "plotLFP") {
            var include = { 'electrodes': ['all'] }
          } else if (plot == "plotShape") {
            var include = {
              'includePre': ['all'],
              'includePost': ['all']
            }
          } else if (plot == "granger") {
            var include = {
              'cells1': ['allCells'],
              'cells2': ['allCells']
            }
          } else {
            var include = { 'include': ['all'] }
          }
          Utils.execPythonMessage("netpyne_geppetto.simConfig.analysis['" + plot + "'] = " + JSON.stringify(include));
        }
      });
    this.setState({
      value: model,
      selectedPlot: plot
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    var newItemCreated = false;
    var selectionChanged = this.state.selectedPlot != nextState.selectedPlot;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length != Object.keys(nextState.value).length;
    }
    return newModel || newItemCreated || selectionChanged || pageChanged;
  }

  render () {
    var plots = [];
    for (var c in this.state.value) {
      plots.push(<NetPyNEPlotThumbnail name={c} key={c} selected={c == this.state.selectedPlot} handleClick={this.selectPlot} />);
    }

    switch (this.state.selectedPlot) {
    case "plotRaster":
      var selectedPlot = <PlotRaster />
      break;
    case "plotSpikeHist":
      var selectedPlot = <PlotSpikeHist />
      break;
    case "plotSpikeStats":
      var selectedPlot = <PlotSpikeStats />
      break;
    case "plotRatePSD":
      var selectedPlot = <PlotRatePSD />
      break;
    case "plotTraces":
      var selectedPlot = <PlotTraces />
      break;
    case "plotLFP":
      var selectedPlot = <PlotLFP />
      break;
    case "plotShape":
      var selectedPlot = <PlotShape />
      break;
    case "plotConn":
      var selectedPlot = <PlotConn />
      break;
    case "plot2Dnet":
      var selectedPlot = <Plot2Dnet />
      break;
    case "granger":
      var selectedPlot = <PlotGranger />
      break;
    }

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          title="Plots configuration"
          subheader="Define here the options to customize the plots"
          id="Plots"
        />
        <CardContent className={"tabContainer"} >
          <div className={"thumbnails"}>
            <div className="breadcrumb">
              <NetPyNENewPlot 
                style={{ float: 'left', marginTop: "12px", marginLeft: "18px" }}
                handleClick={this.handleNewPlot} 
              />
            />

            </div>
            <div style={{ clear: "both" }}></div>
            {plots}
          </div>
          <div className={"details"}>
            {selectedPlot}
          </div>
        </CardContent>
      </Card>
    );
  }
}
