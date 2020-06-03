import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import Tooltip from './Tooltip'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import NetPyNEIcon from '../general/NetPyNEIcons';
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'
/**
 * Generic List/Dict Component
 */
class ListComponent extends Component {

  constructor (props) {
    super(props);
    this.state = {
      model: props.model,
      children: (props.realType == 'dict' || props.realType == 'dict(dict())') ? {} : [],
      newItemValue: ''
    };
    this.addChild = this.addChild.bind(this);
    this.handleNewItemChange = this.handleNewItemChange.bind(this);
  }

  isValid (value) {
    switch (this.props.realType) {
    case 'list(float)':
      var valid = (value.match(/^-?\d*(\.\d+)?$/));
      break;
    case 'list(list(float))':
      var valid = true;
      value.split(',').forEach(element => {
        if (!element.match(/^-?\d*(\.\d+)?$/)) {
          valid = false;
        }
      });
      if (value.endsWith(',')) {
        valid = false;
      }
      break;
    case 'dict':
      var valid = (value.match(/:/g) || []).length == 1 && !value.startsWith(':') && !value.endsWith(':');
      break;
    case 'dict(dict())':
      var valid = true;
      var value = this.state.newItemValue.replace(/[ "']/g, '');

      if ((value.match(/;/g) || []).length != 0) {
        valid = false;
      } else {
        if ((value.match(/{/g) || []).length != 1 || (value.match(/}/g) || []).length != 1) {
          valid = false;
        } else {
          if (value.indexOf('{') > value.indexOf('}') || !value.endsWith('}')) {
            valid = false;
          } else {
            var subDict = value.match(/\{(.*?)\}/)[1];
            if ((subDict.match(/:/g) || []).length - 1 != (subDict.match(/,/g) || []).length) {
              valid = false;
            } else {
              subDict.split(',').forEach(element => {
                if ((element.match(/:/g) || []).length != 1 || element.startsWith(':') || element.endsWith(':')) {
                  valid = false;
                }
              });
              var reminder = value.replace('{' + subDict + '}', '');
              if ((reminder.match(/:/g) || []).length != 1 || !reminder.endsWith(':')) {
                valid = false;
              }
            }
          }
        }
      }
      break;
    default:
      var valid = true;
      break;
    }
    return valid;
  }

  getErrorMessage () {
    switch (this.props.realType) {
    case 'list(float)':
      var message = 'Only float numbers are allowed.';
      break;
    case 'list(list(float))':
      var message = 'Only comma separated float numbers are allowed.';
      break;
    case 'dict':
      var message = 'Key:Value pairs must be separated by colon : ';
      break;
    case 'dict(dict())':
      var message = 'Incorrect format. Example -> v_soma : { sec: soma, loc: 0.5, var: v}';
      break
    default:
      var message = 'No a valid value';
      break;
    }
    return message;
  }

  handleNewItemChange (event) {
    this.setState({ newItemValue: event.target.value, newItemErrorText: '' })
  }

  addChild () {
    if (this.state.newItemValue != '' && this.isValid(this.state.newItemValue)) {
      var children = this.state.children;
      switch (this.props.realType) {
      case 'list(list(float))':
        var newValue = '[' + this.state.newItemValue + ']';
        children.push(newValue);
        break;
      case 'dict':
        var newValue = this.state.newItemValue.split(':').map(entry => entry);
        if (!isNaN(newValue[1])) {
          newValue[1] = parseFloat(newValue[1])
        }
        children[newValue[0]] = newValue[1];
        break;
      case 'dict(dict())':
        var key = this.state.newItemValue.split(':')[0].replace(/[ "']/g, '');
        children[key] = {}
        var newValue = this.state.newItemValue.match(/\{(.*?)\}/)[1].replace(/[ "']/g, '').split(',').map(entry => entry.split(':'));
        newValue.forEach(entry => {
          if (!isNaN(entry[1])) {
            entry[1] = parseFloat(entry[1])
          }
          children[key][entry[0]] = entry[1]
        })
        break;
      default:
        var newValue = this.state.newItemValue;
        children.push(newValue);
        break;
      }
      // Call to conversion function
      this.convertToPython(children);
    } else {
      this.setState({ newItemErrorText: this.getErrorMessage() })
    }
  }

  removeChild (childIndex) {
    var children = this.state.children;
    if (this.props.realType == 'dict' || this.props.realType == 'dict(dict())') {

      delete children[childIndex];
    } else {
      children.splice(childIndex, 1);
    }
    // Call to conversion function
    this.convertToPython(children);
  }

  convertToPython (children) {
    // Update State
    this.setState({ children: children, newItemValue: '' });

    if (this.props.realType == 'dict' || this.props.realType == 'dict(dict())') {
      var newValue = children;
    } else {
      var newValue = this.state.children.map((child, i) => {
        switch (this.props.realType) {
        case 'list(float)':
          var childConverted = parseFloat(child)
          break;
        case 'list(list(float))':
          var childConverted = JSON.parse(child);
          break;
        default:
          var childConverted = child;
          break;
        }
        return childConverted;
      })
    }

    if (newValue != undefined && this.state.value != newValue && this.props.onChange != undefined) {
      this.props.onChange(null, null, newValue);
    }
  }

  convertFromPython (prevProps, prevState, value) {
    if (value != undefined && prevProps.value != value && value != '') {
      if (this.props.realType == 'dict' || this.props.realType == 'dict(dict())') {
        return (typeof value == 'string') ? JSON.parse(value) : value;
      } else {
        if (!Array.isArray(value)) {
          value = [value];
        }
        return value.map((child, i) => (typeof child == 'string') ? child : JSON.stringify(child));
      }

    }
  }

  componentDidUpdate (prevProps, prevState) {
    var newValue = this.convertFromPython(prevProps, prevState, this.props.value);
    if (newValue != undefined) {
      this.setState({ children: newValue });
    }
  }

  render () {
    var childrenWithExtraProp = Object.keys(this.state.children).map((key, index) => {
      key = key.toString();
      if (this.props.realType == 'dict') {
        var value = key + ' : ' + JSON.stringify(this.state.children[key]);
      } else if (this.props.realType == 'dict(dict())') {
        var value = key + ':   ' + JSON.stringify(this.state.children[key]).replace(/["']/g, '').replace(/[:]/g, ': ').replace(/[,]/g, ', ');
      } else {
        var value = this.state.children[key];
      }
      return <Chip key={key} label={value} style={{ marginRight: 8 }} onDelete={() => this.removeChild(key)} color="primary" />
    });

    const { classes } = this.props
    return (
      <Box >
        <TextField
          variant="filled"
          id={this.props.id}
          label={this.props.label ? 'Add new ' + this.props.label : 'Add new item'}
          onChange={this.handleNewItemChange}
          onKeyPress={e => e.key === 'Enter' ? this.addChild() : null }
          value={this.state.newItemValue}
          fullWidth
          helperText={this.state.newItemErrorText}
          InputProps={{
            endAdornment: (
              <Tooltip title="Add item to the list" placement="top">
                <IconButton size="small" onClick={this.addChild}>
                  <NetPyNEIcon name="add"/>
                </IconButton>
              </Tooltip> 
            )
          }}
        />
        <Box m={1}>{childrenWithExtraProp}</Box>

      </Box>
    )
  }
}


const styles = () => ({ addButton: { height: 48 } })

export default withStyles(styles)(ListComponent)