import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// index.js uses connect to bind redux state and actions, must stay a class.
// eslint-disable-next-line react/prefer-stateless-function
export default class DialogBox extends React.Component {
  render () {
    const {
      open,
      onDialogResponse,
      textForDialog,
    } = this.props;

    return (
      <Dialog
        open={open}
      >
        <DialogTitle>{textForDialog?.heading}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {textForDialog?.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="confirmCancel"
            onClick={() => onDialogResponse(false)}
          >
            Cancel
          </Button>
          <Button
            id="confirmDeletion"
            color="primary"
            onClick={() => onDialogResponse(true)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
