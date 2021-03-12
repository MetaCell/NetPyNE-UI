import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { bgLight } from '../../theme';

export default class Checkbox extends Component {
  render () {
    const {
      fullWidth,
      noBackground,
      styles,
    } = this.props;
    const localStyle = fullWidth ? { width: '100%' } : {};
    if (noBackground) {
      localStyle.backgroundColor = 'inherit';
    }

    return (
      <FormGroup
        style={{
          backgroundColor: bgLight,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          ...localStyle,
          ...styles,
        }}
      >
        <FormControlLabel
          disabled={!!this.props.disabled}
          label={this.props.label ? this.props.label : ''}
          control={(
            <Box ml={1}>
              <MuiCheckbox
                id={this.props.id}
                color="primary"
                disabled={!!this.props.disabled}
                checked={this.props.checked || false}
                onChange={this.props.onChange}
              />
            </Box>
          )}
        />
      </FormGroup>

    );
  }
}
