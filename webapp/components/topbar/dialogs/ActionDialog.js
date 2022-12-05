import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { bgDarkest, fontColor } from 'root/theme';

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
    this.state = { hide: !this.props.openErrorDialogBox && !this.props.openDialog };
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

  performAction = () => {
    if (this.props.command) {
      if (this.props.isFormValid === undefined || this.props.isFormValid()) {
        if (typeof this?.props?.callback !== 'undefined' && this?.props?.callback !== null) {
          this.props.callback(this.props.command, this.props.args);
        } else {
          // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, this.props.message);
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
        <>
          <Button
          onClick={this.cancelDialog}
          style={styles.cancel}
          key="CANCEL"
        >
          CANCEL
        </Button>
        <Button
            id="appBarPerformActionButton"
            key="appBarPerformActionButton"
            variant="contained"
            color="primary"
            onClick={this.performAction}
          >
            {this.props.buttonLabel}
          </Button>
        </>

      );

      content = this.props.children;
    } else {
      action = (
        <Button
          variant="contained"
          color="primary"
          key="CLOSE"
          onClick={() => this.handleClickGoBack()}
        >
          CLOSE
        </Button>
      );

      title = errorMessage;
      if (errorDetails) {
        content = StackTrace(classes.exception, errorDetails);
      }
    }

    return (
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
          {action}
        </DialogActions>
      </Dialog>
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
