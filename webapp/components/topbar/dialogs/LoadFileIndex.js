import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Box from '@material-ui/core/Box';

import { withStyles } from '@material-ui/core/styles';
import { ActionDialog, Tooltip } from 'netpyne/components';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FileBrowser from '../../general/FileBrowser';
import Checkbox from '../../general/Checkbox';

const styles = ({
  spacing,
  typography,
  zIndex,
}) => ({});

const loadOptions = [
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

class LoadFileIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      jsonModelFolder: '',
      modFolder: '',
      compileMod: false,
      explorerDialogOpen: false,
      explorerParameter: '',
      exploreOnlyDirs: false,
      areModFieldsRequired: false,
      jsonPath: '',
      modPath: '',
      loadNetParams: true,
      loadSimCfg: true,
      loadSimData: true,
      loadNet: true,
    };
    this.isFormValid = this.isFormValid.bind(this);
  }

  showExplorerDialog (explorerParameter, exploreOnlyDirs) {
    this.setState({
      explorerDialogOpen: true,
      explorerParameter,
      exploreOnlyDirs,
    });
  }

  closeExplorerDialog (fieldValue) {
    const newState = { explorerDialogOpen: false };
    if (fieldValue) {
      const fileName = fieldValue.path.replace(/^.*[\\/]/, '');
      const path = fieldValue.path
        .split(fileName)
        .slice(0, -1)
        .join('');
      switch (this.state.explorerParameter) {
        case 'modFolder':
          newState.modFolder = fieldValue.path;
          newState.modPath = path;
          break;
        case 'jsonModelFolder':
          newState.jsonModelFolder = fieldValue.path;
          newState.jsonPath = path;
          break;
        default:
          throw Error('Not a valid parameter!');
      }
    }
    this.setState(newState);
  }

  isFormValid () {
    // FIXME: Set to undefine to show error text. No particularly elegant
    if (this.state.areModFieldsRequired === '') {
      this.setState({ areModFieldsRequired: undefined });
    }
    return (
      this.state.areModFieldsRequired !== undefined
      && this.state.areModFieldsRequired !== ''
    );
  }

  render () {
    const { classes } = this.props;
    /*
     * freeze instance means we will get the latest instance,
     * so it will not be required an update of the instance in the future.
     * similar for simulation
     * tab controls whether we want to move to a different tab or to stay where we are.
     * undefined == 'I dont want to move to other tab'
     */
    const freezeInstance = !!this.state.loadNet;
    const freezeSimulation = !!(freezeInstance && this.state.loadSimData);
    const tab = this.state.loadSimData || this.state.loadNet ? 'simulate' : 'define';
    const disableLoadMod = !this.state.areModFieldsRequired;

    return (
      <ActionDialog
        title="Open INDEX file"
        buttonLabel="Load"
        message="LOADING FILE"
        isFormValid={this.isFormValid}
        command="netpyne_geppetto.loadFromIndexFile"
        args={{
          ...this.state,
          tab,
          freezeInstance,
          freezeSimulation,
        }}
        {...this.props}
      >
        <Box display="flex" alignItems="center">
          <Tooltip title="File explorer" placement="top">
            <FolderOpenIcon
              className="dialog-folder-icon"
              onClick={() => this.showExplorerDialog('jsonModelFolder', false)}
            />
          </Tooltip>
          <TextField
            xs={12}
            sm={8}
            fullWidth
            variant="filled"
            label="INDEX file"
            value={this.state.jsonModelFolder}
            onChange={(event) => this.setState({ jsonModelFolder: event.target.value })}
            helperText={
              this.state.jsonPath != '' ? `path: ${this.state.jsonPath}` : ''
            }
            InputProps={{ disableUnderline: true }}
          />
        </Box>
      </ActionDialog>
    );
  }
}

export default withStyles(styles)(LoadFileIndex);
