import React from 'react';
import { NetPyNECheckbox, NetPyNEField, NetPyNETextField } from 'root/components';
import Utils from 'root/Utils';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

class NetPyNERunConfig extends React.Component {
  constructor (props) {
    super(props);
    this.state = { status: 'no_status' };

    setInterval(() => {
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      Utils.evalPythonMessage('netpyne_geppetto.getSimulations', [])
        .then((response) => {
          if (response && response.length > 0) {
            if (this.status !== response[0].status) {
              this.setState({ status: response[0].status });
            }
          }
        });
    }, 2000);
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <NetPyNEField
          id="batch_config.enabled"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model="batch_config.enabled"/>
        </NetPyNEField>
        <NetPyNEField
          id="run_config.asynchronous"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model="run_config.asynchronous"/>
        </NetPyNEField>
        <NetPyNEField
          id="run_config.parallel"
          className="netpyneCheckbox"
        >
          <NetPyNECheckbox model="run_config.parallel"/>

        </NetPyNEField>
        <NetPyNEField
          id="run_config.type"
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="run_config.type"
          />
        </NetPyNEField>
        <NetPyNEField
          id="run_config.cores"
        >
          <NetPyNETextField
            model="run_config.cores"
            fullWidth
            variant="filled"
          />
        </NetPyNEField>
        <Chip label={this.state.status} />
        <Button fullWidth onClick={this.onStop}>Stop</Button>
        <Button fullWidth onClick={this.onGetAll}>Get All</Button>
        <Button fullWidth onClick={this.onAdd}>Add</Button>
        <Button fullWidth onClick={this.onDelete}>Delete</Button>
        <Button fullWidth onClick={this.onGet}>Get</Button>
        <Button fullWidth onClick={this.onJsonView}>JSON View</Button>
      </div>
    );
  }

  onStop () {
    Utils.evalPythonMessage('netpyne_geppetto.stop', [])
      .then((response) => {
        console.log(response);
      });
  }

  onGetAll () {
    Utils.evalPythonMessage('netpyne_geppetto.experiments.get_experiments', [])
      .then((response) => {
        console.log(response);
      });
  }

  onDelete () {
    Utils.evalPythonMessage('netpyne_geppetto.experiments.remove_experiment', ['IF_Neurons'])
      .then((response) => {
        console.log(response);
      });
  }

  onGet () {
    Utils.evalPythonMessage('netpyne_geppetto.experiments.get_experiment', ['IF_Neurons'])
      .then((response) => {
        console.log(response);
      });
  }

  onAdd () {
    Utils.evalPythonMessage('netpyne_geppetto.experiments.add_experiment', ['IF_Neurons'])
      .then((response) => {
        console.log(response);
      });
  }

  onJsonView () {
    Utils.evalPythonMessage('netpyne_geppetto.getModelAsJson', [])
      .then((response) => {
        console.log(response);
      });
  }
}

const styles = () => ({ option: { color: 'white' } });

export default withStyles(styles)(NetPyNERunConfig);
