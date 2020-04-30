import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Utils from '../../../Utils';
import Select from '../../general/Select';

import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
  NetPyNEField,
  NetPyNETextField,
  ListComponent
} from 'netpyne/components';

const styles = ({ spacing }) => ({
  selectField: { 
    marginTop: spacing(3),
    width: '100%'
  },
})

class NetPyNEStimulationSource extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      sourceType: 'IClamp',
      errorMessage: undefined,
      errorDetails: undefined
    };
    this.stimSourceTypeOptions = [
      { type: 'IClamp' },
      { type: 'VClamp' },
      { type: 'SEClamp' },
      { type: 'NetStim' },
      { type: 'AlphaSynapse' }
    ];
    this.handleStimSourceTypeChange = this.handleStimSourceTypeChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.currentName != nextProps.name) {
      Utils.evalPythonMessage("netpyne_geppetto.netParams.stimSourceParams['" + nextProps.name + "']['type']")
        .then(response => {
          if (response !== this.state.sourceType) {
            this.setState({ sourceType: response })
            this.props.updateCards()
          }
        })

      this.setState({ currentName: nextProps.name, sourceType: '' });
      
    }
  }

  handleRenameChange = event => {
    var storedValue = this.props.name;
    var newValue = Utils.nameValidation(event.target.value);
    var updateCondition = this.props.renameHandler(newValue);
    var triggerCondition = Utils.handleUpdate(updateCondition, newValue, event.target.value, this, "StimulationSource");

    if (triggerCondition) {
      this.triggerUpdate(() => {
        Utils.renameKey('netParams.stimSourceParams', storedValue, newValue, (response, newValue) => {
          this.renaming = false
          this.props.updateCards()
        });
        this.renaming = true;
        /*
         * Update layout has been inserted in the triggerUpdate since this will have to query the backend
         * So we need to delay this along with the rename, differently we will face a key issue with netpyne
         */
        this.updateLayout();
      });
    }
  };

  triggerUpdate (updateMethod) {
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  componentDidMount () {
    this.updateLayout();
  }

  updateLayout () {
    var opts = this.stimSourceTypeOptions.map(option => option.type);
    Utils
      .evalPythonMessage("[value == netpyne_geppetto.netParams.stimSourceParams['" + this.state.currentName + "']['type'] for value in " + JSON.stringify(opts) + "]")
      .then(responses => {
        if (responses.constructor.name == "Array"){
          responses.forEach( (response, index) => {
            if (response && this.state.sourceType != opts[index]) {
              this.setState({ sourceType: opts[index] })
              this.props.updateCards()
            }
          })
        }
      });
  }

  handleStimSourceTypeChange (event) {
    Utils.execPythonMessage("netpyne_geppetto.netParams.stimSourceParams['" + this.state.currentName + "']['type'] = '" + event.target.value + "'");
    this.setState({ sourceType: event.target.value });
    this.props.updateCards()
  }

  render () {
    const { classes } = this.props
    var dialogPop = (this.state.errorMessage != undefined) ? (
      <Dialog
        open={true}
        style={{ whiteSpace: "pre-wrap" }}>
        <DialogTitle id="alert-dialog-title">{this.state.errorMessage}</DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {this.state.errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          >BACK</Button>
        </DialogActions>
      </Dialog>
    )
      : undefined

    if (this.state.sourceType == 'IClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.del">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['del']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.dur">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.amp">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'VClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.tau1">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau1']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau2">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau2']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <ListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <ListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gain">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gain']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.rstim">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rstim']"}
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'AlphaSynapse') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.onset">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['onset']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gmax">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gmax']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.e">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['e']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'NetStim') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.rate">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rate']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.interval">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['interval']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.number">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['number']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.start">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['start']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.noise">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['noise']"}
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'SEClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <ListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <ListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.rs">
            <NetPyNETextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rs']"}
            />
          </NetPyNEField>

        </div>
      )
    } else {
      var variableContent = <div />
    }

    return (
      <div>
        <div>
          <TextField
            onChange={this.handleRenameChange}
            value={this.state.currentName}
            disabled={this.renaming}
            className={"netpyneField"}
            id={"sourceName"}
            label="Stimulation source name"
            style={{ marginTop: 8 }}
          />
          <br />

          <NetPyNEField id="netParams.stimSourceParams.type" className={classes.selectField}>
            <Select
              id={"stimSourceSelect"}
              label="stimulation type"
              value={this.state.sourceType}
              onChange={this.handleStimSourceTypeChange}
            >
              {(this.stimSourceTypeOptions != undefined)
                ? this.stimSourceTypeOptions.map(function (stimSourceTypeOption) {
                  return (
                    <MenuItem
                      id={stimSourceTypeOption.type + "MenuItem"}
                      key={stimSourceTypeOption.type}
                      value={stimSourceTypeOption.type}
                    >
                      {stimSourceTypeOption.type}
                    </MenuItem>
                  )
                }) : null
              }
            </Select>
          </NetPyNEField>
        </div>
        {variableContent}
        {dialogPop}
      </div>
    );
  }
}


export default withStyles(styles)(NetPyNEStimulationSource)