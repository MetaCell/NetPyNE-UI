/**
 * Tabbed Drawer resizable component
 * It uses the components DrawerButton and Rnd to create a resizable Tabbed Drawer.
 *
 *  @author Dario Del Piano
 *  @author Adrian Quintana
 */

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DeleteDialogBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: props.open,
      response: false,
    };
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open != this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  render () {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogTitle>{this.props.textForDialog?.heading}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.textForDialog?.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="confirmCancel"
            onClick={() => this.props.onDialogResponse(false)}
          >
            Cancel
          </Button>
          <Button
            id="confirmDeletion"
            color="primary"
            onClick={() => this.props.onDialogResponse(true)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
