import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Utils from "../../Utils";
import { Tooltip } from "netpyne/components";

export default class NetPyNEField extends Component {

  constructor (props) {
    super(props);
    this.state = { openHelp: false };
  }

  setErrorMessage (value) {
    return new Promise((resolve, reject) => {
      if (this.realType === "func") {
        if (value !== "" && value !== undefined) {
          Utils.evalPythonMessage("netpyne_geppetto.validateFunction", [
            value,
          ]).then(response => {
            if (!response) {
              resolve({ errorMsg: "Not a valid function" });
            } else {
              resolve({ errorMsg: "" });
            }
          });
        } else {
          resolve({ errorMsg: "" });
        }
      } else if (this.realType === "float") {
        if (isNaN(value)) {
          resolve({ errorMsg: "Only float allowed" });
        } else {
          resolve({ errorMsg: "" });
        }
      }
    });
  }

  prePythonSyncProcessing (value) {
    if (value === "") {
      if (this.default !== undefined) {
        return this.default;
      } else if (
        !this.model.split(".")[0].startsWith("simConfig")
        || this.model.split(".")[1].startsWith("analysis")
      ) {
        Utils.execPythonMessage("del netpyne_geppetto." + this.model);
      }
    }
    return value;
  }

  render () {
    const help = Utils.getMetadataField(this.props.id, "help");
    let childWithProp = React.Children.map(this.props.children, child => {
      const realType = Utils.getMetadataField(this.props.id, "type");
      const extraProps = {};
      let name = child.type.name ? child.type.name : child.type.muiName;
      if (name === undefined) {
        if (child.type.options) {
          name = child.type.options.name;
        }
      }
      if (
        [
          "Select",
          "TextField",
          "MuiFormControl",
          "Checkbox",
          "MuiTextField",
          "PythonControlledControlWithPythonDataFetch",
        ].indexOf(name) === -1
      ) {
        extraProps["validate"] = this.setErrorMessage;
        extraProps["prePythonSyncProcessing"] = this.prePythonSyncProcessing;

        const dataSource = Utils.getMetadataField(this.props.id, "suggestions");
        if (dataSource !== "") {
          extraProps["dataSource"] = dataSource;
        }
      }

      extraProps["label"] = Utils.getMetadataField(this.props.id, "label");
      const type = Utils.getHTMLType(this.props.id);
      if (type !== "") {
        extraProps["type"] = type;
      }

      if (name === "PythonControlledControl") {
        extraProps["realType"] = realType;
      }

      const hintText = Utils.getMetadataField(this.props.id, "hintText");
      let default_value = Utils.getMetadataField(this.props.id, "default");
      if (default_value) {
        if (realType === "dict" || realType === "dict(dict)") {
          default_value = JSON.parse(default_value);
        }
        extraProps["default"] = default_value;
      }

      const options = Utils.getMetadataField(this.props.id, "options");
      if (options) {
        extraProps["children"] = options.map(name => (
          <MenuItem id={name} key={name} value={name}>
            {name}
          </MenuItem>
        ));
      }

      return React.cloneElement(child, extraProps);
    });

    return (
      <Grid container alignItems="center">
        <Grid item>
          {(help !== undefined && help !== "")
            ? <Tooltip
              title={help}
              placement="top-end"
              enterDelay={2000}
              enterTouchDelay={2000}
              enterNextDelay={2000}
              leaveTouchDelay={0}
              disableTouchListener={true}
              disableFocusListener={true}
            >
              <Box mb={1} width="100%">
                {childWithProp}
              </Box>
            </Tooltip>
            : <Box mb={1} width="100%">
              {childWithProp}
            </Box>
          }
        </Grid>
      </Grid>
    );
  }
}
