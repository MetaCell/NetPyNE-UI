import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';

class Select extends React.Component {
  
  componentDidUpdate (prevProps, prevState) {
    if (this.props.commands !== prevProps.commands)
      this.forceUpdate();
  }
  
  render () {
    let value = this.props.value || '';
    if (this.props.multiple && value.constructor.name != 'Array') {
      // when loading values from a script, we can't allow strings if *multiple* is enabled
      value = [value];
    } else if (!this.props.multiple && value.constructor.name === 'Array' && value.length === 0) {
      // when *multiple* is disabled, we can't allow arrays
      value = '';
    }
    return (
      <FormControl variant="filled" fullWidth>
        <InputLabel>{this.props.label}</InputLabel>
        <MuiSelect
          id={this.props.id}
          value={value}
          onChange={this.props.onChange}
          multiple={!!this.props.multiple}
          pythonparams={this.props.pythonparams}
        >
          {this.props.children}
        </MuiSelect>

      </FormControl>

    );
  }
}

export default Select;
