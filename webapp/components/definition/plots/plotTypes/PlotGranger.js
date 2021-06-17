import React from 'react';
import Box from '@material-ui/core/Box';
import { ListComponent, NetPyNEField, NetPyNETextField } from 'netpyne/components';
import TimeRange from '../TimeRange';

export default class PlotGranger extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const tags = 'simConfig.analysis[\'granger\']';
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEField
          id="simConfig.analysis.granger.cells1"
          className="listStyle"
        >
          <ListComponent model={`${tags}['cells1']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.granger.cells2"
          className="listStyle"
        >
          <ListComponent model={`${tags}['cells2']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.granger.spks1"
          className="listStyle"
        >
          <ListComponent model={`${tags}['spks1']`} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.granger.spks2"
          className="listStyle"
        >
          <ListComponent model={`${tags}['spks2']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.granger.label1">
          <NetPyNETextField
            fullWidth
            ariant="filled"
            model={`${tags}['label1']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.granger.label2">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tags}['label2']`}
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.granger.timeRange">
          <TimeRange model={`${tags}['timeRange']`} />
        </NetPyNEField>

        <NetPyNEField id="simConfig.analysis.granger.binSize">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${tags}['binSize']`}
          />
        </NetPyNEField>
      </Box>
    );
  }
}
