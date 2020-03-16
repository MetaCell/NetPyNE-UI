import React from 'react';
import TextField from '@material-ui/core/TextField';
import Utils from '../../../../../Utils';
import { withStyles } from '@material-ui/core/styles';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);

const styles = ({ spacing }) => ({
  fields: { 
    marginTop: spacing(3),
    width: '100%'
  } 
})
class NetPyNEMechanism extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      mechFields: ''
    };
  }
  
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ currentName: nextProps.name });
  }
  
  renderMechFields = classes => {
    if (this.state.mechFields == '') {
      return <div key={"empty"}/>
    } else {
      var tag = "netParams.cellParams['" + this.props.cellRule + "']['secs']['" + this.props.section + "']['mechs']['" + this.state.currentName + "']"
      return this.state.mechFields.map((name, i) =>
        <PythonControlledTextField id={"mechName" + name} name={name} key={name} model={tag + "['" + name + "']"} label={name} realType={"float"} className={classes.fields}/>
      )
    }
  };

  render () {
    const { classes } = this.props
    var content = []
    if (this.state.currentName != undefined && this.state.currentName != '') {
      Utils
        .evalPythonMessage("netpyne_geppetto.getMechParams", [this.state.currentName])
        .then(response => {
          if (JSON.stringify(this.state.mechFields) != JSON.stringify(response)) {
            this.setState({ mechFields: response })
          }
        })
      content.push(this.renderMechFields(classes))
    }
    
    return (
      <div>
        <TextField
          id={"singleMechName"}
          key="netpyneField"
          value={this.state.currentName}
          label="Mechanism"
          className={"netpyneField"}
          disabled={true}
        />
        <br />
        {content}
      </div>
    );
  }
}
export default withStyles(styles)(NetPyNEMechanism)