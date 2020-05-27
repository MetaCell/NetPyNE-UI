import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import FormGroup from '@material-ui/core/FormGroup';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { bgLight } from '../../theme'

export default class Checkbox extends Component {
  render () {
    return (
      <FormGroup style={{ 
        backgroundColor: bgLight, 
        borderTopLeftRadius: 4, 
        borderTopRightRadius: 4,
      }}>
        <FormControlLabel
          disabled={!!this.props.disabled}
          label={this.props.label ? this.props.label : ''}
          control={
            <Box marginLeft={1}>
              <MuiCheckbox
                id={this.props.id}
                color="primary"
                checked={this.props.checked || false}
                onChange={this.props.onChange}
              />
            </Box>
            
          }
        />
      </FormGroup>
      
    )
  }
}
