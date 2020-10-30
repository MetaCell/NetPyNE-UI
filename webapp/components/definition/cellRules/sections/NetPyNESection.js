import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FontIcon from "@material-ui/core/Icon";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Paper from "@material-ui/core/Paper";
import Utils from "../../../../Utils";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {
  NetPyNEField,
  NetPyNETextField,
  NetPyNESelectField,
  ListComponent,
} from "netpyne/components";

export default class NetPyNESection extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: "General",
      errorMessage: undefined,
      errorDetails: undefined,
    };
    this.setPage = this.setPage.bind(this);
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
  }

  setPage (page) {
    this.setState({ page: page });
  }

  select = (index, sectionId) =>
    this.setState({ selectedIndex: index, sectionId: sectionId });

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(
      newValue,
      this.props.cellRule
    );
    var triggerCondition = Utils.handleUpdate(
      updateCondition,
      newValue,
      event.target.value,
      this,
      "Section"
    );

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey(
          "netParams.cellParams['" + this.props.cellRule + "']['secs']",
          storedValue,
          newValue,
          (response, newValue) => {}
        );
      });
    }
  };

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 500);
  }

  getBottomNavigationAction (index, sectionId, label, icon, id) {
    return (
      <BottomNavigationAction
        id={id}
        key={sectionId}
        label={label}
        icon={<FontIcon className={"fa " + icon}></FontIcon>}
        onClick={() => this.select(index, sectionId)}
      />
    );
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  postProcessMenuItems (pythonData, selected) {
    if (pythonData[this.props.cellRule] != undefined) {
      return pythonData[this.props.cellRule].map(name => (
        <MenuItem id={name + "MenuItem"} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
  }

  render () {
    var content = <div />;
    var that = this;
    if (this.state.sectionId == "General") {
      content = (
        <div>
          <TextField
            fullWidth
            variant="filled"
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            label="The name of the section"
          />
        </div>
      );
    } else if (this.state.sectionId == "Geometry") {
      content = (
        <Box className={`scrollbar scrollchild`} mt={1}>
          <NetPyNEField id="netParams.cellParams.secs.geom.diam">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['geom']['diam']"
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.cellParams.secs.geom.L">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['geom']['L']"
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.cellParams.secs.geom.Ra">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['geom']['Ra']"
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.cellParams.secs.geom.cm">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['geom']['cm']"
              }
            />
          </NetPyNEField>

          <NetPyNEField
            id="netParams.cellParams.secs.geom.pt3d"
            className="listStyle"
          >
            <ListComponent
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['geom']['pt3d']"
              }
            />
          </NetPyNEField>
        </Box>
      );
    } else if (this.state.sectionId == "Topology") {
      content = (
        <Box className={`scrollbar scrollchild`} mt={1}>
          <NetPyNEField id="netParams.cellParams.secs.topol.parentSec">
            <NetPyNESelectField
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['topol']['parentSec']"
              }
              method={"netpyne_geppetto.getAvailableSections"}
              postProcessItems={this.postProcessMenuItems}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.cellParams.secs.topol.parentX">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['topol']['parentX']"
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.cellParams.secs.topol.childX">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={
                "netParams.cellParams['"
                + this.props.cellRule
                + "']['secs']['"
                + this.props.name
                + "']['topol']['childX']"
              }
            />
          </NetPyNEField>
        </Box>
      );
    }

    // Generate Menu
    var index = 0;
    var bottomNavigationItems = [];
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        "General",
        "General",
        "fa-bars",
        "sectionGeneralTab"
      )
    );
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        "Geometry",
        "Geometry",
        "fa-cube",
        "sectionGeomTab"
      )
    );
    bottomNavigationItems.push(
      this.getBottomNavigationAction(
        index++,
        "Topology",
        "Topology",
        "fa-tree",
        "sectionTopoTab"
      )
    );

    return (
      <div className="layoutVerticalFitInner">
        <BottomNavigation
          showLabels
          style={{ borderRadius: "4px" }}
          value={this.state.selectedIndex}
          showLabels
        >
          {bottomNavigationItems}
        </BottomNavigation>
        {content}
      </div>
    );
  }
}
