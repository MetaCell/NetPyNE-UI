import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';

export default class Select extends Component {
  render () {
    return (
      <FormControl >
        <InputLabel>{this.props.label}</InputLabel>
        <MuiSelect
          id={this.props.id}
          value={!this.props.multiple && this.props.value.length === 0 ? '' : this.props.value}
          onChange={this.props.onChange}
          multiple={!!this.props.multiple}
        >
          {this.props.children}
        </MuiSelect>

      </FormControl>
      
    )
  }
}
