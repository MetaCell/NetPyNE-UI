import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';

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

import LoadFileDialog from './dialogs/LoadFile';
import SaveFileDialog from './dialogs/SaveFile';
import NewModelDialog from './dialogs/NewModel';
import ImportExportHLSDialog from './dialogs/ImportExportHLS';
import ImportCellParamsDialog from './dialogs/ImportCellParams';
import UploadDownloadFilesDialog from './dialogs/UploadDownloadFiles';

import { TOPBAR_CONSTANTS } from '../../constants';

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
      topbarDialogName,
      topbarDialogMetadata,
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
