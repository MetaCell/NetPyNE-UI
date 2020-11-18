import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import Utils from '../../../Utils';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = { cancel: { marginRight: 10 } }
export default class ActionDialog extends React.Component {

  state = { hide: !this.props.openErrorDialogBox && !this.props.openDialog }

  performAction = () => {
    if (this.props.command) {
      if (this.props.isFormValid === undefined || this.props.isFormValid()) {
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);

        this.props.pythonCall(this.props.command, this.props.args)

      }
    }
    this.setState({ hide: true })
    if (this.props.onAction) {
      this.props.onAction();
    }
  }

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
    let title
    let content

    if (this.props.errorMessage === '') {
      title = this.props.title
      var action = (
        <Button
          id="appBarPerformActionButton"
          key="appBarPerformActionButton"
          variant="contained"
          color="primary"
          onClick={this.performAction}
        >{this.props.buttonLabel}</Button>
      )

      content = this.props.children;
    } else {
      var action = (
        <Button
          variant="contained"
          color="primary"
          key="BACK"
          onClick={() => this.handleClickGoBack()}
        >BACK</Button>
      )

      title = "Exception in Python kernel was thrown"
      if (this.props.errorMessage != null && typeof this.props.errorMessage == "string") {
        title = this.props.errorMessage
      } else {
        console.warn("Unknown/Undefined object was passed as error message")
      }

      content = this.props.errorDetails ? Utils.parsePythonException(this.props.errorDetails) : ''
    }

    return (
      <Dialog
        fullWidth
        maxWidth={this.props.openErrorDialogBox ? 'md' : 'sm'}
        open={Boolean(!this.state.hide || this.props.openErrorDialogBox)}
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