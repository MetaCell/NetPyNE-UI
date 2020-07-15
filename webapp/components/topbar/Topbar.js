import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@geppettoengine/geppetto-client/js/components/interface/menu/Menu';

import toolbarConfig, { getModelMenu, getTutorials, getViewMenu } from './menuConfiguration'
import { bgRegular, bgLight, font } from '../../theme'
import Splash from '../general/Splash'

import LoadFileDialog from './dialogs/LoadFile';
import SaveFileDialog from './dialogs/SaveFile';
import NewModelDialog from './dialogs/NewModel';
import ImportExportHLSDialog from './dialogs/ImportExportHLS';
import ImportCellParamsDialog from './dialogs/ImportCellParams'
import UploadDownloadFilesDialog from './dialogs/UploadDownloadFiles';

import { TOPBAR_CONSTANTS } from '../../constants';
import { withStyles } from '@material-ui/core/styles'
import { SwitchPageButton } from 'netpyne/components'

const styles = () => ({ 
  topbar: { 
    backgroundColor: bgRegular,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  } 
});

class Topbar extends Component {

  state = { openSnackBar: false }
  snackBarMessage = ""
  menuHandler (click) {
    if (!click) {
      return
    } 
    switch (click.handlerAction) {
    case 'redux':{
      const [action, payload] = click.parameters
      if (payload !== undefined) {
        this.props.dispatchAction(action(payload))
      } else {
        this.props.dispatchAction(action)
      }
      
      break;
    }
    case TOPBAR_CONSTANTS.NEW_PAGE:{
      const [url] = click.parameters
      window.open(url, "_blank")
      break
    }
    case 'menuInjector': {
      const [ menuName ] = click.parameters
      if (menuName === "Model") {
        return getModelMenu(this.props)
      }
      if (menuName === "Tutorials") {
        return getTutorials()
      }
      if (menuName === "View") {
        return getViewMenu(this.props)
      }
      break
    }
      
    default:
      console.log("Menu action not mapped, it is " + click);
    }
  }

  handleClose () {
    this.props.closeDialog()
  }

  resetModel () {
    this.props.closeDialog()
    this.props.resetModel()
  }

  handleOpenSnackBar (message) {
    this.snackBarMessage = message
    this.setState({ openSnackBar: true }) 
  }

  render () {
    var content
    if (this.props.dialogOpen){
      switch (this.props.topbarDialogName){
      case TOPBAR_CONSTANTS.LOAD:
        content = <LoadFileDialog
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
        />
        break;
      case TOPBAR_CONSTANTS.SAVE:
        content = <SaveFileDialog
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
        />
        break;
      case TOPBAR_CONSTANTS.IMPORT_HLS:
        content = <ImportExportHLSDialog 
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
          mode ={"IMPORT"}/>
        break;
      case TOPBAR_CONSTANTS.EXPORT_HLS:
        content = <ImportExportHLSDialog 
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
          mode ={"EXPORT"}
        />
        break;
      case TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE:
        content = <ImportCellParamsDialog
          open={this.props.dialogOpen}
          cellRuleName={this.props.topbarDialogMetadata.cellRuleName}
          onRequestClose={() => this.handleClose()}
        />
        break;
      case TOPBAR_CONSTANTS.NEW_MODEL:
        content = <NewModelDialog
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
          onAction={() => this.resetModel()}
        />
        break;
      case TOPBAR_CONSTANTS.UPLOAD_FILES:
        content = <UploadDownloadFilesDialog
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
          openSnackBar={message => {
            this.handleOpenSnackBar(message)
          } }
          mode ={"UPLOAD"}/>
        break;
      case TOPBAR_CONSTANTS.DOWNLOAD_FILES:
        content = <UploadDownloadFilesDialog 
          open={this.props.dialogOpen}
          onRequestClose={() => this.handleClose()}
          openSnackBar={message => {
            this.handleOpenSnackBar(message)
          } }
          mode ={"DOWNLOAD"}
        />
        break;
      }
    }

    return (
      <div>
        <div className={this.props.classes.topbar}>
          <Menu
            configuration={toolbarConfig}
            menuHandler={this.menuHandler.bind(this)}
          />
          <div>
            
            <SwitchPageButton/>
          </div>

        </div>
        { this.props.modelLoaded ? null : <Splash/> }
        <Snackbar
          message={this.snackBarMessage}
          autoHideDuration={4000}
          open={this.state.openSnackBar}
          onClose={() => this.setState({ openSnackBar: false })}
        />
        {content}
      </div>
      
    )
  }
}

export default withStyles(styles)(Topbar)