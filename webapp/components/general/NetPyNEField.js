import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Utils from '../../Utils';


import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
        if (this.realType == 'func') {
          if (value != "" && value != undefined) {
            Utils.evalPythonMessage('netpyne_geppetto.validateFunction', [value]).then(response => {
              if (!response) {
                resolve({ errorMsg: 'Not a valid function' })
              } else {
                resolve({ errorMsg: '' })
              }
            });
          } else {
            resolve({ errorMsg: '' })
          }
        } else if (this.realType == 'float') {
          if (isNaN(value)) {
            resolve({ errorMsg: 'Only float allowed' })
          } else {
            resolve({ errorMsg: '' })
          }
        }
      }
      );
    }

    prePythonSyncProcessing (value){
      if (value == '') {
        if (this.default != undefined) {
          return this.default;
        } else if (!this.model.split(".")[0].startsWith('simConfig') || this.model.split(".")[1].startsWith('analysis')) {
          Utils.execPythonMessage('del netpyne_geppetto.' + this.model)
        }
      }
      return value;
    }

    render () {
      var help = Utils.getMetadataField(this.props.id, "help");
      if (help != undefined && help != '') {
        var helpComponent = (
          <div className="helpIcon">
            <i 
              className="fa fa-question"
              aria-hidden="true"
              onClick={() => this.handleOpenHelp(help)}
            />
            <Dialog
              style={{ zIndex: 5000 }}
              open={this.state.openHelp}
              onClose={() => this.setState({ openHelp: false })}
            >
              <DialogTitle>NetPyNE Help</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {this.state.helpText}
                </DialogContentText>
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
        )
      }

      const childWithProp = React.Children.map(this.props.children, child => {
        var extraProps = {}
        var name = child.type.name ? child.type.name : child.type.muiName
        if (name === undefined) {
          if (child.type.options) {
            name = child.type.options.name
          }
        }
        if (!["Select", "TextField", "Checkbox", "MuiTextField", "PythonControlledControlWithPythonDataFetch"].some(componentName => name.includes(componentName))) {
          extraProps['validate'] = this.setErrorMessage;
          extraProps['prePythonSyncProcessing'] = this.prePythonSyncProcessing;

          var dataSource = Utils.getMetadataField(this.props.id, "suggestions");
          if (dataSource != '') {
            extraProps['dataSource'] = dataSource;
          }
        }
            
        var floatingLabelText = Utils.getMetadataField(this.props.id, "label");
        extraProps['label'] = floatingLabelText;

        var type = Utils.getHTMLType(this.props.id);
        if (type != '') {
          extraProps['type'] = type;
        }

        if (name == "PythonControlledControl") {
          var realType = Utils.getMetadataField(this.props.id, "type");
          extraProps['realType'] = realType;
        }

        var hintText = Utils.getMetadataField(this.props.id, "hintText");
        
        var default_value = Utils.getMetadataField(this.props.id, "default");
        if (default_value != '') {
          extraProps['default'] = default_value;
        }

        var options = Utils.getMetadataField(this.props.id, "options");
        if (options) {
          extraProps['pepe'] = 22
          extraProps['children'] = options.map(name => (
            <MenuItem
              id={name}
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ));
        }

        return React.cloneElement(child, extraProps);
      });

      var classes = [];
      if (!this.props.noStyle) {
        classes.push("netpyneField");
      }
      if (this.props.className) {
        classes.push(this.props.className);
      }
      if (classes.length > 0) {
        var className = { className: classes.join(" ") }
      }

      return (
        <div style={{ ...this.props.style, display:'flex' }} {...className}>
          <div style={{ float: 'left' }}>
            {childWithProp}
          </div>
          {helpComponent}
          <div style={{ clear: "both" }}></div>
        </div>
      );
    }
}
