import React from 'react';
import { List } from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { orange, grey } from '@material-ui/core/colors';
import Checkbox from '../../general/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FileBrowser from '../../general/FileBrowser';
import ActionDialog from './ActionDialog';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const orange500 = orange[500], grey400 = grey[400];

const loadOptions = [
  { label: 'High-level Network Parameters (netParams)', label2: 'Cell rules, connectivity rules, etc', state: 'loadNetParams' },
  { label: 'Simulation Configuration (simConfig)', label2: 'duration, recorded variables, etc', state: 'loadSimCfg' },
  { label: 'Instantiated Network', label2: 'All cells, connections, etc', state: 'loadNet' },
  { label: 'Simulation Data', label2: 'Spikes, traces, etc', state: 'loadSimData' }
]

export default class LoadFile extends React.Component {
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
    /*
     * freeze instance means we will get the latest instance, so it will not be required an update of the instance in the future.
     * similar for simulation
     * tab controls whether we want to move to a different tab or to stay where we are. undefined == 'I dont want to move to other tab'
     */
    let freezeInstance = !!this.state.loadNet
    let freezeSimulation = !!(freezeInstance && this.state.loadSimData)
    let tab = this.state.loadSimData || this.state.loadNet ? 'simulate' : 'define'
        
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
        <div style={{ width: '100%', marginTop: -22 }}>   
          <TextField 
            readOnly
            id="loadJsonFile"
            className="netpyneField" 
            style={{ cursor: 'pointer', marginBottom:15 }} 
            label="Json file:" 
            value={this.state.jsonModelFolder} 
            onClick={() => this.showExplorerDialog('jsonModelFolder', false)}
            underlineStyle={{ borderWidth:'1px' }}
            errorText={this.state.jsonPath != '' ? 'path: ' + this.state.jsonPath : ''} 
            errorStyle={{ color: grey400 }}
          />
          <List> 
            {loadOptions.map((loadOption, index) => <ListItem style={{ height: 50, width:'49%', float:index % 2 == 0 ? 'left' : 'right', marginTop: index > 1 ? "20px" : "-10px" }}
              key={index}
              leftCheckbox= {<Checkbox onChange={() => this.setState(({ [loadOption.state]: oldState, ...others }) => ({ [loadOption.state]: !oldState }))} checked={this.state[loadOption.state]} />}
              subheader={
                <ListSubheader component="div">
                  {loadOption.label}
                  {loadOption.label2}
                </ListSubheader>
              }
            />)
            }
          </List>
          <div>
            <FormControl>
              <InputLabel >Are custom mod files required for this model?</InputLabel>
              <Select
                className="netpyneField"
                id="appBarLoadRequiresMod"
                errorText={this.state.areModFieldsRequired === undefined ? "This field is required." : false}
                errorStyle={{ color: orange500, marginBottom:-40 }}
                value={this.state.areModFieldsRequired}
                onChange={(event, index, value) => this.setState({ areModFieldsRequired: value })}
              >
                <MenuItem 
                  value={true} 
                >
                  Yes, this model requires custom mod files
                </MenuItem>
                <MenuItem 
                  id="appBarLoadRequiresModNo" 
                  value={false} 
                >
                  No, this model only requires NEURON built-in mod files
                </MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              readOnly
              className="netpyneFieldNoWidth" 
              style={{ float: 'left', width: '48%', cursor: 'pointer' , marginBottom: 15, marginTop:-10 }} 
              label="Mod folder:"
              disabled={this.state.areModFieldsRequired === '' ? true : !this.state.areModFieldsRequired} 
              value={this.state.modFolder} 
              onClick={() => this.showExplorerDialog('modFolder', true)} 
              underlineStyle={{ borderWidth:'1px' }}
              errorText={this.state.modPath != '' ? 'path: ' + this.state.modPath : ''} 
              errorStyle={{ color: grey400 }}
            />
            <div style={{ float: 'right', width: '47%', marginTop:25 }}>
              <Checkbox
                className={"netpyneCheckbox"}
                disabled={this.state.areModFieldsRequired === '' ? true : !this.state.areModFieldsRequired}
                label="Compile mod files"
                checked={this.state.compileMod}
                onChange={() => this.setState(oldState => ({ compileMod: this.state.areModFieldsRequired ? !oldState.compileMod : false }))}
              />
            </div>
            <FileBrowser open={this.state.explorerDialogOpen} exploreOnlyDirs={this.state.exploreOnlyDirs} filterFiles={'.json'} onRequestClose={selection => this.closeExplorerDialog(selection)} />
          </div>
        </div>
      </ActionDialog>
    )
  }
}