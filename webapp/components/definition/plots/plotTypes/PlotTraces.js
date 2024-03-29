import React from 'react';
import Box from '@material-ui/core/Box';
import {
  NetPyNEInclude,
  NetPyNEField,
  NetPyNECheckbox,
  SelectField,
} from 'netpyne/components';
import TimeRange from '../TimeRange';

export default class PlotTraces extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const tag = "simConfig.analysis['iplotTraces']";
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEInclude
          id="simConfig.analysis.plotTraces.include"
          model={`${tag}['include']`}
          defaultOptions={['all', 'allCells', 'allNetStims']}
          initialValue="all"
        />

        <NetPyNEField id="simConfig.analysis.plotTraces.timeRange">
          <TimeRange model={`${tag}['timeRange']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotTraces.oneFigPer"
          className="listStyle"
        >
          <SelectField model={`${tag}['oneFigPer']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotTraces.overlay"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['overlay']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotTraces.rerun"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model={`${tag}['rerun']`} />
        </NetPyNEField>
      </Box>
    );
  }
}
