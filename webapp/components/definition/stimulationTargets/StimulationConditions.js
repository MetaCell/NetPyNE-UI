import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";

import {
  NetPyNEField,
  NetPyNESelectField,
  NetPyNECoordsRange,
  ListComponent
} from "netpyne/components";

export default class StimulationConditions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.postProcessMenuItems = this.postProcessMenuItems.bind(this);
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
    var content = (
      <div>
        <NetPyNEField id={"netParams.stimTargetParams.conds.pop"}>
          <NetPyNESelectField
            model={
              "netParams.stimTargetParams['"
              + this.props.name
              + "']['conds']['pop']"
            }
            method={"netpyne_geppetto.getAvailablePops"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>

        <NetPyNEField id={"netParams.stimTargetParams.conds.cellModel"}>
          <NetPyNESelectField
            model={
              "netParams.stimTargetParams['"
              + this.props.name
              + "']['conds']['cellModel']"
            }
            method={"netpyne_geppetto.getAvailableCellModels"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>

        <NetPyNEField id={"netParams.stimTargetParams.conds.cellType"}>
          <NetPyNESelectField
            model={
              "netParams.stimTargetParams['"
              + this.props.name
              + "']['conds']['cellType']"
            }
            method={"netpyne_geppetto.getAvailableCellTypes"}
            postProcessItems={this.postProcessMenuItems}
            multiple={true}
          />
        </NetPyNEField>

        <NetPyNECoordsRange
          id="xRangeStimTarget"
          name={this.props.name}
          model={"netParams.stimTargetParams"}
          conds={"conds"}
          items={[
            { value: "x", label: "Absolute" },
            { value: "xnorm", label: "Normalized" }
          ]}
        />

        <NetPyNECoordsRange
          id="yRangeStimTarget"
          name={this.props.name}
          model={"netParams.stimTargetParams"}
          conds={"conds"}
          items={[
            { value: "y", label: "Absolute" },
            { value: "ynorm", label: "Normalized" }
          ]}
        />

        <NetPyNECoordsRange
          id="zRangeStimTarget"
          name={this.props.name}
          model={"netParams.stimTargetParams"}
          conds={"conds"}
          items={[
            { value: "z", label: "Absolute" },
            { value: "znorm", label: "Normalized" }
          ]}
        />

        <NetPyNEField
          id="netParams.stimTargetParams.conds.cellList"
          className="listStyle"
        >
          <ListComponent
            model={
              "netParams.stimTargetParams['"
              + this.props.name
              + "']['conds']['cellList']"
            }
          />
        </NetPyNEField>
      </div>
    );

    return content;
  }
}
