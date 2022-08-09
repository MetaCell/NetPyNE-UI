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

export default class PlotRateSpectrogram extends React.Component {
  constructor (props) {
    super(props);
    this.state = { checked: false };
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleCheckChange = (event, isCheck) => {
    this.setState({ Checked: isCheck });
  };

  render () {
    const tag = 'simConfig.analysis[\'plotRateSpectrogram\']';
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEInclude
          id="simConfig.analysis.plotRateSpectrogram.include"
          model={`${tag}['include']`}
          defaultOptions={['all', 'allCells', 'allNetStims']}
          initialValue="all"
        />

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.timeRange">
          <TimeRange model={`${tag}['timeRange']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.binSize">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['binSize']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.minFreq">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['minFreq']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.maxFreq">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['maxFreq']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.stepFreq">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['stepFreq']`}
          />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRateSpectrogram.transformMethod"
          className="listStyle"
        >
          <SelectField model={`${tag}['transformMethod']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.fontSize">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['fontSize']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRateSpectrogram.figSize">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['figSize']`}
          />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRateSpectrogram.saveData"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['saveData']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRateSpectrogram.saveFig"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['saveFig']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRateSpectrogram.showFig"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['showFig']`} />
        </NetPyNEField>
      </Box>
    );
  }
}
