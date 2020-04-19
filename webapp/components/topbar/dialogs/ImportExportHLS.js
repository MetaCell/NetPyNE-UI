import React from 'react';
import Checkbox from '../../general/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { orange , grey } from '@material-ui/core/colors';
import FileBrowser from '../../general/FileBrowser';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText'
const orange500 = orange[500];
const grey400 = grey[400];

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import { withStyles } from '@material-ui/core/styles';

import { NETPYNE_COMMANDS } from '../../../constants'
import { ActionDialog } from 'netpyne/components'

const styles = ({ spacing, typography, zIndex }) => ({ 
  container: { 
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%'
  },
  selectField: { 
    marginTop: spacing(3),
    width: '100%'
  },
  selectFieldLabel: { top: -spacing(2) },
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

class ImportExportHLS extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.initialState()

    this.isFormValid = this.isFormValid.bind(this);
  }

  initialState () {
    return {
      fileName: "output",
      netParamsPath: "",
      netParamsModuleName: "",
      netParamsVariable: "netParams",
      simConfigPath: "",
      simConfigModuleName: "",
      simConfigVariable: "simConfig",
      modFolder: "",
      loadMod: '',
      compileMod: false,
      explorerDialogOpen: false,
      explorerParameter: "",
      exploreOnlyDirs: false,
      filterFiles: false,
      netParamsHovered: 'hidden',
      netParamsFullPath: '',
      simConfigFullPath: ''
    }
  }

  isFormValid (){
    if (this.props.mode == 'IMPORT'){
      // FIXME: Set to undefine to show error text. No particularly elegant
      if (this.state.loadMod === ''){
        this.setState({ loadMod: undefined })
      }
      return this.state.loadMod !== undefined && this.state.loadMod !== ''
    } else {
      return true;
    }
  }

  showExplorerDialog (explorerParameter, exploreOnlyDirs, filterFiles) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs, filterFiles: filterFiles })
  }

  closeExplorerDialog (fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      /*
       * var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
       * var fileNameNoExtension = fileName.replace(/\.[^/.]+$/, "");
       * var path = fieldValue.path.split(fileName).slice(0, -1).join('');
       */
      const { dirPath, moduleName } = this.getDirAndModuleFromPath(fieldValue.path)
      switch (this.state.explorerParameter) {
      case "netParamsPath":
        newState["netParamsPath"] = dirPath;
        newState["simConfigPath"] = dirPath;
        newState["netParamsModuleName"] = moduleName;
        newState["simConfigModuleName"] = moduleName;
        newState['netParamsFullPath'] = fieldValue.path
        newState['simConfigFullPath'] = fieldValue.path
        break;
      case "simConfigPath":
        newState["simConfigPath"] = dirPath;
        newState["simConfigModuleName"] = moduleName;
        newState['simConfigFullPath'] = fieldValue.path
        break;
      case "modFolder":
        newState["modFolder"] = fieldValue.path;
        break;
      default:
        throw ("Not a valid parameter!");
      }
    }
    this.setState({ ...newState });
  }

  getDirAndModuleFromPath (fullpath) {
    const fileName = fullpath.replace(/^.*[\\\/]/, '');
    const moduleName = fileName.replace(/\.[^/.]+$/, "");
    const dirPath = fullpath.split(fileName).slice(0, -1).join('');

    return { dirPath, moduleName }
  }

  onNetParamsPathChange (fullpath) {
    const { dirPath, moduleName } = this.getDirAndModuleFromPath(fullpath)
    const newState = { };
    newState["netParamsPath"] = newState["simConfigPath"] = dirPath
    newState["netParamsModuleName"] = newState["simConfigModuleName"] = moduleName;
    newState["netParamsFullPath"] = fullpath;
    newState["simConfigFullPath"] = fullpath;

    this.setState({ ...newState })
  }

  onSimConfigPathChange (fullpath) {
    const { dirPath, moduleName } = this.getDirAndModuleFromPath(fullpath)
    const newState = { };
    newState["simConfigPath"] = dirPath
    newState["simConfigModuleName"] = moduleName;
    newState["simConfigFullPath"] = fullpath;
    this.setState({ ...newState })
  }

  onModFolderPathChange (fullpath) {
    this.setState({ modFolder: fullpath })
  }

  render () {
    const { classes } = this.props
    const disableLoadMod = this.state.loadMod === '' ? true : !this.state.loadMod
    switch (this.props.mode) {
    case 'IMPORT':
      var content = (
        <div>
          <div className={classes.container}>
            <IconButton
              id="appBarImportFileName"
              className={classes.icon}
              onClick={() => this.showExplorerDialog('netParamsPath', false, '.py')} 
              tooltip-data='File explorer'
            >
              <Icon className={'fa fa-folder-o listIcon'} />
            </IconButton>
            <TextField 
              className="netpyneFieldNoWidth fx-11 no-z-index"
              value={this.state.netParamsFullPath}
              onChange={event => this.onNetParamsPathChange(event.target.value)}
              label="NetParams file"
              helperText='Only .py files'
            />
          </div>


          <div className={classes.container}>
            <IconButton
              className={classes.icon}
              onClick={() => this.showExplorerDialog('simConfigPath', false, '.py')} 
              tooltip-data='File explorer'
            >
              <Icon className={'fa fa-folder-o listIcon'} />
            </IconButton>
            <TextField 
              className="netpyneFieldNoWidth fx-11 no-z-index" 
              value={this.state.simConfigFullPath} 
              onChange={event => this.onSimConfigPathChange(event.target.value)} 
              label="SimConfig file:"
              helperText='Only .py files' 
            />
              
          </div>

          <div className={classes.container}>
            <IconButton
              className={classes.icon}
              onClick={() => this.showExplorerDialog('modFolder', true, false)} 
              tooltip-data='File explorer'
            >
              <Icon className={`fa fa-folder-o ${!disableLoadMod && "listIcon"}`} />
            </IconButton>

            <TextField 
              className="netpyneFieldNoWidth fx-11 no-z-index"
              label="Path to mod files"
              disabled={disableLoadMod} 
              value={this.state.modFolder} 
              onClick={event => this.onModFolderPathChange(event.target.value)} 
              helperText={"Only mod folders"}
            />
          </div>


          <div className={classes.container}>
            <TextField 
              className="netpyneRightField fx-6 mr-2"
              label="NetParams variable" 
              value={this.state.netParamsVariable}
              onChange={event => this.setState({ netParamsVariable: event.target.value })}
            />
            <TextField
              className="netpyneRightField fx-6"
              label="SimConfig variable"
              value={this.state.simConfigVariable}
              onChange={event => this.setState({ simConfigVariable: event.target.value })}
            />
          </div>
          
          <FormControl className={classes.selectField}>
            <InputLabel className={classes.selectFieldLabel}>Are custom mod files required for this model?</InputLabel>
            <Select
              style={{ marginTop:0 }}
              value={this.state.loadMod === undefined ? '' : this.state.loadMod}
              onChange={event => this.setState({ loadMod: event.target.value })}
            >
              <MenuItem value={true}>Yes, this model requires custom mod files</MenuItem>
              <MenuItem id="appBarImportRequiresModNo" value={false} >No, this model only requires NEURON built-in mod files</MenuItem>
            </Select>
            <FormHelperText error={!this.state.loadMod}>{this.state.loadMod === undefined ? "This field is required." : ''}</FormHelperText>
          </FormControl>
            
            
          <Checkbox
            disabled={this.state.loadMod === '' ? true : !this.state.loadMod}
            className="netpyneCheckbox pt-4"
            label="Compile mod files"
            checked={this.state.compileMod}
            onChange={() => this.setState(oldState => ({ compileMod: !oldState.compileMod, }))}
          />
            
          <FileBrowser 
            open={this.state.explorerDialogOpen}
            exploreOnlyDirs={this.state.exploreOnlyDirs}
            filterFiles={this.state.filterFiles}
            onRequestClose={selection => this.closeExplorerDialog(selection)}
          />

        </div>
      )
      var command = NETPYNE_COMMANDS.importModel;
      var message = 'IMPORTING MODEL';
      var buttonLabel = 'Import'
      var title = 'Import from Python scripts'
      break;
    case 'EXPORT':
      var content = (
        <TextField
          className="netpyneField"
          label="File name"
          value={this.state.fileName}
          onChange={event => {
            this.setState({ fileName: event.target.value })
          }}
        />
      )
      var command = NETPYNE_COMMANDS.exportHLS;
      var message = 'EXPORTING MODEL';
      var buttonLabel = 'Export'
      var title = 'Export as Python script'
      break
    }
    return (
      <ActionDialog
        command ={command}
        message = {message}
        buttonLabel={buttonLabel}
        args={this.state}
        title={title}
        isFormValid={this.isFormValid}
        {...this.props}
      >
        {content}
      </ActionDialog>
    )
  }
}

export default withStyles(styles)(ImportExportHLS)