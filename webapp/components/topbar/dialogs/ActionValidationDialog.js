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

const ActionValidationDialog = (props) => {
  const [hide, setHide] = React.useState(!props.openErrorDialogBox && !props.openDialog)

  const handleClickGoBack = () => {
    setHide(true)
    clearErrorDialogBox()
  }

  const cancelDialog = () => {
    clearErrorDialogBox()
    setHide(true)
    if (props.onRequestClose) {
      props.onRequestClose()
    }
  }

  const performAction = () => {
    if (props.command) {
      if (props.isFormValid === undefined || props.isFormValid()) {
        if (typeof props?.callback !== 'undefined' && props?.callback !== null) {
          props.callback(props.command, props.args)
        } else {
          props.pythonCall(props.command, props.args)
        }
      }
    }
    setHide(true)
    if (props.onAction) {
      props.onAction()
    }
    if (props.onRequestClose) {
      props.onRequestClose()
    }
  }

  const clearErrorDialogBox = () => {
    if (props.closeBackendErrorDialog) {
      props.closeBackendErrorDialog();
    }
  }

  const {classes, errorMessage, errorDetails} = props;
  let action, title, content

  if (errorMessage === '') {
    title = props.title;
    action = (
      <Button
        id="appBarPerformActionButton"
        key="appBarPerformActionButton"
        variant="contained"
        color="primary"
        onClick={performAction}
        disabled={props.disabledButton}
      >
        {props.buttonLabel}
      </Button>
    );

    content = props.children;
  } else {
    action = (
      <Button
        variant="contained"
        color="primary"
        key="BACK"
        onClick={() => handleClickGoBack()}
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
    <Dialog
      fullWidth
      maxWidth={props.openErrorDialogBox ? 'md' : 'sm'}
      open={Boolean(!hide || props.openErrorDialogBox)}
      onClose={cancelDialog}
      className={classes.root}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={cancelDialog}
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


const StackTrace = (classes, stackTrace) => (
  <pre
    className={classes}
    dangerouslySetInnerHTML={{ __html: IPython.utils.fixConsole(stackTrace) }}
  />
);

export default withStyles(styles)(ActionValidationDialog);
