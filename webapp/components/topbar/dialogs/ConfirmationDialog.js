import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  cancel: { marginRight: 10 },
});

class ConfirmationDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hide: !this.props.open };
  }

  cancelDialog = () => {
    this.props.closeDialog();
  };

  render () {
    const {
      classes,
      title,
      action,
      open,
      closeDialog,
      confirmationMessage,
    } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => closeDialog()}
        className={classes.root}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {confirmationMessage}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.cancelDialog}
            style={styles.cancel}
            key="CANCEL"
          >
            CANCEL
          </Button>
          <Button onClick={() => action()} key="CONFIRM">
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ConfirmationDialog);
