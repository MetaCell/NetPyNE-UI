import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Utils from '../../../Utils';
import FontIcon from '@material-ui/core/Icon';
import CardContent from '@material-ui/core/CardContent';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import NetPyNEField from '../../general/NetPyNEField';
import ListComponent from '../../general/List';
import Select from '../../general/Select';
import NetPyNECoordsRange from '../../general/NetPyNECoordsRange';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';


import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PythonMethodControlledSelectFieldConnection from '../../../redux/reduxconnect/PythonMethodControlledSelectFieldConnection'
var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(Select);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class NetPyNEConnectivityRule extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined
    };
  }

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "ConnectionRule");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.connParams', storedValue, newValue, (response, newValue) => {
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

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  getBottomNavigationAction (index, sectionId, label, icon, id) {
    return <BottomNavigationAction
      id={id}
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  render () {
    var dialogPop = (this.state.errorMessage != undefined) ? (
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

    if (this.state.sectionId == "General") {
      var content = (
        <div>
          <TextField
            id={"ConnectivityName"}
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            label="The name of the connectivity rule"
            className="netpyneField"
          />

          <NetPyNEField id="netParams.connParams.sec" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.connParams['" + this.props.name + "']['sec']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.loc" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.connParams['" + this.props.name + "']['loc']"}
            />
          </NetPyNEField>

          <NetPyNEField id={"netParams.connParams.synMech"} >
            <PythonMethodControlledSelectFieldConnection
              model={"netParams.connParams['" + this.props.name + "']['synMech']"}
              method={"netpyne_geppetto.getAvailableSynMech"}
              postProcessItems={(pythonData, selected) => pythonData.map(name => (
                <MenuItem 
                  id={name + "MenuItem"}
                  key={name}
                  value={name}
                >
                  {name} 
                </MenuItem>
              ))}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.convergence" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['convergence']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.divergence" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['divergence']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.probability" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['probability']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.synsPerConn" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['synsPerConn']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.weight" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['weight']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.delay" className="listStyle" noStyle>
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['delay']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.connParams.plasticity" >
            <PythonControlledTextField
              model={"netParams.connParams['" + this.props.name + "']['plasticity']"}
            />
          </NetPyNEField>
          {dialogPop}
        </div>
      )
    } else if (this.state.sectionId == "Pre Conditions") {
      var content = <div>
        <NetPyNEField id={"netParams.connParams.preConds.pop"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['preConds']['pop']"}
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.preConds.cellModel"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['preConds']['cellModel']"}
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.preConds.cellType"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['preConds']['cellType']"}
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>

        <NetPyNECoordsRange
          id="xRangePreConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            { value: 'x', label: 'Absolute' },
            { value: 'xnorm', label: 'Normalized' }
          ]}
        />

        <NetPyNECoordsRange
          id="yRangePreConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            { value: 'y', label: 'Absolute' },
            { value: 'ynorm', label: 'Normalized' }
          ]}
        />

        <NetPyNECoordsRange
          id="zRangePreConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'preConds'}
          items={[
            { value: 'z', label: 'Absolute' },
            { value: 'znorm', label: 'Normalized' }
          ]}
        />

      </div>
    } else if (this.state.sectionId == "Post Conditions") {
      var content = <div>
        <NetPyNEField id={"netParams.connParams.postConds.pop"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['postConds']['pop']"}
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.postConds.cellModel"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['postConds']['cellModel']"}
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>
        <NetPyNEField id={"netParams.connParams.postConds.cellType"} >
          <PythonMethodControlledSelectFieldConnection
            model={"netParams.connParams['" + this.props.name + "']['postConds']['cellType']"}
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple
          />
        </NetPyNEField>

        <NetPyNECoordsRange
          id="xRangePostConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            { value: 'x', label: 'Absolute' },
            { value: 'xnorm', label: 'Normalized' }
          ]}
        />

        <NetPyNECoordsRange
          id="yRangePostConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            { value: 'y', label: 'Absolute' },
            { value: 'ynorm', label: 'Normalized' }
          ]}
        />

        <NetPyNECoordsRange
          id="zRangePostConn"
          name={this.props.name}
          model={'netParams.connParams'}
          conds={'postConds'}
          items={[
            { value: 'z', label: 'Absolute' },
            { value: 'znorm', label: 'Normalized' }
          ]}
        />

      </div>
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'General', 'General', 'fa-bars', 'generalConnTab'));
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'Pre Conditions', 'Pre-synaptic cells conditions', 'fa-caret-square-o-left', "preCondsConnTab"));
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'Post Conditions', 'Post-synaptic cells conditions', 'fa-caret-square-o-right', 'postCondsConnTab'));

    return (
      <div>
        <CardContent>
          <BottomNavigation value={this.state.selectedIndex}>
            {bottomNavigationItems}
          </BottomNavigation>
        </CardContent>
        <br />
        {content}
      </div>
    );

  }

  handleChange = (event, index, values) => this.setState({ values });

}
