import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const useStyles = () => ({
  root: {
    '& .cancel': { marginRight: 10 },
    '&. heading': { color: 'white' },
  },
});

const ExperimentDialog = (props) => {
  const {
    classes,
    open,
    dialogClose,
    createExperiment,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => dialogClose(false)}
    >
      <DialogTitle>Create New Experiment</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle" className={classes.heading}>The new experiment will replace the current experiment in design, are you sure you want to proceed?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => dialogClose(false)}
          className={classes.cancel}
          key="CANCEL"
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => createExperiment(false)}
        >
          CONFIRM
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(useStyles)(ExperimentDialog);
