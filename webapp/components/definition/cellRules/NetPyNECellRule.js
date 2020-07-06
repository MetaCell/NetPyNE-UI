import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { NetPyNESelectField, NetPyNETextField, NetPyNEField, NetPyNECoordsRange } from 'netpyne/components';
import Utils from '../../../Utils';
import Accordion from '../../general/ExpansionPanel'
import { withStyles } from "@material-ui/core/styles"

class NetPyNECellRule extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      errorMessage: undefined,
      errorDetails: undefined
    };
  }

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "CellRule");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.cellParams', storedValue, newValue, (response, newValue) => {
          this.renaming = false; 
        });
        this.renaming = true;
      });
    }
  }

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  postProcessMenuItems (pythonData, selected) {
    return pythonData.map(name => (
      <MenuItem
        id={name + "MenuItem"}
        key={name}
        checked={selected.indexOf(name) > -1}
        value={name}
      >
        {name}
      </MenuItem>
    ));
  }

  render () {
    const { classes } = this.props
    var dialogPop = (this.state.errorMessage != undefined ? (
      <Dialog
        open={true}
        style={{ whiteSpace: "pre-wrap" }}>
        <DialogTitle id="alert-dialog-title">{this.state.errorMessage}</DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {this.state.errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          >BACK</Button>
        </DialogActions>
      </Dialog> 
    )
      : undefined
    )
    return (
      <div>
        <div className={classes.root}>

          <TextField
            variant="filled" 
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            label="The name of the cell type"
            id={"cellRuleName"}
          />

          <Box m={1}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => this.props.HandleAddNewSection()}
            >Add new section</Button>
          </Box>
          
          <Box m={1}>
            <Button 
              variant="contained"
              color="secondary"
              onClick={() => this.props.openTopbarDialog(this.state.currentName)}
            >Import cell template</Button>  
          </Box>

          
        </div>
        {dialogPop}
      </div>
    );
  }
}


const styles = ({ shape, spacing }) => ({
  expandable: {
    borderRadius: shape.borderRadius,
    backgroundColor: 'inherit',
    paddingTop: spacing(2),
    "&::before": { content: 'unset' }
  },
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export default withStyles(styles)(NetPyNECellRule)