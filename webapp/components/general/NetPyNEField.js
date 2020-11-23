import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Utils from "../../Utils";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Tooltip } from "netpyne/components";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default class NetPyNEField extends Component {
  constructor (props) {
    super(props);
    this.state = { openHelp: false };
  }

  handleOpenHelp = help => {
    this.setState({ openHelp: true, helpText: help });
  };

  handleCloseHelp = () => {
    this.setState({ openHelp: false });
  };

  setErrorMessage (value) {
    return new Promise((resolve, reject) => {
      if (this.realType == "func") {
        if (value != "" && value != undefined) {
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
      } else if (this.realType == "float") {
        if (isNaN(value)) {
          resolve({ errorMsg: "Only float allowed" });
        } else {
          resolve({ errorMsg: "" });
        }
      }
    });
  }

  prePythonSyncProcessing (value) {
    if (value == "") {
      if (this.default != undefined) {
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
    var help = Utils.getMetadataField(this.props.id, "help");
    if (help != undefined && help != "") {
      var helpComponent = (
        <div>
          <Tooltip title="Help" placement="top">
            <div className="helpIcon">
              <i
                className="fa fa-question"
                aria-hidden="true"
                onClick={() => this.handleOpenHelp(help)}
              />
            </div>
          </Tooltip>
          <Dialog
            style={{ zIndex: 5000 }}
            open={this.state.openHelp}
            onClose={() => this.setState({ openHelp: false })}
          >
            <DialogTitle>NetPyNE Help</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.state.helpText}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                color="primary"
                onClick={() => this.setState({ openHelp: false })}
              >
                Got it
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    let childWithProp = React.Children.map(this.props.children, child => {
      var extraProps = {};
      var name = child.type.name ? child.type.name : child.type.muiName;
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

        var dataSource = Utils.getMetadataField(this.props.id, "suggestions");
        if (dataSource != "") {
          extraProps["dataSource"] = dataSource;
        }
      }

      var floatingLabelText = Utils.getMetadataField(this.props.id, "label");
      extraProps["label"] = floatingLabelText;

      var type = Utils.getHTMLType(this.props.id);
      if (type != "") {
        extraProps["type"] = type;
      }

      if (name == "PythonControlledControl") {
        var realType = Utils.getMetadataField(this.props.id, "type");
        extraProps["realType"] = realType;
      }

      var hintText = Utils.getMetadataField(this.props.id, "hintText");

      var default_value = Utils.getMetadataField(this.props.id, "default");
      if (default_value) {
        if (realType === "dict" || realType === "dict(dict)") {
          default_value = JSON.parse(default_value);
        }
        extraProps["default"] = default_value;
      }

      var options = Utils.getMetadataField(this.props.id, "options");
      if (options) {
        extraProps["children"] = options.map(name => (
          <MenuItem id={name} key={name} value={name}>
            {name}
          </MenuItem>
        ));
      }

      // // This seems a more material way to add the help icon (at least for TextFields)
      // if (child.props.fullWidth) {
      //   extraProps.InputProps = { endAdornment: helpComponent }
      // }
      return React.cloneElement(child, extraProps);
    });

    var classes = [];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <Grid container alignItems="center">
        <Grid item>
          {(help != undefined && help != "")
            ? <Tooltip title={help} placement="top-end" enterDelay={2000} enterTouchDelay={2000} enterNextDelay={2000}
              leaveTouchDelay={0} disableTouchListener={true} disableFocusListener={true}>
              <Box mb={1} width="100%">
                {childWithProp}
              </Box>
            </Tooltip>
            : <Box mb={1} width="100%">
              {childWithProp}
            </Box>
          }
        </Grid>
        {/* {helpComponent} */}
      </Grid>
    );
  }
}
