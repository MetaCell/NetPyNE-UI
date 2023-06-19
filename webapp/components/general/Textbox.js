import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { bgLight } from '../../theme';

export default class Textbox extends Component {
  componentDidUpdate (prevProps, prevState) {
    if (this.props.commands !== prevProps.commands)
      this.forceUpdate();
  }
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
              <TextField
                id={this.props.id}
                color="primary"
                disabled={!!this.props.disabled}
                value={this.props.value}
                onChange={this.props.onChange}
              />
            </Box>
          )}
        />
      </FormGroup>

    );
  }
}
