import React from 'react';
import TextField from '@material-ui/core/TextField';
import { List, ListItem } from '@material-ui/core';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { ActionDialog } from 'netpyne/components';
import Utils from '../../../Utils';
import Checkbox from '../../general/Checkbox';

import { NETPYNE_COMMANDS } from '../../../constants';

const saveOptions = [
  {
    label: 'High-level Network Parameters (netParams)',
    label2: 'Cell rules, connectivity rules, etc',
    state: 'loadNetParams',
  },
  {
    label: 'Simulation Configuration (simConfig)',
    label2: 'duration, recorded variables, etc',
    state: 'loadSimCfg',
  },
  {
    label: 'Instantiated Network',
    label2: 'All cells, connections, etc',
    state: 'loadNet',
  },
  {
    label: 'Simulation Data',
    label2: 'Spikes, traces, etc',
    state: 'loadSimData',
  },
];

export default class SaveFile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      fileName: 'output',
      netParams: true,
      simConfig: true,
      simData: true,
      netCells: true,
    };
  }

  componentDidMount () {
    Utils.evalPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
      .then((response) => {
        this.setState({
          disableNetCells: !response.haveInstance,
          disableSimData: !response.haveSimData,
          netCells: response.haveInstance,
          simData: response.haveSimData,
        });
      });
  }

  render () {
    return (
      <ActionDialog
        command={NETPYNE_COMMANDS.exportModel}
        message={GEPPETTO.Resources.EXPORTING_MODEL}
        buttonLabel="Save"
        title="Save as JSON file"
        args={this.state}
        {...this.props}
      >
        <TextField
          variant="filled"
          fullWidth
          value={this.state.fileName}
          label="File name"
          onChange={(event) => this.setState({ fileName: event.target.value })}
        />
        <div>
          <List style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
          >
            {saveOptions.map((saveOption, index) => (
              <ListItem
                key={index}
                style={{ width: '50%' }}
              >
                <ListItemIcon>
                  <Checkbox
                    disabled={index === 2 ? this.state.disableNetCells : index === 3 ? this.state.disableNetCells : false}
                    onChange={() => this.setState(({
                      [saveOption.state]: oldState,
                      ...others
                    }) => ({ [saveOption.state]: !oldState }))}
                    checked={this.state[saveOption.state]}
                    noBackground
                  />
                </ListItemIcon>
                <ListItemText
                  primary={saveOption.label}
                  secondary={saveOption.label2}
                />
              </ListItem>
            ))}
          </List>

        </div>

      </ActionDialog>
    );
  }
}
