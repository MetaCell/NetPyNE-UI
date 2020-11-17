import React from "react";
import TextField from "@material-ui/core/TextField";
import Utils from "../../../../../Utils";
import Box from "@material-ui/core/Box";
import { NetPyNETextField } from "netpyne/components";

export default class NetPyNEMechanism extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      mechFields: "",
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }

  renderMechFields = () => {
    if (this.state.mechFields == "") {
      return <div key={"empty"} />;
    }

    const { currentName } = this.state;
    const { cellRule, section } = this.props;
    let tag = `netParams.cellParams['${cellRule}']['secs']['${section}']['mechs']['${currentName}']`;

    return this.state.mechFields.map((name, i) => (
      <Box mb={1} key={name}>
        <NetPyNETextField
          fullWidth
          variant="filled"
          name={name}
          model={`${tag}['${name}']`}
          label={name}
          realType={"float"}
        />
      </Box>
    ));
  };

  render () {
    var content = [];
    if (this.state.currentName != undefined && this.state.currentName != "") {
      Utils.evalPythonMessage("netpyne_geppetto.getMechParams", [
        this.state.currentName,
      ]).then(response => {
        if (JSON.stringify(this.state.mechFields) != JSON.stringify(response)) {
          this.setState({ mechFields: response });
        }
      });
      content.push(this.renderMechFields());
    }

    return (
      <Box className={`scrollbar scrollchild`} mt={1}>
        <Box mb={1}>
          <TextField
            variant="filled"
            fullWidth
            value={this.state.currentName}
            label="The name of the mechanism"
            disabled={true}
          />
        </Box>

        {content}
      </Box>
    );
  }
}
