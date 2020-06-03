import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { orange, grey } from '@material-ui/core/colors';
import Checkbox from '../../general/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FileBrowser from '../../general/FileBrowser';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';
import { ActionDialog, Tooltip } from 'netpyne/components'

const styles = ({ spacing, typography, zIndex }) => ({})


const loadOptions = [
  { label: 'High-level Network Parameters (netParams)', label2: 'Cell rules, connectivity rules, etc', state: 'loadNetParams' },
  { label: 'Simulation Configuration (simConfig)', label2: 'duration, recorded variables, etc', state: 'loadSimCfg' },
  { label: 'Instantiated Network', label2: 'All cells, connections, etc', state: 'loadNet' },
  { label: 'Simulation Data', label2: 'Spikes, traces, etc', state: 'loadSimData' }
]

class LoadFile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      jsonModelFolder: "",
      modFolder: "",
      compileMod: false,
      explorerDialogOpen: false,
      explorerParameter: "",
      exploreOnlyDirs: false,
      areModFieldsRequired: '',
      jsonPath: '',
      modPath: '',
      loadNetParams: true,
      loadSimCfg: true,
      loadSimData: true,
      loadNet: true,
    }
    this.isFormValid = this.isFormValid.bind(this);
      
  }

  showExplorerDialog (explorerParameter, exploreOnlyDirs) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs })
  }

  closeExplorerDialog (fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      let fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
      let path = fieldValue.path.split(fileName).slice(0, -1).join('');     
      switch (this.state.explorerParameter) {
      case "modFolder":
        newState["modFolder"] = fieldValue.path;
        newState["modPath"] = path;
        break;
      case "jsonModelFolder":
        newState["jsonModelFolder"] = fieldValue.path;
        newState["jsonPath"] = path;
        break;
      default:
        throw ("Not a valid parameter!");
      }
    }
    this.setState(newState);
  }

  isFormValid (){
    // FIXME: Set to undefine to show error text. No particularly elegant
    if (this.state.areModFieldsRequired === ''){
      this.setState({ areModFieldsRequired: undefined })
    }
    return this.state.areModFieldsRequired !== undefined && this.state.areModFieldsRequired !== ''
  }

  render () {
    const { classes } = this.props
    /*
     * freeze instance means we will get the latest instance, so it will not be required an update of the instance in the future.
     * similar for simulation
     * tab controls whether we want to move to a different tab or to stay where we are. undefined == 'I dont want to move to other tab'
     */
    let freezeInstance = !!this.state.loadNet
    let freezeSimulation = !!(freezeInstance && this.state.loadSimData)
    let tab = this.state.loadSimData || this.state.loadNet ? 'simulate' : 'define'
    const disableLoadMod = this.state.areModFieldsRequired === '' ? true : !this.state.areModFieldsRequired

    return (
      
      <ActionDialog
        title={'Open JSON file'}
        buttonLabel={'Load'}
        message = {'LOADING FILE'}
        isFormValid={this.isFormValid}
        command ={'netpyne_geppetto.loadModel'}
        args={{ ...this.state, tab:tab, freezeInstance: freezeInstance, freezeSimulation: freezeSimulation }}
        {...this.props}
      >
        <div >

          <Grid container alignItems="center" spacing={1}>
            <Tooltip title="File explorer" placement="top">
              <IconButton
                id="loadJsonFile"
                onClick={() => this.showExplorerDialog('jsonModelFolder', false)} 
              >
                <Icon className={"fa fa-folder-o"} />
              </IconButton>
            </Tooltip>

            <Grid item>
              <TextField
                fullWidth
                variant="filled" 
                label="Json file:" 
                value={this.state.jsonModelFolder} 
                onChange={event => this.setState({ jsonModelFolder: event.target.value })}
                helperText={this.state.jsonPath != '' ? 'path: ' + this.state.jsonPath : ''} 
              />
            </Grid>
          </Grid>
          
          
          <div>
            <List style={{ display: 'flex', flexWrap: 'wrap' }}> 
              {loadOptions.map((loadOption, index) => (
                <ListItem 
                  style={{ width: '50%' }}
                  key={index}
                >
                  <ListItemIcon>
                    <Checkbox 
                      onChange={() => this.setState(({ [loadOption.state]: oldState, ...others }) => ({ [loadOption.state]: !oldState }))} 
                      checked={this.state[loadOption.state]} 
                      noBackground
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={loadOption.label}
                    secondary={loadOption.label2}
                  />
                </ListItem>
              ))}
            </List>
          </div>


          <div>
            <FormControl fullWidth>
              <InputLabel >Are custom mod files required for this model?</InputLabel>
              <Select
                value={this.state.areModFieldsRequired}
                onChange={event => this.setState({ areModFieldsRequired: event.target.value })}
              >
                <MenuItem value={true} >Yes, this model requires custom mod files</MenuItem>
                <MenuItem value={false} >No, this model only requires NEURON built-in mod files</MenuItem>
              </Select>
              <FormHelperText>{this.state.areModFieldsRequired === undefined ? "This field is required." : ''}</FormHelperText>
            </FormControl>
            

            <Box mt={1} width="100%">
              <Grid container alignItems="center" spacing={1}>
                <Tooltip title="File explorer" placement="top">
                  <div>
                    <IconButton
                      onClick={() => this.showExplorerDialog('modFolder', true)} 
                      disabled={disableLoadMod} 
                    >
                      <Icon className={`fa fa-folder-o`} />
                    </IconButton>
                  </div>
                
                </Tooltip>
                <Grid item container alignItems="center">
                  <Grid item >
                    <TextField
                      variant="filled" 
                      fullWidth
                      label="Mod folder:"
                      disabled={disableLoadMod} 
                      value={this.state.modFolder} 
                      onChange={event => this.setState({ modFolder: event.target.value })} 
                      helperText={this.state.modPath != '' ? 'path: ' + this.state.modPath : ''} 
                    />
                  </Grid>
                
              
                  <Grid item>
                    <Box ml={1} width="100%">
                      <Checkbox
                        fullWidth
                        noBackground
                        label="Compile mod files"
                        checked={this.state.compileMod}
                        disabled={this.state.areModFieldsRequired === '' ? true : !this.state.areModFieldsRequired}
                        onChange={() => this.setState(oldState => ({ compileMod: this.state.areModFieldsRequired ? !oldState.compileMod : false }))}
                      />
                    </Box>
                  
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            

            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={'.json'} onRequestClose={selection => this.closeExplorerDialog(selection)} />
          </div>
        </div>
      </ActionDialog>
    )
  }
}

export default withStyles(styles)(LoadFile)