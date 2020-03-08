import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Utils from '../../../Utils';
import Select from '../../general/Select';
import ListComponent from '../../general/List';
import NetPyNEField from '../../general/NetPyNEField';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';

var PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledControl(TextField);
var PythonControlledListComponent = PythonControlledCapability.createPythonControlledControl(ListComponent);

export default class NetPyNEStimulationSource extends React.Component {

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
          GEPPETTO.trigger('stimSources_change');
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
            }
          })
        }
      });
  }

  handleStimSourceTypeChange (event) {
    Utils.execPythonMessage("netpyne_geppetto.netParams.stimSourceParams['" + this.state.currentName + "']['type'] = '" + event.target.value + "'");
    this.setState({ sourceType: event.target.value });
    GEPPETTO.trigger('stimSources_change', this.state.currentName);
  }

  render () {
    var actions = [
      <Button
        variant="contained"
        color="primary"
        label={"BACK"}
        onTouchTap={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
      />
    ];
    var title = this.state.errorMessage;
    var children = this.state.errorDetails;
    var dialogPop = (this.state.errorMessage != undefined) ? (
      <Dialog
        title={title}
        open={true}
        actions={actions}
        bodyStyle={{ overflow: 'auto' }}
        style={{ whiteSpace: "pre-wrap" }}>
        {children}
      </Dialog> 
    )
      : undefined;

    if (this.state.sourceType == 'IClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.del">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['del']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.dur">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.amp">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'VClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.tau1">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau1']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau2">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau2']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gain">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gain']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.rstim">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rstim']"}
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'AlphaSynapse') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.onset">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['onset']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['tau']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gmax">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['gmax']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.e">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['e']"}
            />
          </NetPyNEField>

        </div>
      );
    } else if (this.state.sourceType == 'NetStim') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.rate">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['rate']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.interval">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['interval']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.number">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['number']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.start">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['start']"}
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.noise">
            <PythonControlledTextField
              model={"netParams.stimSourceParams['" + this.props.name + "']['noise']"}
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'SEClamp') {
      var variableContent = (
        <div>
          <NetPyNEField id="netParams.stimSourceParams.vClampDur" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['dur']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.vClampAmp" className="listStyle">
            <PythonControlledListComponent
              model={"netParams.stimSourceParams['" + this.props.name + "']['amp']"}
            />
          </NetPyNEField>
          
          <NetPyNEField id="netParams.stimSourceParams.rs">
            <PythonControlledTextField
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
          />
          <br />

          <NetPyNEField id="netParams.stimSourceParams.type" className={"netpyneFieldNoWidth"} noStyle>
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
