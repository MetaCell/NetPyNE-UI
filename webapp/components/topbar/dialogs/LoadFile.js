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
const orange500 = orange[500], grey400 = grey[400];

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';
import { ActionDialog } from 'netpyne/components'

const styles = ({ spacing, typography, zIndex }) => ({ 
  container: { 
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%'
  },
  checkboxes: { marginTop: spacing(8) },
  selectField: { 
    marginTop: spacing(3),
    width: '100%'
  },
  icon: { 
    '&:hover': { backgroundColor: 'inherit' },
    flex: '0 0 4%',
    marginRight: spacing(2),
    width: typography.h3.fontSize,
    height: typography.h3.fontSize,
    padding: '0px!important',
    zIndex: zIndex.modal
  }
})


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
        <div style={{ width: '100%', marginTop: -8 }}>

          <div className={classes.container}>
            <IconButton
              id="loadJsonFile"
              className={classes.icon}
              onClick={() => this.showExplorerDialog('jsonModelFolder', false)} 
              tooltip-data='File explorer'
            >
              <Icon className={"fa fa-folder-o listIcon"} />
            </IconButton>

            <TextField 
              className="netpyneFieldNoWidth fx-11 no-z-index"
              label="Json file:" 
              value={this.state.jsonModelFolder} 
              onChange={event => this.setState({ jsonModelFolder: event.target.value })}
              helperText={this.state.jsonPath != '' ? 'path: ' + this.state.jsonPath : ''} 
            />

          </div>
          
          <div className={classes.checkboxes}>
            <List> 
              {loadOptions.map((loadOption, index) => (
                <ListItem 
                  style={{ height: 50, width:'49%', float:index % 2 == 0 ? 'left' : 'right', marginTop: index > 1 ? "20px" : "-10px" }}
                  key={index}
                >
                  <ListItemIcon>
                    <Checkbox 
                      onChange={() => this.setState(({ [loadOption.state]: oldState, ...others }) => ({ [loadOption.state]: !oldState }))} 
                      checked={this.state[loadOption.state]} 
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
            <FormControl className={classes.selectField}>
              <InputLabel >Are custom mod files required for this model?</InputLabel>
              <Select
                className="netpyneField"
                id="appBarLoadRequiresMod"
                value={this.state.areModFieldsRequired}
                onChange={event => this.setState({ areModFieldsRequired: event.target.value })}
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
              <FormHelperText>{this.state.areModFieldsRequired === undefined ? "This field is required." : ''}</FormHelperText>
            </FormControl>
            

            <div className={classes.container}>
              <IconButton
                className={classes.icon}
                onClick={() => this.showExplorerDialog('modFolder', true)} 
                tooltip-data='File explorer'
                disabled={disableLoadMod} 
              >
                <Icon className={`fa fa-folder-o ${!disableLoadMod && "listIcon"}`} />
              </IconButton>

              <TextField 
                className="netpyneFieldNoWidth fx-8 no-z-index"
                label="Mod folder:"
                disabled={disableLoadMod} 
                value={this.state.modFolder} 
                onChange={event => {
                  this.setState({ modFolder: event.target.value })
                }} 
                helperText={this.state.modPath != '' ? 'path: ' + this.state.modPath : ''} 
              />

              <Checkbox
                label="Compile mod files"
                checked={this.state.compileMod}
                className={"netpyneCheckbox fx-3"}
                disabled={this.state.areModFieldsRequired === '' ? true : !this.state.areModFieldsRequired}
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

export default withStyles(styles)(LoadFile)