import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { PYTHON_CALL } from '../../redux/actions/general';

const styles = () => ({
  cancel: { marginRight: 10 },
});

class ConfirmationDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hide: !this.props.open };
  }

  handleConfirmation = () => {
    if (this.props.confirmationDialogOnConfirm
        && this.props.confirmationDialogOnConfirm.type === PYTHON_CALL) {
      this.props.pythonCall({
        cmd: this.props.confirmationDialogOnConfirm.cmd,
        args: this.props.confirmationDialogOnConfirm.args,
      });
    } else {
      console.log('confirmationAction not passed or it is not a python call');
    }
  }

  render () {
    const {
      classes,
      confirmationDialogOpen,
      confirmationDialogTitle,
      confirmationDialogMessage,
      closeConfirmationDialog,
    } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={confirmationDialogOpen}
        onClose={() => closeConfirmationDialog()}
        className={classes.root}
      >
        <DialogTitle>{confirmationDialogTitle}</DialogTitle>
        <DialogContent>
          {confirmationDialogMessage}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeConfirmationDialog}
            style={styles.cancel}
            key="CANCEL"
          >
            CANCEL
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => { this.handleConfirmation(); closeConfirmationDialog(); }}
            key="CONFIRM"
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ConfirmationDialog);
