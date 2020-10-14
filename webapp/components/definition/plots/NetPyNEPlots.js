import React, { Component } from "react";

import Utils from "../../../Utils";
import PlotLFP from "./plotTypes/PlotLFP";
import PlotConn from "./plotTypes/PlotConn";
import Plot2Dnet from "./plotTypes/Plot2Dnet";
import PlotRaster from "./plotTypes/PlotRaster";
import PlotTraces from "./plotTypes/PlotTraces";
import PlotGranger from "./plotTypes/PlotGranger";
import PlotRatePSD from "./plotTypes/PlotRatePSD";
import PlotSpikeHist from "./plotTypes/PlotSpikeHist";
import PlotSpikeStats from "./plotTypes/PlotSpikeStats";
import NetPyNENewPlot from "./NetPyNENewPlot";
import NetPyNEPlotThumbnail from "./NetPyNEPlotThumbnail";

import { GridLayout } from "netpyne/components";

import RulePath from "../../general/RulePath";
import Accordion from "../../general/ExpansionPanel";
import Box from "@material-ui/core/Box";

export default class NetPyNEPlots extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedPlot: undefined,
      page: "main",
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
      var model = { plot: true };
    }
    Utils.evalPythonMessage("netpyne_geppetto.getAvailablePlots", []).then(
      response => {
        if (response.includes(plot)) {
          if (plot == "plotLFP") {
            var include = { electrodes: ["all"] };
          } else if (plot == "granger") {
            var include = {
              cells1: ["allCells"],
              cells2: ["allCells"],
            };
          } else {
            var include = { include: ["all"] };
          }
          Utils.execPythonMessage(
            "netpyne_geppetto.simConfig.analysis['"
              + plot
              + "'] = "
              + JSON.stringify(include)
          );
        }
      }
    );
    this.setState({
      value: model,
      selectedPlot: plot,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    var newItemCreated = false;
    var selectionChanged = this.state.selectedPlot != nextState.selectedPlot;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated
        = Object.keys(this.state.value).length
        != Object.keys(nextState.value).length;
    }
    return newModel || newItemCreated || selectionChanged || pageChanged;
  }

  render () {
    var plots = [];
    for (var c in this.state.value) {
      plots.push(
        <NetPyNEPlotThumbnail
          name={c}
          key={c}
          selected={c == this.state.selectedPlot}
          handleClick={this.selectPlot}
        />
      );
    }

    switch (this.state.selectedPlot) {
    case "iplotRaster":
      var selectedPlot = <PlotRaster />;
      break;
    case "iplotSpikeHist":
      var selectedPlot = <PlotSpikeHist />;
      break;
    case "iplotSpikeStats":
      var selectedPlot = <PlotSpikeStats />;
      break;
    case "iplotRatePSD":
      var selectedPlot = <PlotRatePSD />;
      break;
    case "iplotTraces":
      var selectedPlot = <PlotTraces />;
      break;
    case "iplotLFP":
      var selectedPlot = <PlotLFP />;
      break;
    case "iplotConn":
      var selectedPlot = <PlotConn />;
      break;
    case "iplot2Dnet":
      var selectedPlot = <Plot2Dnet />;
      break;
    case "granger":
      var selectedPlot = <PlotGranger />;
      break;
    }

    return (
      <GridLayout>
        <div>
          <Accordion>
            <div className="breadcrumb">
              <NetPyNENewPlot handleClick={this.handleNewPlot} />
            </div>
            <Box p={1}>
              <RulePath
                style={{ paddingBottom: 8 }}
                text={`simConfig.analysis["${this.state.selectedPlot}"]`}
              />
              <Box mb={1} />
            </Box>
          </Accordion>
        </div>
        <Box className={`scrollbar scroll-instances`} mt={1}>
          {plots}
        </Box>
        {selectedPlot}
        {null}
      </GridLayout>
    );
  }
}
