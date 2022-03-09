import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';

import { withStyles } from '@material-ui/core/styles';

import { ActionDialog, Tooltip } from 'netpyne/components';
import { NETPYNE_COMMANDS, MODEL_STATE } from '../../../constants';
import { PYTHON_CALL } from '../../../redux/actions/general';
import FileBrowser from '../../general/FileBrowser';
import Checkbox from '../../general/Checkbox';

const styles = ({
  spacing,
  typography,
  zIndex,
}) => ({
  container: {
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%',
  },
  selectField: {
    marginTop: spacing(3),
    width: '100%',
  },
  selectFieldLabel: { top: -spacing(2) },
  icon: {
    '&:hover': { backgroundColor: 'inherit' },
    flex: '0 0 4%',
    marginRight: spacing(2),
    width: typography.h3.fontSize,
    height: typography.h3.fontSize,
    padding: '0px!important',
    zIndex: zIndex.modal,
  },
});

class ImportExportHLS extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.initialState();

    this.isFormValid = this.isFormValid.bind(this);
  }

  initialState () {
    return {
      fileName: 'output',
      netParamsPath: '',
      netParamsModuleName: '',
      netParamsVariable: 'netParams',
      simConfigPath: '',
      simConfigModuleName: '',
      simConfigVariable: 'simConfig',
      modFolder: '',
      loadMod: false,
      compileMod: false,
      explorerDialogOpen: false,
      explorerParameter: '',
      exploreOnlyDirs: false,
      filterFiles: false,
      netParamsHovered: 'hidden',
      netParamsFullPath: '',
      simConfigFullPath: '',
    };
  }

  isFormValid () {
    if (this.props.mode === 'IMPORT') {
      // FIXME: Set to undefine to show error text. No particularly elegant
      if (this.state.loadMod === '') {
        this.setState({ loadMod: undefined });
      }
      return this.state.loadMod !== undefined && this.state.loadMod !== '';
    }
    return true;
  }

  showExplorerDialog (explorerParameter, exploreOnlyDirs, filterFiles) {
    this.setState({
      explorerDialogOpen: true,
      explorerParameter,
      exploreOnlyDirs,
      filterFiles,
    });
  }

  closeExplorerDialog (fieldValue) {
    const newState = { explorerDialogOpen: false };
    if (fieldValue) {
      /*
       * var fileName = fieldValue.path.replace(/^.*[\\\/]/, '');
       * var fileNameNoExtension = fileName.replace(/\.[^/.]+$/, "");
       * var path = fieldValue.path.split(fileName).slice(0, -1).join('');
       */
      const {
        dirPath,
        moduleName,
      } = this.getDirAndModuleFromPath(fieldValue.path);
      switch (this.state.explorerParameter) {
        case 'netParamsPath':
          newState.netParamsPath = dirPath;
          newState.simConfigPath = dirPath;
          newState.netParamsModuleName = moduleName;
          newState.simConfigModuleName = moduleName;
          newState.netParamsFullPath = fieldValue.path;
          newState.simConfigFullPath = fieldValue.path;
          break;
        case 'simConfigPath':
          newState.simConfigPath = dirPath;
          newState.simConfigModuleName = moduleName;
          newState.simConfigFullPath = fieldValue.path;
          break;
        case 'modFolder':
          newState.modFolder = fieldValue.path;
          newState.loadMod = true;
          break;
        default:
          throw Error('Not a valid parameter!');
      }
    }
    this.setState({ ...newState });
  }

  getDirAndModuleFromPath (fullpath) {
    const fileName = fullpath.replace(/^.*[\\/]/, '');
    const moduleName = fileName.replace(/\.[^/.]+$/, '');
    const dirPath = fullpath.split(fileName)
      .slice(0, -1)
      .join('');

    return {
      dirPath,
      moduleName,
    };
  }

  onNetParamsPathChange (fullpath) {
    const {
      dirPath,
      moduleName,
    } = this.getDirAndModuleFromPath(fullpath);
    const newState = {};
    newState.netParamsPath = newState.simConfigPath = dirPath;
    newState.netParamsModuleName = newState.simConfigModuleName = moduleName;
    newState.netParamsFullPath = fullpath;
    newState.simConfigFullPath = fullpath;

    this.setState({ ...newState });
  }

  onSimConfigPathChange (fullpath) {
    const {
      dirPath,
      moduleName,
    } = this.getDirAndModuleFromPath(fullpath);
    const newState = {};
    newState.simConfigPath = dirPath;
    newState.simConfigModuleName = moduleName;
    newState.simConfigFullPath = fullpath;
    this.setState({ ...newState });
  }

  onModFolderPathChange (fullpath) {
    if (fullpath !== '') {
      this.setState({
        modFolder: fullpath,
        loadMod: true,
      });
    } else {
      this.setState({
        modFolder: fullpath,
        loadMod: false,
      });
    }
  }

  handleConfirmation (command, args) {
    this.props.openConfirmationDialog({
      title: 'Warning',
      message: 'A NetPyNE model has already been instantiated or simulated.'
      + ' Continuing with this import action will use the old value of netParams and simConfig for the new model. Do you want to continue?',
      onConfirm: {
        type: PYTHON_CALL,
        cmd: command,
        args,
      },
    });
  }

  render () {
    const { classes, modelState } = this.props;
    switch (this.props.mode) {
      case 'IMPORT':
        var content = (
          <div>
            <TextField
              variant="filled"
              fullWidth
              value={this.state.netParamsFullPath}
              onChange={(event) => this.onNetParamsPathChange(event.target.value)}
              label="NetParams file"
              helperText="Only .py files"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="File explorer" placement="top">
                      <Icon
                        className="fa fa-folder hovered"
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.showExplorerDialog('netParamsPath', false, '.py')}
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <Box mt={1} mb={2}>
              <TextField
                variant="filled"
                fullWidth
                label="NetParams variable"
                value={this.state.netParamsVariable}
                onChange={(event) => this.setState({ netParamsVariable: event.target.value })}
              />
            </Box>

            <TextField
              variant="filled"
              fullWidth
              value={this.state.simConfigFullPath}
              onChange={(event) => this.onSimConfigPathChange(event.target.value)}
              label="SimConfig file:"
              helperText="Only .py files"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="File explorer" placement="top">
                      <Icon
                        className="fa fa-folder hovered"
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.showExplorerDialog('simConfigPath', false, '.py')}
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <Box mt={1} mb={2}>
              <TextField
                variant="filled"
                fullWidth
                label="SimConfig variable"
                value={this.state.simConfigVariable}
                onChange={(event) => this.setState({ simConfigVariable: event.target.value })}
              />
            </Box>

            <TextField
              variant="filled"
              fullWidth
              label="Path to mod files"
              value={this.state.modFolder}
              onChange={(event) => this.onModFolderPathChange(event.target.value)}
              helperText="Important: if external mod files are required please select the mod folder path"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="File explorer" placement="top">
                      <Icon
                        onClick={() => this.showExplorerDialog('modFolder', true, false)}
                        className="fa fa-folder hovered"
                        style={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <Checkbox
              fullWidth
              noBackground
              label="Compile mod files"
              checked={this.state.compileMod}
              onChange={() => this.setState((oldState) => ({ compileMod: !oldState.compileMod }))}
            />

            <FileBrowser
              open={this.state.explorerDialogOpen}
              exploreOnlyDirs={this.state.exploreOnlyDirs}
              filterFiles={this.state.filterFiles}
              onRequestClose={(selection) => this.closeExplorerDialog(selection)}
            />

          </div>
        );
        var command = NETPYNE_COMMANDS.importModel;
        var message = 'IMPORTING MODEL';
        var buttonLabel = 'Import';
        var title = 'Import from Python scripts';
        break;
      case 'EXPORT':
        var content = (
          <TextField
            variant="filled"
            fullWidth
            label="File name"
            value={this.state.fileName}
            onChange={(event) => this.setState({ fileName: event.target.value })}
          />
        );
        var command = NETPYNE_COMMANDS.exportHLS;
        var message = 'EXPORTING MODEL';
        var buttonLabel = 'Export';
        var title = 'Export as Python script';
        break;
    }

    return (
      this.props.mode === 'IMPORT' ? (
        <ActionDialog
          command={command}
          message={message}
          buttonLabel={buttonLabel}
          args={this.state}
          title={title}
          isFormValid={this.isFormValid}
          callback={modelState === MODEL_STATE.INSTANTIATED || modelState === MODEL_STATE.SIMULATED ? (command, args) => { this.handleConfirmation(command, args); } : undefined}
          {...this.props}
        >
          {content}
        </ActionDialog>
      ) : (
        <ActionDialog
          command={command}
          message={message}
          buttonLabel={buttonLabel}
          args={this.state}
          title={title}
          isFormValid={this.isFormValid}
          {...this.props}
        >
          {content}
        </ActionDialog>
      )
    );
  }
}

export default withStyles(styles)(ImportExportHLS);
