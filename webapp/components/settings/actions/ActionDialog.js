import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import Utils from '../../../Utils';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = { cancel: { marginRight: 10 } }
export default class ActionDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: this.props.open,
      errorMessage: undefined,
      errorDetails: undefined
    }
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.open != prevProps.open) {
      this.setState({ open: this.props.open });
    }
  }

  performAction = () => {
    if (this.props.isFormValid === undefined || this.props.isFormValid()){
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
      this.closeDialog();
      Utils
        .evalPythonMessage(this.props.command, [this.props.args])
        .then(response => {
          if (!this.processError(response)) {
            if (this.props.command == "netpyne_geppetto.exportModel") {
              this.downloadJsonResponse(response)
            } else if (this.props.command == 'netpyne_geppetto.exportHLS') {
              this.downloadPythonResponse(response)
            }
            if (this.props.args.tab != undefined) {
              this.props.changeTab(this.props.args.tab, this.props.args);
            }
            if (this.props.args.tab == 'simulate') {
              GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
              GEPPETTO.Manager.loadModel(response);
              GEPPETTO.CommandController.log("The NetPyNE model " + this.props.args.tab + " was completed");
            }
            if (this.props.args.action == "deleteModel") {
              GEPPETTO.WidgetFactory.getController(GEPPETTO.Widgets.POPUP).then(controller => {
                controller.widgets.forEach(widget => {
                  widget.destroy()
                })
              })
            }
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.props.onRequestClose();
          }
        });
    }
  }
  
  closeDialog = () => {
    this.setState({ open: false, errorMessage: undefined, errorDetails: undefined })
  }

  cancelDialog = () => {
    this.setState({ open: false, errorMessage: undefined, errorDetails: undefined })
    this.props.onRequestClose();
  }

  processError = response => {
    var parsedResponse = Utils.getErrorResponse(response);
    if (parsedResponse) {
      GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
      this.setState({ open: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
      return true;
    }
    return false;
  }

  downloadJsonResponse (jsonData) {
    var filename = this.createFileName('NetPyNE_Model_')
    
    if (jsonData.simConfig && jsonData.simConfig.filename) {
      filename = this.createFileName(jsonData.simConfig.filename + '_')
    }

    filename += '.json'

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type : 'application/json' });
    this.forceBlobDownload(blob, filename)
    
  }

  unescapeText (text) {
    text = text.replace(/\\\\/g, '\\').replace(/\\\'/g, "'").replace(/\\\"/g, '"').split('\\n').join('\n').substring(1)
    return text.substring(0, text.length - 1)
  }

  downloadPythonResponse (textData) {
    var filename = this.createFileName('NetPyNE_init_') + '.py'
    const blob = new Blob([this.unescapeText(textData)], { type : 'text/plain;charset=utf-8' });
    this.forceBlobDownload(blob, filename)
  }

  createFileName (name) {
    return name + this.getTimeStamp()
  }

  getTimeStamp () {
    return new Date().toGMTString().replace(",", '').replace(/[ ,:]/g, '_')
  }

  forceBlobDownload (blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  render () {
    if (this.state.open) {
      var cancelAction = (
        <Button 
          color="primary" 
          onClick={this.cancelDialog} 
          style={styles.cancel}
          key="CANCEL" 
        >CANCEL</Button>
      );
      if (this.state.errorMessage == undefined) {
        var title = this.props.title
        var actions = [
          cancelAction, 
          <Button 
            id="appBarPerformActionButton"
            key="appBarPerformActionButton"
            variant="contained"
            color="primary"
            onClick={this.performAction}
          >{this.props.buttonLabel}</Button>
        ];
        var content = this.props.children;
      } else {
        var actions = [
          cancelAction,
          <Button
            variant="contained"
            color="primary"
            key="BACK"
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          >BACK</Button>
        ];
        var title = this.state.errorMessage;
        var content = Utils.parsePythonException(this.state.errorDetails);
      }
      return (

        <Dialog
          open={this.state.open}
          onClose={() => this.closeDialog()}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {content}   
          </DialogContent>
          <DialogActions>
            {actions}
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  }
}