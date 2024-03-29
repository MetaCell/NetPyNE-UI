import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';

class Select extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectOpen: false,
    };
  }

  handleOpen = () => {
    this.setState({ selectOpen: true });
  };

  handleClose = () => {
    this.setState({ selectOpen: false });
  };
  
  componentDidUpdate (prevProps, prevState) {
    if (this.props.commands !== prevProps.commands)
      this.forceUpdate();
  }
  
  render () {
    const { id, multiple, pythonparams, children, onChange } = this.props;

    let value = this.props.value || '';
    const { selectOpen } = this.state;
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
          id={id}
          value={value}
          onChange={ (event) => {
            onChange(event);
            this.handleClose();
          }}
          multiple={!!multiple}
          pythonparams={pythonparams}
          open={selectOpen}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
        >
        {children}
      </MuiSelect>

      </FormControl>

    );
  }
}

export default Select;
