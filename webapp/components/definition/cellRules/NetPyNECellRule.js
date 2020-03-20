import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { NetPyNESelectField, NetPyNEField, NetPyNECoordsRange } from 'netpyne/components';
import Utils from '../../../Utils';

export default class NetPyNECellRule extends React.Component {

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
        <div>

          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            label="The name of the cell rule"
            className={"netpyneField"}
            id={"cellRuleName"}
          />

          <div style={{ float: 'left', marginTop: '20px' }}>
            <b>Conditions:</b>
          </div>

          <NetPyNEField id={"netParams.cellParams.conds.cellType"} >
            <SelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellType']"}
              method={"netpyne_geppetto.getAvailableCellTypes"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>
          
          <NetPyNEField id={"netParams.cellParams.conds.cellModel"} >
            <SelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['cellModel']"}
              method={"netpyne_geppetto.getAvailableCellModels"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>

          <NetPyNEField id={"netParams.cellParams.conds.pop"} >
            <SelectField
              model={"netParams.cellParams['" + this.state.currentName + "']['conds']['pop']"}
              method={"netpyne_geppetto.getAvailablePops"}
              postProcessItems={this.postProcessMenuItems}
              multiple={true}
            />
          </NetPyNEField>

          <NetPyNECoordsRange
            id="xRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'x', label: 'Absolute' },
              { value: 'xnorm', label: 'Normalized' }
            ]}
          />

          <NetPyNECoordsRange
            id="yRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'y', label: 'Absolute' },
              { value: 'ynorm', label: 'Normalized' }
            ]}
          />

          <NetPyNECoordsRange
            id="zRangeCellParams"
            name={this.state.currentName}
            model={'netParams.cellParams'}
            conds={'conds'}
            items={[
              { value: 'z', label: 'Absolute' },
              { value: 'znorm', label: 'Normalized' }
            ]}
          />

        </div>
        {dialogPop}
      </div>
    );
  }
}
