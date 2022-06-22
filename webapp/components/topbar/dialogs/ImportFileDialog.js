import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';

import { withStyles } from '@material-ui/core/styles';

import { ActionDialog, Tooltip } from 'netpyne/components';
import { NETPYNE_COMMANDS, MODEL_STATE, DEFAULT_CONFIRMATION_DIALOG_MESSAGE } from '../../../constants';
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

class ImportFileDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();

    this.isFormValid = this.isFormValid.bind(this);
  }

  initialState() {
    return {
      fileName: null,
      modFolder: '',
      loadMod: false,
      compileMod: false,
      explorerDialogOpen: false,
      explorerParameter: '',
      exploreOnlyDirs: false,
      filterFiles: false,
    };
  }

  isFormValid() {

    // FIXME: Set to undefine to show error text. No particularly elegant
    if (this.state.loadMod === '') {
      this.setState({ loadMod: undefined });
    }
    return this.state.loadMod !== undefined && this.state.loadMod !== '';
  }



  showExplorerDialog(explorerParameter, exploreOnlyDirs, filterFiles) {
    this.setState({
      explorerDialogOpen: true,
      explorerParameter,
      exploreOnlyDirs,
      filterFiles,
    });
  }

  closeExplorerDialog(fieldValue) {
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
        case 'file':
          newState.fileName=fieldValue?.path
          newState.modFolder = dirPath;
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

  getDirAndModuleFromPath(fullpath) {
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

  onFilePathChange(fullpath) {
    this.setState({ fileName: fullpath });
  }


  onModFolderPathChange(fullpath) {
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

  handleConfirmation(command, args) {
    this.props.openConfirmationDialog({
      title: 'Warning',
      message: DEFAULT_CONFIRMATION_DIALOG_MESSAGE,
      onConfirm: {
        type: PYTHON_CALL,
        cmd: command,
        args,
      },
    });
  }

  render() {
    const { classes, modelState, extension, title, command } = this.props;
    const message = 'IMPORTING MODEL';
    const buttonLabel = 'Import';



    return (
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
        <Box>
          <TextField
            variant="filled"
            fullWidth
            value={this.state.fileName}
            onChange={(event) => this.onFilePathChange(event.target.value)}
            label="Choose file"
            helperText={`Only ${extension} files`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.showExplorerDialog('file', false, extension)}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
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
        </Box>
        <FileBrowser
          open={this.state.explorerDialogOpen}
          exploreOnlyDirs={this.state.exploreOnlyDirs}
          filterFiles={this.state.filterFiles}
          onRequestClose={(selection) => this.closeExplorerDialog(selection)}
        />
      </ActionDialog>
    )
      ;
  }
}

export default withStyles(styles)(ImportFileDialog);
