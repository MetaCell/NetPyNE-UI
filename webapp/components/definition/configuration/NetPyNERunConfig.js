import React from "react";
import { Autocomplete } from "@material-ui/lab";
import { NetPyNECheckbox, NetPyNEField, NetPyNETextField } from "root/components";
import TextField from "@material-ui/core/TextField";
import Utils from "root/Utils";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

class NetPyNERunConfig extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: "no_status",
      options: [
        { title: "net.params.popParams['E']['numCells']" },
        { title: "net.params.popParams['E']['cellType']" },
        { title: "net.params.connParams['E->E']['delay']" },
        { title: "net.params.connParams['E->E']['probability']" },
        { title: "net.params.connParams['E->E']['weight']" }
      ]
    }

    setInterval(() => {
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      Utils.evalPythonMessage('netpyne_geppetto.getStatus', [])
        .then(response => {
          const json = Utils.convertToJSON(response)
          if (this.status !== json.status) {
            this.setState({ status: json.status })
          }
        })
    }, 2000);
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <NetPyNEField
          id="batch_config.enabled"
          className={"netpyneCheckbox"}
        >
          <NetPyNECheckbox model={"batch_config['enabled']"}/>
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.name"
          className={"netpyneCheckbox"}
        >
          <NetPyNETextField
            model={"batch_config['name']"}
            fullWidth
            variant="filled"
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.method"
          className={"netpyneCheckbox"}
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={"batch_config['method']"}
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.seed"
          className={"netpyneCheckbox"}
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={"batch_config['seed']"}
          />
        </NetPyNEField>
        <NetPyNEField
          id="batch_config.saveFolder"
          className={"netpyneCheckbox"}
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={"batch_config['saveFolder']"}
          />
        </NetPyNEField>
        <Autocomplete
          id="combo-box-demo"
          options={this.state.options}
          getOptionLabel={option => option.title}
          classes={{ option: classes.option }}
          renderInput={params => <TextField {...params} label="Exploration Parameter" variant="filled"/>}
        />
        <Chip label={this.state.status}/>
        <Button fullWidth onClick={this.onStopClick}>Stop</Button>
      </div>
    )
  }

  onStopClick () {
    Utils.evalPythonMessage('netpyne_geppetto.stop', [])
      .then(response => {
        console.log(response)
      })
  }
}

const styles = () => ({ option: { color: "white" } });

export default withStyles(styles)(NetPyNERunConfig);