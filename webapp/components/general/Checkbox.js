import React, { Component } from 'react'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';

export default class Checkbox extends Component {
  render () {
    return (
      <FormGroup>
        <FormControlLabel
          disabled={!!this.props.disabled}
          label={this.props.label ? this.props.label : ''}
          control={
            <MuiCheckbox
              id={this.props.id}
              checked={this.props.checked || false}
              onChange={this.props.onChange}
            />
          }
        />
      </FormGroup>
      
    )
  }
}
