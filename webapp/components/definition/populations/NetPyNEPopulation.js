import React from 'react';
import TextField from '@material-ui/core/TextField';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FontIcon from '@material-ui/core/Icon';
import Utils from '../../../Utils';
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import {
  Dimensions,
  NetPyNEField,
  NetPyNETextField,
  NetPyNECoordsRange,
  NetPyNESelectField
} from 'netpyne/components';

const styles = ({ spacing }) => ({
  fields: { 
    marginTop: spacing(3),
    width: '100%'
  } 
})

class NetPyNEPopulation extends React.Component {

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

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name, selectedIndex: 0, sectionId: "General" });
  }

  setPopulationDimension = value => {
    // this.setState({ cellModel: value });
    this.triggerUpdate(() => {
      // Set Population Dimension Python Side
      Utils
        .evalPythonMessage('api.getParametersForCellModel', [value])
        .then(response => {

          var cellModelFields = "";
          if (Object.keys(response).length != 0) {
            // Merge the new metadata with the current one
            window.metadata = Utils.mergeDeep(window.metadata, response);
            // console.log("New Metadata", window.metadata);
            cellModelFields = [];
            // Get Fields for new metadata
            cellModelFields = Utils.getFieldsFromMetadataTree(response, key => (<NetPyNEField id={key} >
              <NetPyNETextField
                variant="filled" 
                model={"netParams.popParams['" + this.state.currentName + "']['" + key.split(".").pop() + "']"}
              />
            </NetPyNEField>));
          }
          this.setState({ cellModelFields: cellModelFields, cellModel: value });
        });
    });

  }

  getModelParameters = () => {
    var select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId })

    var modelParameters = [];
    modelParameters.push(<BottomNavigationAction id={'generalPopTab'} key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => select(0, 'General')} />);
    modelParameters.push(<BottomNavigationAction id={'spatialDistPopTab'} key={'SpatialDistribution'} label={'Spatial Distribution'} icon={<FontIcon className={"fa fa-cube"} />} onClick={() => select(1, 'SpatialDistribution')} />);
    if (typeof this.state.cellModelFields != "undefined" && this.state.cellModelFields != '') {
      modelParameters.push(<BottomNavigationAction key={this.state.cellModel} label={this.state.cellModel + " Model"} icon={<FontIcon className={"fa fa-balance-scale"} />} onClick={() => select(2, this.state.cellModel)} />);
    }
    modelParameters.push(<BottomNavigationAction key={'CellList'} label={'Cell List'} icon={<FontIcon className={"fa fa-list"} />} onClick={() => select(3, 'CellList')} />);

    return modelParameters;
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.model == undefined
      || this.state.currentName != nextState.currentName
      || this.state.cellModelFields != nextState.cellModelFields
      || this.state.sectionId != nextState.sectionId
      || this.state.selectedIndex != nextState.selectedIndex;
  }

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "Population");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey('netParams.popParams', storedValue, newValue, (response, newValue) => { 
          this.renaming = false
          this.props.updateCards()
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
          <Box mb={1}>
            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="The name of the population"
            />
          </Box>
          
          <div id="netParams_popParams_cellType">
            <NetPyNEField id="netParams.popParams.cellType" >
              <NetPyNESelectField
                method={"netpyne_geppetto.getAvailableCellTypes"}
                model={"netParams.popParams['" + this.props.name + "']['cellType']"}
                postProcessItems={this.postProcessMenuItems}
              />
            </NetPyNEField>
          </div>
          <Dimensions modelName={this.props.name} />
          {dialogPop}
        </div>
      )
    } else if (this.state.sectionId == "SpatialDistribution") {
      var content = (
        <div>
          <NetPyNECoordsRange
            id={"xRangePopParams"}
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'xRange', label:'Absolute' }, 
              { value: 'xnormRange', label:'Normalized' }
            ]}
          />

          <NetPyNECoordsRange 
            id="yRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'yRange', label:'Absolute' }, 
              { value: 'ynormRange', label:'Normalized' }
            ]}
          />

          <NetPyNECoordsRange 
            id="zRangePopParams"
            name={this.props.name} 
            model={'netParams.popParams'}
            items={[
              { value: 'zRange', label:'Absolute' }, 
              { value: 'znormRange', label:'Normalized' }
            ]}
          />
        </div>
      )
    } else if (this.state.sectionId == "CellList") {
      var content = <div>Option to provide individual list of cells. Coming soon ...</div>
    } else {
      var content = <div>{this.state.cellModelFields}</div>;
    }

    return (
      <div>
        <BottomNavigation showLabels value={this.state.selectedIndex}>
          {this.getModelParameters()}
        </BottomNavigation>
        {content}
      </div>
    );
  }
}


export default withStyles(styles)(NetPyNEPopulation)