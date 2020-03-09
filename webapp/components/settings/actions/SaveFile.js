import React from 'react';
import Checkbox from '../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import { List, ListItem } from '@material-ui/core';
import Utils from '../../../Utils';
import ActionDialog from './ActionDialog';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const saveOptions = [
  { label: 'High-level Network Parameters (netParams)', label2: 'Cell rules, connectivity rules, etc', state: 'loadNetParams' },
  { label: 'Simulation Configuration (simConfig)', label2: 'duration, recorded variables, etc', state: 'loadSimCfg' },
  { label: 'Instantiated Network', label2: 'All cells, connections, etc', state: 'loadNet' },
  { label: 'Simulation Data', label2: 'Spikes, traces, etc', state: 'loadSimData' }
]

export default class SaveFile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      fileName: 'output',
      netParams: true,
      simConfig: true,
      simData: true,
      netCells: true
    }
        
  }

  componentDidMount () {
    Utils.evalPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
      .then(response => {
        this.setState({ disableNetCells: !response['haveInstance'], disableSimData: !response['haveSimData'], netCells:response['haveInstance'], simData: response['haveSimData'] })
      }
      )
  }

  render () {
    return (
      <ActionDialog
        command ={'netpyne_geppetto.exportModel'}
        message = {GEPPETTO.Resources.EXPORTING_MODEL}
        buttonLabel={'Save'}
        title={'Save as JSON file'}
        args={this.state}
        {...this.props}
      >
        <TextField 
          className="netpyneField" 
          value={this.state.fileName} 
          label="File name" 
          onChange={event => this.setState({ fileName: event.target.value })} 
        />
        <List >
          {saveOptions.map((saveOption, index) => (
            <ListItem 
              style={{ height: 50, width:'49%', float:index % 2 == 0 ? 'left' : 'right', marginTop: index > 1 ? "20px" : "-10px" }}
              key={index}
            >
              <ListItemIcon>
                <Checkbox 
                  disabled={index == 2 ? this.state.disableNetCells : index == 3 ? this.state.disableNetCells : false} 
                  onChange={() => this.setState(({ [saveOption.state]: oldState, ...others }) => ({ [saveOption.state]: !oldState }))} 
                  checked={this.state[saveOption.state]}
                />
              </ListItemIcon>
              <ListItemText
                primary={saveOption.label}
                secondary={saveOption.label2}
              />
            </ListItem>
          ))}
        </List>
      </ActionDialog>
    )
  }
}