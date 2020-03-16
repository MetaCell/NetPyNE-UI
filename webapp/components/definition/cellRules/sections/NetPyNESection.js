import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FontIcon from '@material-ui/core/Icon';
import CardContent from '@material-ui/core/CardContent';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Select from '../../../general/Select';
import ListComponent from '../../../general/List';
import NetPyNEField from '../../../general/NetPyNEField';

import Utils from '../../../../Utils';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);
var PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(Select);

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

export default class NetPyNESection extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.setPage = this.setPage.bind(this);
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
  }

  setPage (page) {
    this.setState({ page: page });
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue, this.props.cellRule);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "Section");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey("netParams.cellParams['" + this.props.cellRule + "']['secs']", storedValue, newValue, (response, newValue) => { });
      });
    }
  }

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  getBottomNavigationAction (index, sectionId, label, icon, id) {

    return <BottomNavigationAction
      id={id}
      key={sectionId}
      label={label}
      icon={(<FontIcon className={"fa " + icon}></FontIcon>)}
      onClick={() => this.select(index, sectionId)}
    />
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }
  
  postProcessMenuItems (pythonData, selected) {
    if (pythonData[this.props.cellRule] != undefined) {
      return pythonData[this.props.cellRule].map(name => (
        <MenuItem
          id={name + "MenuItem"}
          key={name}
          value={name}
        >
          {name}
        </MenuItem>
      ));
    }
  }
      
  render () {
    var content = <div/>;
    var that = this;
    if (this.state.sectionId == "General") {
      content = (
        <div>
          <TextField
            id={"cellParamsSectionName"}
            onChange={this.handleRenameChange}
            value = {this.state.currentName}
            label="The name of the section"
            className={"netpyneField"}
          />
        </div>
      )
    } else if (this.state.sectionId == "Geometry") {

      content = (<div>
        <NetPyNEField id="netParams.cellParams.secs.geom.diam" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['diam']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.L" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['L']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.Ra" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['Ra']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.cm" >
          <PythonControlledTextField model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['cm']"} />
        </NetPyNEField>

        <NetPyNEField id="netParams.cellParams.secs.geom.pt3d" className="listStyle">
          <PythonControlledListComponent
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['geom']['pt3d']"} />
        </NetPyNEField>

      </div>)
    } else if (this.state.sectionId == "Topology") {
      content = (<div>
        <NetPyNEField id="netParams.cellParams.secs.topol.parentSec" >
          <PythonMethodControlledSelectField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['parentSec']"}
            method={"netpyne_geppetto.getAvailableSections"}
            postProcessItems={this.postProcessMenuItems}
          />
        </NetPyNEField>
        <br />
        
        <NetPyNEField id="netParams.cellParams.secs.topol.parentX" >
          <PythonControlledTextField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['parentX']"}
          />
        </NetPyNEField>
        <br />
        
        <NetPyNEField id="netParams.cellParams.secs.topol.childX" >
          <PythonControlledTextField
            model={"netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.name + "']['topol']['childX']"} 
          />
        </NetPyNEField>
      </div>)
    }


    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'General', 'General', 'fa-bars', 'sectionGeneralTab'));
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'Geometry', 'Geometry', 'fa-cube', 'sectionGeomTab'));
    bottomNavigationItems.push(this.getBottomNavigationAction(index++, 'Topology', 'Topology', 'fa-tree', 'sectionTopoTab'));
    
    return (
      <div>

        <CardContent style={{ "zIndex": 0 }}>
          <BottomNavigation value={this.state.selectedIndex} showLabels>
            {bottomNavigationItems}
          </BottomNavigation>
        </CardContent>
        <br />
        {content}


      </div>
    );
  }
}
