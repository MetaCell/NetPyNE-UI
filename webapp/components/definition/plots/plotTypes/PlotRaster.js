import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import {
  NetPyNEInclude,
  NetPyNEField,
  SelectField,
  NetPyNECheckbox,
  NetPyNETextField,
} from 'netpyne/components';
import TimeRange from '../TimeRange';

export default class PlotRaster extends React.Component {
  constructor (props) {
    super(props);
    this.state = { checked: false };
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleCheckChange = (event, isCheck) => {
    this.setState({ Checked: isCheck });
  };

  render () {
    const tag = 'simConfig.analysis[\'iplotRaster\']';
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEInclude
          id="simConfig.analysis.plotRaster.include"
          model={`${tag}['include']`}
          defaultOptions={['all', 'allCells', 'allNetStims']}
          initialValue="all"
        />

        <NetPyNEField id="simConfig.analysis.plotRaster.timeRange">
          <TimeRange model={`${tag}['timeRange']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRaster.maxSpikes">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['maxSpikes']`}
          />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRaster.orderBy"
          className="listStyle"
        >
          <SelectField model={`${tag}['orderBy']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRaster.popRates"
          className="listStyle"
        >
          <SelectField model={`${tag}['popRates']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRaster.spikeHist"
          className="listStyle"
        >
          <SelectField model={`${tag}['spikeHist']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRaster.spikeHistBin">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['spikeHistBin']`}
          />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRaster.orderInverse"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['orderInverse']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRaster.syncLines"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['syncLines']`} />
        </NetPyNEField>
      </Box>
    );
  }
}
