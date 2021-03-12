import React from 'react';
import Box from '@material-ui/core/Box';
import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
} from 'netpyne/components';
import TimeRange from '../TimeRange';

export default class PlotRatePSD extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const tag = "simConfig.analysis['iplotRatePSD']";
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEInclude
          id="simConfig.analysis.plotRatePSD.include"
          model={`${tag}['include']`}
          defaultOptions={['all', 'allCells', 'allNetStims']}
          initialValue="all"
        />

        <NetPyNEField id="simConfig.analysis.plotRatePSD.timeRange">
          <TimeRange model={`${tag}['timeRange']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.binSize">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['binSize']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.maxFreq">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['maxFreq']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.NFFT">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['NFFT']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.noverlap">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['noverlap']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.plotRatePSD.smooth">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tag}['smooth']`}
          />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotRatePSD.overlay"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['overlay']`} />
        </NetPyNEField>
      </Box>
    );
  }
}
