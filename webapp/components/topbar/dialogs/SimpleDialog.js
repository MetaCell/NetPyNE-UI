import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  cancel: { marginRight: 10 },
});

/**
 * Customizable Dialog Component with action and cancel buttons.
 */
const SimpleDialog = (props) => {
  const {
    classes, title, open, onClose, onAction, actionLabel, children,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      className={classes.root}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(SimpleDialog);
