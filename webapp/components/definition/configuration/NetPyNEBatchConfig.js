import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { NetPyNEField, NetPyNETextField } from 'root/components';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

class NetPyNEBatchConfig extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      options: [
        { title: 'net.params.popParams[\'E\'][\'numCells\']' },
        { title: 'net.params.popParams[\'E\'][\'cellType\']' },
        { title: 'net.params.connParams[\'E->E\'][\'delay\']' },
        { title: 'net.params.connParams[\'E->E\'][\'probability\']' },
        { title: 'net.params.connParams[\'E->E\'][\'weight\']' },
      ],
    };
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <NetPyNEField
          id="batch_config.name"
        >
          <NetPyNETextField
            model="batch_config.name"
            fullWidth
            variant="filled"
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.method"
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="batch_config.method"
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.seed"
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="batch_config.seed"
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.saveFolder"
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="batch_config.saveFolder"
          />
        </NetPyNEField>
        <Autocomplete
          id="combo-box-demo"
          options={this.state.options}
          getOptionLabel={(option) => option.title}
          classes={{ option: classes.option }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exploration Parameter"
              variant="filled"
            />
          )}
        />
      </div>
    );
  }
}

const styles = () => ({ option: { color: 'white' } });

export default withStyles(styles)(NetPyNEBatchConfig);
