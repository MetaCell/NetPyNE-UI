import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = ({ spacing, palette }) => ({
  home: { },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

class NetPyNETextField extends React.Component {
  render() {
    const { label, ...rest } = this.props;

    return (
      <TextField
        label={label}
        {...rest}
      />
    );
  }
}

export default withStyles(styles)(NetPyNETextField);