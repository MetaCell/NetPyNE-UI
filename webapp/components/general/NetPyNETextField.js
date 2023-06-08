import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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