import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import FileBrowser from '../general/FileBrowser';
import Utils from 'root/Utils';
import { withStyles } from '@material-ui/core/styles';
import { SwitchPageButton } from 'netpyne/components';
import toolbarConfig, {
  getModelMenu,
  getTutorials,
  getViewMenu,
  getNetPyNEMenu,
} from './menuConfiguration';
import { bgRegular } from '../../theme';
import Splash from '../general/Splash';

import ImportFileDialog from './dialogs/ImportFileDialog';
import LoadFileDialog from './dialogs/LoadFile';
import LoadFileIndexDialog from './dialogs/LoadFileIndex';
import SaveFileDialog from './dialogs/SaveFile';
import NewModelDialog from './dialogs/NewModel';
import ImportExportHLSDialog from './dialogs/ImportExportHLS';
import ImportCellParamsDialog from './dialogs/ImportCellParams';
import UploadDownloadFilesDialog from './dialogs/UploadDownloadFiles';

import { TOPBAR_CONSTANTS, MODEL_STATE, DEFAULT_CONFIRMATION_DIALOG_MESSAGE, NETPYNE_COMMANDS } from '../../constants';
import { LOAD_TUTORIAL, registerModelPath, loadModel } from '../../redux/actions/general';
import OverwriteModel from './dialogs/OverwriteModel';

const styles = () => ({
  topbar: {
    backgroundColor: bgRegular,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


class Topbar extends Component {
  snackBarMessage = '';

  constructor (props) {
    super(props);
    this.state = { openSnackBar: false };
    this.menuHandler = this.menuHandler.bind(this);
  }

  closeExplorerDialog (fieldValue) {
    if (fieldValue) {
      const path = fieldValue.path
      this.props.dispatchAction(loadModel(path));
    }
    this.handleClose();
  }


  handleOpenSnackBar (message) {
    this.snackBarMessage = message;
    this.setState({ openSnackBar: true });
  }

  handleClose () {
    this.props.closeDialog();
  }

  menuHandler (click) {
    if (!click) {
      return;
    }
    switch (click.handlerAction) {
      case 'redux': {
        const [action, payload] = click.parameters;
        if (payload !== undefined) {
          this.props.dispatchAction(action(payload));
        } else {
          this.props.dispatchAction(action);
        }

        break;
      }
      case TOPBAR_CONSTANTS.NEW_PAGE: {
        const [url] = click.parameters;
        window.open(url, '_blank');
        break;
      }
      case 'menuInjector': {
        const [menuName] = click.parameters;
        if (menuName === 'Model') {
          return getModelMenu(this.props);
        }
        if (menuName === 'Tutorials') {
          return getTutorials();
        }
        if (menuName === 'View') {
          return getViewMenu(this.props);
        }
        if (menuName === 'NetPYNE') {
          return getNetPyNEMenu(this.props);
        }
        break;
      }
      case 'handleTutorial': {
        const [action, payload] = click.parameters;
        if (this.props.modelState === MODEL_STATE.INSTANTIATED || this.props.modelState === MODEL_STATE.SIMULATED) {
          this.props.openConfirmationDialog({
            title: 'Warning',
            message: DEFAULT_CONFIRMATION_DIALOG_MESSAGE,
            onConfirm: {
              type: LOAD_TUTORIAL,
              action,
              payload,
            },
          });
        } else if (payload !== undefined) {
          this.props.dispatchAction(action(payload));
        } else {
          this.props.dispatchAction(action);
        }

        break;
      }

      default:
        console.log(`Menu action not mapped, it is ${click}`);
    }
  }

  resetModel () {
    this.props.closeDialog();
    this.props.resetModel();
  }

  render () {
    const {
      classes,
      modelLoaded,
      dialogOpen,
      modelState,
      topbarDialogName,
      topbarDialogMetadata,
      openConfirmationDialog,
    } = this.props;

    let content;
    if (dialogOpen) {
      switch (topbarDialogName) {
        case TOPBAR_CONSTANTS.LOAD:
          content = (
            <LoadFileDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.SAVE_INDEX_WORKSPACE:
          content = (
            <OverwriteModel
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.LOAD_INDEX_WORKSPACE:
          content = (
            <FileBrowser
              open={dialogOpen}
              exploreOnlyDirs={true}
              // filterFiles=".npjson"
              startDir=""
              onRequestClose={(selection) => this.closeExplorerDialog(selection)}
            />
          );
          break;
        case TOPBAR_CONSTANTS.LOAD_INDEX:
          content = (
            <LoadFileIndexDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.SAVE:
          content = (
            <SaveFileDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.IMPORT_HLS:
          content = (
            <ImportExportHLSDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
              mode="IMPORT"
              modelState={modelState}
              openConfirmationDialog={(payload) => openConfirmationDialog(payload)}
            />
          );
          break;
        case TOPBAR_CONSTANTS.EXPORT_HLS:
          content = (
            <ImportExportHLSDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
              mode="EXPORT"
            />
          );
          break;
        case TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE:
          content = (
            <ImportCellParamsDialog
              open={dialogOpen}
              cellRuleName={topbarDialogMetadata.cellRuleName}
              onRequestClose={() => this.handleClose()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.NEW_MODEL:
          content = (
            <NewModelDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
              onAction={() => this.resetModel()}
            />
          );
          break;
        case TOPBAR_CONSTANTS.UPLOAD_FILES:
          content = (
            <UploadDownloadFilesDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
              openSnackBar={(message) => {
                this.handleOpenSnackBar(message);
              }}
              mode="UPLOAD"
            />
          );
          break;
        case TOPBAR_CONSTANTS.DOWNLOAD_FILES:
          content = (
            <UploadDownloadFilesDialog
              open={dialogOpen}
              onRequestClose={() => this.handleClose()}
              openSnackBar={(message) => {
                this.handleOpenSnackBar(message);
              }}
              mode="DOWNLOAD"
            />
          );
          break;
          case TOPBAR_CONSTANTS.IMPORT_NEUROML:
            content = (
              <ImportFileDialog
                open={dialogOpen}
                onRequestClose={() => this.handleClose()}
                title="Import from NeuroML 2"
                command={NETPYNE_COMMANDS.importNeuroML}
                modelState={modelState}
                extension=".net.nml"
                openConfirmationDialog={(payload) => openConfirmationDialog(payload)}
              />
            );
            break;
            case TOPBAR_CONSTANTS.IMPORT_LEMS:
              content = (
                <ImportFileDialog
                  open={dialogOpen}
                  onRequestClose={() => this.handleClose()}
                  command={NETPYNE_COMMANDS.importLEMS}
                  title="Import simulation from LEMS"
                  modelState={modelState}
                  extension=".xml"
                  openConfirmationDialog={(payload) => openConfirmationDialog(payload)}
                />
              );
              break;
        default:
          content = <div />;
          break;
      }
    }

    return (
      <div>
        <div className={classes.topbar}>
          <Menu
            configuration={toolbarConfig}
            menuHandler={this.menuHandler}
          />
          <div>
            <SwitchPageButton />
          </div>

        </div>
        {modelLoaded ? null : <Splash />}
        <Snackbar
          message={this.snackBarMessage}
          autoHideDuration={4000}
          open={this.state.openSnackBar}
          onClose={() => this.setState({ openSnackBar: false })}
        />
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(Topbar);
