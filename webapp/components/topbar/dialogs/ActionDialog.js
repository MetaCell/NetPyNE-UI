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

  state = { hide: !this.props.openErrorDialogBox && !this.props.openDialog }

  performAction = () => {
    if (this.props.isFormValid === undefined || this.props.isFormValid()){
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
      
      this.props.pythonCall(this.props.command, this.props.args)
      this.setState({ hide: true })
    }
  }

  /*
   * componentDidUpdate (prevProps) {
   *   if (this.props.openErrorDialogBox) {
   *     this.setState({ hide: false })
   *   }
   * }
   */

  clearErrorDialogBox () {
    if (this.props.closeBackendErrorDialog) {
      this.props.closeBackendErrorDialog()
    }
  }
  
  cancelDialog = () => {
    this.clearErrorDialogBox()
    this.setState({ hide: true })
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  }

  handleClickGoBack () {
    this.setState({ hide: true })
    this.clearErrorDialogBox()
  }
  render () {

    if (this.props.errorMessage === '') {
      var title = this.props.title
      var action = (
        <Button 
          id="appBarPerformActionButton"
          key="appBarPerformActionButton"
          variant="contained"
          color="primary"
          onClick={this.performAction}
        >{this.props.buttonLabel}</Button>
      )
          
      var content = this.props.children;
    } else {
      var action = (
        <Button
          variant="contained"
          color="primary"
          key="BACK"
          onClick={() => this.handleClickGoBack()}
        >BACK</Button>
      )
          
      var title = this.props.errorMessage;
      var content = this.props.errorDetails ? Utils.parsePythonException(this.props.errorDetails) : '';
    }
    return (

      <Dialog
        fullWidth
        maxWidth={this.props.openErrorDialogBox ? 'md' : 'sm'}
        open={!this.state.hide || this.props.openErrorDialogBox}
        onClose={() => this.cancelDialog()}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={this.cancelDialog} 
            style={styles.cancel}
            key="CANCEL"
          >
            CANCEL
          </Button>
          {action}
        </DialogActions>
      </Dialog>
    );
  }
}