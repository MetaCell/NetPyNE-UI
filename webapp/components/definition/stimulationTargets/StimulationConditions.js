import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import {
  ListComponent,
  NetPyNECoordsRange,
  NetPyNEField,
  NetPyNESelectField,
} from 'netpyne/components';

export default class StimulationConditions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
  }

  postProcessMenuItems (pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        id={`${name}MenuItem`}
        key={name}
        checked={selected.indexOf(name) > -1}
        value={name}
      >
        {name}
      </MenuItem>
    ));
  }

  render () {
    const { name } = this.props;
    return (
      <Box className="scrollbar scrollchild" mt={1}>
        <NetPyNEField id="netParams.stimTargetParams.conds.pop">
          <NetPyNESelectField
            model={
              `netParams.stimTargetParams['${name}']['conds']['pop']`
            }
            method="netpyne_geppetto.getAvailablePops"
            postProcessItems={this.postProcessMenuItems}
            multiple
            fullWidth
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.stimTargetParams.conds.cellType">
          <NetPyNESelectField
            model={
              `netParams.stimTargetParams['${name}']['conds']['cellType']`
            }
            method="netpyne_geppetto.getAvailableCellTypes"
            postProcessItems={this.postProcessMenuItems}
            multiple
            fullWidth
          />
        </NetPyNEField>

        <NetPyNECoordsRange
          id="xRangeStimTarget"
          name={name}
          model="netParams.stimTargetParams"
          conds="conds"
          items={[
            {
              value: 'x',
              label: 'Absolute',
            },
            {
              value: 'xnorm',
              label: 'Normalized',
            },
          ]}
        />

        <NetPyNECoordsRange
          id="yRangeStimTarget"
          name={name}
          model="netParams.stimTargetParams"
          conds="conds"
          items={[
            {
              value: 'y',
              label: 'Absolute',
            },
            {
              value: 'ynorm',
              label: 'Normalized',
            },
          ]}
        />

        <NetPyNECoordsRange
          id="zRangeStimTarget"
          name={name}
          model="netParams.stimTargetParams"
          conds="conds"
          items={[
            {
              value: 'z',
              label: 'Absolute',
            },
            {
              value: 'znorm',
              label: 'Normalized',
            },
          ]}
        />

        <NetPyNEField
          id="netParams.stimTargetParams.conds.cellList"
          className="listStyle"
        >
          <ListComponent
            model={
              `netParams.stimTargetParams['${name}']['conds']['cellList']`
            }
          />
        </NetPyNEField>
      </Box>
    );
  }
}
