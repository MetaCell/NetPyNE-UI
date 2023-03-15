import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { PYTHON_CALL, LOAD_TUTORIAL } from '../../redux/actions/general';

const styles = () => ({
  cancel: { marginRight: 10 },
});

class ConfirmationDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hide: !this.props.open };
  }

  handleConfirmation = () => {
    if (this.props.confirmationDialogOnConfirm) {
      if (this.props.confirmationDialogOnConfirm.type === PYTHON_CALL) {
        this.props.pythonCall(this.props.confirmationDialogOnConfirm.cmd, this.props.confirmationDialogOnConfirm.args);
      } else if (this.props.confirmationDialogOnConfirm.type === LOAD_TUTORIAL) {
        if (this.props.confirmationDialogOnConfirm.payload !== undefined) {
          this.props.dispatchAction(this.props.confirmationDialogOnConfirm.action(this.props.confirmationDialogOnConfirm.payload));
        } else {
          this.props.dispatchAction(this.props.confirmationDialogOnConfirm.action);
        }
      }
    } 
  }

  render () {
    const {
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
      >
        <DialogTitle>{confirmationDialogTitle}</DialogTitle>
        <DialogContent style={{ color: 'white' }}>
          {confirmationDialogMessage}
        </DialogContent>
        <DialogActions>
          {this.props.confirmationDialogOnConfirm && <Button
            onClick={closeConfirmationDialog}
            style={styles.cancel}
            key="CANCEL"
          >
            CANCEL
          </Button> }
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
