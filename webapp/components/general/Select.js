import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';

export default class Select extends Component {
  render () {
    var value = this.props.value
    if (this.props.multiple && this.props.value.constructor.name != 'Array') {
      // when loading values from a script, we can't allow strings if *multiple* is enabled
      value = [this.props.value]
    } else if (!this.props.multiple && this.props.value.length === 0 && this.props.value.constructor.name === 'Array' ) {
      // when *multiple* is disabled, we can't allow arrays
      value = ''
    }
    return (
      <FormControl >
        <InputLabel>{this.props.label}</InputLabel>
        <MuiSelect
          id={this.props.id}
          value={value}
          onChange={this.props.onChange}
          multiple={!!this.props.multiple}
        >
          {this.props.children}
        </MuiSelect>

      </FormControl>
      
    )
  }
}
