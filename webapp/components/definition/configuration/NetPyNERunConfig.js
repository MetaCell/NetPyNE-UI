import React from "react";
import { NetPyNECheckbox, NetPyNEField, NetPyNETextField } from "root/components";
import Utils from "root/Utils";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

class NetPyNERunConfig extends React.Component {

  constructor (props) {
    super(props);
    this.state = { status: "no_status", }

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
          <NetPyNECheckbox model={"batch_config.enabled"}/>
        </NetPyNEField>
        <NetPyNEField
          id="run_config.asynchronous"
          className={"netpyneCheckbox"}
        >
          <NetPyNECheckbox model={"run_config.asynchronous"}/>
        </NetPyNEField>
        <NetPyNEField
          id="run_config.parallel"
          className={"netpyneCheckbox"}
        >
          <NetPyNECheckbox model={"run_config.parallel"}/>

        </NetPyNEField>
        <NetPyNEField
          id="run_config.type"
        >
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={"run_config.type"}
          />
        </NetPyNEField>
        <NetPyNEField
          id="run_config.cores"
        >
          <NetPyNETextField
            model={"run_config.cores"}
            fullWidth
            variant="filled"
          />
        </NetPyNEField>
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