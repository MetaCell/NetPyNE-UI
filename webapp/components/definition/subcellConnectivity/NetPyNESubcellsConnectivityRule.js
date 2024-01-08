import React from 'react';
import TextField from '@material-ui/core/TextField';
import FontIcon from '@material-ui/core/Icon';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';

import {
  NetPyNESelectField,
  NetPyNEField,
  NetPyNETextField,
  ListComponent,
  NetPyNECoordsRange,
} from 'netpyne/components';
import Select from 'netpyne/components/general/Select';
import Utils from '../../../Utils';

const densityStrings = ["uniform", "1DMap", "2DMap", "distance"]

export default class NetPyNESubCellsConnectivityRule extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: 'General',
      errorMessage: undefined,
      errorDetails: undefined,
      type: 'uniform',
      coord: '',
    };
  }

  handleRenameChange = (event) => {
    const storedValue = this.props.name;
    const newValue = Utils.nameValidation(event.target.value);
    const updateCondition = this.props.renameHandler(newValue);
    const triggerCondition = Utils.handleUpdate(
      updateCondition,
      newValue,
      event.target.value,
      this,
      'ConnectionRule',
    );

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey(
          'netParams.subConnParams',
          storedValue,
          newValue,
          (response, newValue) => {
            this.renaming = false;
          },
        );
        this.renaming = true;
      });
    }
  };

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    // eslint-disable-next-line eqeqeq
    if (this.updateTimer !== undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  select = (index, sectionId) => this.setState({
    selectedIndex: index,
    sectionId,
  });

  getBottomNavigationAction (index, sectionId, label, icon, id) {
    return (
      <BottomNavigationAction
        id={id}
        key={sectionId}
        label={label}
        icon={<FontIcon className={`fa ${icon}`} />}
        onClick={() => this.select(index, sectionId)}
      />
    );
  }

  postProcessMenuItems (pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        id={`${name}MenuItem`}
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

  handleDensity (value) {
    this.setState({ type: value })
    if (value === 'uniform') {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.subConnParams['${this.props.name}']['density'] = 'uniform'`,
      )
    } else {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.subConnParams['${this.props.name}']['density'] = {}`,
      )
    }
  }

  handleCoord(value) {
    this.setState({ coord: value })
    if (value === 'cartesian') {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.subConnParams['${this.props.name}']['density']['coord'] = '${value}'`,
      )
      Utils.execPythonMessage(`netpyne_geppetto.netParams.defineCellShapes = True`)
    } else {
      Utils.execPythonMessage(`netpyne_geppetto.netParams.defineCellShapes = False`)
      Utils.execPythonMessage(
        `del netpyne_geppetto.netParams.subConnParams['${this.props.name}']['density']['coord']`,
      )
    }
  }

  densityExtraFun (type, name) {
    switch (type) {
      case '2DMap':
      case '1DMap':
        Utils.execPythonMessage(`netpyne_geppetto.netParams.defineCellShapes = True`)
        return (
          <>
            <NetPyNEField id="netParams.subConnParams.density.gridY" className="listStyle">
              <ListComponent
                model={`netParams.subConnParams['${name}']['density']['gridY']`}
              />
            </NetPyNEField>
            {type === "2DMap" ?
              <NetPyNEField id="netParams.subConnParams.density.gridX" className="listStyle">
                <ListComponent
                  model={`netParams.subConnParams['${name}']['density']['gridX']`}
                />
            </NetPyNEField> : <></>}
            <NetPyNEField id="netParams.subConnParams.density.fixedSomaY" className="listStyle">
              <ListComponent
                model={`netParams.subConnParams['${name}']['density']['fixedSomaY']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.subConnParams.density.gridValues" className="listStyle">
              <ListComponent
                model={`netParams.subConnParams['${name}']['density']['gridValues']`}
              />
            </NetPyNEField>

          </>
        )
      case 'distance':
        Utils.execPythonMessage(`netpyne_geppetto.netParams.defineCellShapes = False`)
        return (
          <>
            <NetPyNEField id="netParams.subConnParams.density.ref_sec">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.subConnParams['${name}']['density']['ref_sec']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.subConnParams.density.ref_seg">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.subConnParams['${name}']['density']['ref_seg']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.subConnParams.density.target_distance">
            <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.subConnParams['${name}']['density']['target_distance']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.subConnParams.density.coord">
              <Select
                onChange={(event) => this.handleCoord(event.target.value)}
                value={this.props.coord}
                fullWidth >
                {["", "cartesian"].map((name, idx) => (
                  <MenuItem id={`${name}MenuItem`} key={`_${name}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </NetPyNEField>
          </>
        )
      default:
        Utils.execPythonMessage(`netpyne_geppetto.netParams.defineCellShapes = False`)
    }
  }

  render () {
    const densityExtras = this.densityExtraFun(this.props.model.density, this.props.name);
    const dialogPop = this.state.errorMessage !== undefined ? (
      <Dialog open style={{ whiteSpace: 'pre-wrap' }}>
        <DialogTitle id="alert-dialog-title">
          {this.state.errorMessage}
        </DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {this.state.errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({
              errorMessage: undefined,
              errorDetails: undefined,
            })}
          >
            BACK
          </Button>
        </DialogActions>
      </Dialog>
    ) : undefined;

    if (this.state.sectionId === 'General') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          <Box mb={1}>
            <TextField
              fullWidth
              variant="filled"
              id="ConnectivityName"
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="The name of the connectivity rule"
            />
          </Box>

          <NetPyNEField id="netParams.subConnParams.groupSynMechs">
            <NetPyNESelectField
              multiple={1}
              model={
                `netParams.subConnParams['${this.props.name}']['groupSynMechs']`
              }
              fullWidth
              method="netpyne_geppetto.getAvailableSynMech"
              postProcessItems={(pythonData, selected) => pythonData.map((name) => (
                <MenuItem id={`${name}MenuItem`} key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.subConnParams.sec" className="listStyle">
            <ListComponent
              model={`netParams.subConnParams['${this.props.name}']['sec']`}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.subConnParams.density">
            <Select variant="filled" value={this.state.type} onChange={(event) => this.handleDensity(event.target.value)}>
              {densityStrings.map((item) => (
                <MenuItem id={`${item}MenuItem`} key={item} value={item}>
                  {`${item}`}
                </MenuItem>
              ))}
            </Select>
          </NetPyNEField>

          {densityExtras}

          {dialogPop}
        </Box>
      );
    } else if (this.state.sectionId === 'Pre Conditions') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          <NetPyNEField id="netParams.subConnParams.preConds.pop">
            <NetPyNESelectField
              model={
                `netParams.subConnParams['${
                  this.props.name
                }']['preConds']['pop']`
              }
              method="netpyne_geppetto.getAvailablePops"
              postProcessItems={this.postProcessMenuItems}
              multiple
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.subConnParams.preConds.cellType">
            <NetPyNESelectField
              fullWidth
              model={
                `netParams.subConnParams['${
                  this.props.name
                }']['preConds']['cellType']`
              }
              method="netpyne_geppetto.getAvailableCellTypes"
              postProcessItems={this.postProcessMenuItems}
              multiple
            />
          </NetPyNEField>

          <NetPyNECoordsRange
            id="xRangePreConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="preConds"
            items={[
              {
                value: 'x',
                label: 'Absolute',
              },
              {
                value: 'xnorm',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="yRangePreConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="preConds"
            items={[
              {
                value: 'y',
                label: 'Absolute',
              },
              {
                value: 'ynorm',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="zRangePreConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="preConds"
            items={[
              {
                value: 'z',
                label: 'Absolute',
              },
              {
                value: 'znorm',
                label: 'Normalized',
              },
            ]}
          />
        </Box>
      );
    } else if (this.state.sectionId === 'Post Conditions') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          <NetPyNEField id="netParams.subConnParams.postConds.pop">
            <NetPyNESelectField
              model={
                `netParams.subConnParams['${
                  this.props.name
                }']['postConds']['pop']`
              }
              fullWidth
              method="netpyne_geppetto.getAvailablePops"
              postProcessItems={this.postProcessMenuItems}
              multiple
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.subConnParams.postConds.cellType">
            <NetPyNESelectField
              model={
                `netParams.subConnParams['${
                  this.props.name
                }']['postConds']['cellType']`
              }
              method="netpyne_geppetto.getAvailableCellTypes"
              postProcessItems={this.postProcessMenuItems}
              multiple
              fullWidth
            />
          </NetPyNEField>

          <NetPyNECoordsRange
            id="xRangePostConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="postConds"
            items={[
              {
                value: 'x',
                label: 'Absolute',
              },
              {
                value: 'xnorm',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="yRangePostConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="postConds"
            items={[
              {
                value: 'y',
                label: 'Absolute',
              },
              {
                value: 'ynorm',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="zRangePostConn"
            name={this.props.name}
            model="netParams.subConnParams"
            conds="postConds"
            items={[
              {
                value: 'z',
                label: 'Absolute',
              },
              {
                value: 'znorm',
                label: 'Normalized',
              },
            ]}
          />
        </Box>
      );
    }

    // Generate Menu
    let index = 0;
    const bottomNavigationItems = [];
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        'General',
        'General',
        'fa-bars',
        'generalConnTab',
      ),
    );
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        'Pre Conditions',
        'Pre-synaptic cells conditions',
        'fa-caret-square-o-left',
        'preCondsConnTab',
      ),
    );
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        'Post Conditions',
        'Post-synaptic cells conditions',
        'fa-caret-square-o-right',
        'postCondsConnTab',
      ),
    );

    return (
      <div className="layoutVerticalFitInner">
        <BottomNavigation showLabels value={this.state.selectedIndex}>
          {bottomNavigationItems}
        </BottomNavigation>
        {content}
      </div>
    );
  }

  handleChange = (event, index, values) => this.setState({ values });
}
