import React from 'react';

import { GridLayout } from 'netpyne/components';
import Box from '@material-ui/core/Box';
import Utils from '../../../Utils';
import PlotLFP from './plotTypes/PlotLFP';
import PlotConn from './plotTypes/PlotConn';
import Plot2Dnet from './plotTypes/Plot2Dnet';
import PlotRaster from './plotTypes/PlotRaster';
import PlotTraces from './plotTypes/PlotTraces';
import PlotGranger from './plotTypes/PlotGranger';
import PlotRatePSD from './plotTypes/PlotRatePSD';
import PlotSpikeHist from './plotTypes/PlotSpikeHist';
import PlotSpikeStats from './plotTypes/PlotSpikeStats';
import NetPyNENewPlot from './NetPyNENewPlot';
import NetPyNEPlotThumbnail from './NetPyNEPlotThumbnail';

import RulePath from '../../general/RulePath';
import Accordion from '../../general/ExpansionPanel';

export default class NetPyNEPlots extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedPlot: undefined,
      page: 'main',
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
    Utils.evalPythonMessage('netpyne_geppetto.getAvailablePlots', [])
      .then(
        (response) => {
          if (response.includes(plot)) {
            if (plot === 'plotLFP') {
              var include = { electrodes: ['all'] };
            } else if (plot === 'granger') {
              var include = {
                cells1: ['allCells'],
                cells2: ['allCells'],
              };
            } else {
              var include = { include: ['all'] };
            }
            Utils.execPythonMessage(
              `netpyne_geppetto.simConfig.analysis['${
                plot
              }'] = ${
                JSON.stringify(include)}`,
            );
          }
        },
      );
    this.setState({
      value: model,
      selectedPlot: plot,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    let newItemCreated = false;
    const selectionChanged = this.state.selectedPlot != nextState.selectedPlot;
    const pageChanged = this.state.page != nextState.page;
    const newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = Object.keys(this.state.value).length
        != Object.keys(nextState.value).length;
    }
    return newModel || newItemCreated || selectionChanged || pageChanged;
  }

  render () {
    let selectedPlot;
    const plots = [];
    for (const c in this.state.value) {
      plots.push(
        <NetPyNEPlotThumbnail
          name={c}
          key={c}
          selected={c === this.state.selectedPlot}
          handleClick={this.selectPlot}
        />,
      );
    }

    switch (this.state.selectedPlot) {
      case 'iplotRaster':
        selectedPlot = <PlotRaster />;
        break;
      case 'iplotSpikeHist':
        selectedPlot = <PlotSpikeHist />;
        break;
      case 'iplotSpikeStats':
        selectedPlot = <PlotSpikeStats />;
        break;
      case 'iplotRatePSD':
        selectedPlot = <PlotRatePSD />;
        break;
      case 'iplotTraces':
        selectedPlot = <PlotTraces />;
        break;
      case 'iplotLFP':
        selectedPlot = <PlotLFP />;
        break;
      case 'iplotConn':
        selectedPlot = <PlotConn />;
        break;
      case 'iplot2Dnet':
        selectedPlot = <Plot2Dnet />;
        break;
      case 'granger':
        selectedPlot = <PlotGranger />;
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
        <Box className="scrollbar scrollchild" mt={1}>
          {plots}
        </Box>
        {selectedPlot}
        {null}
      </GridLayout>
    );
  }
}
