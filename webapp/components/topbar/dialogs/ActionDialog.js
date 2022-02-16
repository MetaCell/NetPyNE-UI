import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { bgDarkest, fontColor, textColor } from 'root/theme';
import { MODEL_STATE, NETPYNE_COMMANDS } from '../../../constants';

const styles = () => ({
  cancel: { marginRight: 10 },
  exception: {
    whiteSpace: 'pre-wrap',
    backgroundColor: bgDarkest,
    color: fontColor,
  },
});

class ActionDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hide: !this.props.openErrorDialogBox && !this.props.openDialog,
      showConfirmationDialog: false,
    };
  }

  handleClickGoBack () {
    this.setState({ hide: true });
    this.clearErrorDialogBox();
  }

  cancelDialog = () => {
    this.clearErrorDialogBox();
    this.setState({ hide: true });
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  };

  continueImportAction = () => {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
    this.props.pythonCall(this.props.command, this.props.args);
    this.setState({ hide: true });
    if (this.props.onAction) {
      this.props.onAction();
    }
  }

  performAction = () => {
    if (this.props.command) {
      if (this.props.isFormValid === undefined || this.props.isFormValid()) {
        if (this.props.command === NETPYNE_COMMANDS.importModel && (this.props.modelState === MODEL_STATE.INSTANTIATED || this.props.modelState === MODEL_STATE.SIMULATED)) {
          this.setState({ showConfirmationDialog: true });
        } else {
          GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
          this.props.pythonCall(this.props.command, this.props.args);
        }
      }
    }
    this.setState({ hide: true });
    if (this.props.onAction) {
      this.props.onAction();
    }
  };

  clearErrorDialogBox () {
    if (this.props.closeBackendErrorDialog) {
      this.props.closeBackendErrorDialog();
    }
  }

  render () {
    const {
      classes,
      errorMessage,
      errorDetails,
    } = this.props;

    let action;
    let title;
    let content;

    if (errorMessage === '') {
      title = this.props.title;
      action = (
        <Button
          id="appBarPerformActionButton"
          key="appBarPerformActionButton"
          variant="contained"
          color="primary"
          onClick={this.performAction}
        >
          {this.props.buttonLabel}
        </Button>
      );

      content = this.props.children;
    } else {
      action = (
        <Button
          variant="contained"
          color="primary"
          key="BACK"
          onClick={() => this.handleClickGoBack()}
        >
          BACK
        </Button>
      );

      title = errorMessage;
      if (errorDetails) {
        content = StackTrace(classes.exception, errorDetails);
      }
    }

    return (
      <>
        <Dialog
          fullWidth
          maxWidth={this.props.openErrorDialogBox ? 'md' : 'sm'}
          open={Boolean(!this.state.hide || this.props.openErrorDialogBox)}
          onClose={() => this.cancelDialog()}
          className={classes.root}
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

        <Dialog
          fullWidth
          maxWidth={this.props.openErrorDialogBox ? 'md' : 'sm'}
          open={this.state.showConfirmationDialog}
          onClose={() => this.setState({ showConfirmationDialog: false })}
          className={classes.root}
        >
          <DialogTitle>Warning</DialogTitle>
          <DialogContent style={{ color: textColor }}>
            A NetPyNE model has already been instantiated or simulated. Continuing this import action will use the old values of
            netParams and simConfig for the new model. Do you want to continue?
          </DialogContent>
          <DialogActions>
            <Button
              style={styles.cancel}
              onClick={() => this.setState({ showConfirmationDialog: false })}
            >
              CANCEL
            </Button>
            <Button variant="contained" color="primary" onClick={this.continueImportAction}>CONTINUE</Button>
          </DialogActions>

        </Dialog>
      </>
    );
  }
}

const StackTrace = (classes, stackTrace) => (
  <pre
    className={classes}
    dangerouslySetInnerHTML={{ __html: IPython.utils.fixConsole(stackTrace) }}
  />
);

export default withStyles(styles)(ActionDialog);
