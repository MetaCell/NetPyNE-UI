import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

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
  ListComponent,
  NetPyNESelectField
} from 'netpyne/components';
import Utils from '../../../Utils';
import Select from '../../general/Select';
import Checkbox from '../../general/Checkbox';
import { Grid, Typography } from '@material-ui/core';
import { vars } from '../../../theme';

const { textColor, primaryColor, experimentLabelColor } = vars;

const styles = ({ spacing }) => ({
  selectField: {
    marginTop: spacing(3),
    width: '100%',
  },
});
const newPulseObject = {
  start: null,
  end: null,
  noise: null,
};
class NetPyNEStimulationSource extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      sourceType: 'NetStim',
      errorMessage: undefined,
      errorDetails: undefined,
      pulses: [{
        ...newPulseObject,
      }],
    };
    this.stimSourceTypeOptions = [
      { type: 'NetStim' },
      { type: 'IClamp' },
      { type: 'VClamp' },
      { type: 'SEClamp' },
      { type: 'AlphaSynapse' },
    ];
    this.handleStimSourceTypeChange = this.handleStimSourceTypeChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.currentName != nextProps.name) {
      Utils.evalPythonMessage(
        `netpyne_geppetto.netParams.stimSourceParams['${
          nextProps.name
        }']['type']`,
      )
        .then((response) => {
          if (response !== this.state.sourceType) {
            this.setState({ sourceType: response });
            this.props.updateCards();
          }
        });

      this.setState({
        currentName: nextProps.name,
        sourceType: '',
      });
    }
  }

  handleRenameChange = (event) => {
    const storedValue = this.props.name;
    const newValue = Utils.nameValidation(event.target.value);
    const updateCondition = this.props.renameHandler(newValue);
    const triggerCondition = Utils.handleUpdate(
      updateCondition,
      newValue,
      event.target.value,
      this,
      'StimulationSource',
    );

    if (triggerCondition) {
      this.triggerUpdate(() => {
        Utils.renameKey(
          'netParams.stimSourceParams',
          storedValue,
          newValue,
          (response, newValue) => {
            this.renaming = false;
            this.props.updateCards();
          },
        );
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
    const opts = this.stimSourceTypeOptions.map((option) => option.type);
    Utils.evalPythonMessage(
      `[value == netpyne_geppetto.netParams.stimSourceParams['${
        this.state.currentName
      }']['type'] for value in ${
        JSON.stringify(opts)
      }]`,
    )
      .then((responses) => {
        if (responses.constructor.name == 'Array') {
          responses.forEach((response, index) => {
            if (response && this.state.sourceType != opts[index]) {
              this.setState({ sourceType: opts[index] });
              this.props.updateCards();
            }
          });
        }
      });
  }

  handleStimSourceTypeChange (event) {
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.stimSourceParams['${
        this.state.currentName
      }']['type'] = '${
        event.target.value
      }'`,
    );
    this.setState({ sourceType: event.target.value });
    this.props.updateCards();
  }

  addAnotherPulse = () => {
    this.setState((prevState) => ({
      ...prevState, // Spread the current state to retain other properties
      pulses: [...prevState.pulses, { ...newPulseObject }], // Push the new object into the 'pulses' array
    }));
  };

  render () {
    const { classes } = this.props;
    const dialogPop = this.state.errorMessage != undefined ? (
      <Dialog open style={{ whiteSpace: 'pre-wrap' }}>
        <DialogTitle id="alert-dialog-title">
          {this.state.errorMessage}
        </DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {this.state.errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({
              errorMessage: undefined,
              errorDetails: undefined,
            })}
          >
            BACK
          </Button>
        </DialogActions>
      </Dialog>
    ) : (
      undefined
    );

    if (this.state.sourceType == 'IClamp') {
      var variableContent = (
        <div className="scrollbar scrollchild">
          <NetPyNEField id="netParams.stimSourceParams.del">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['del']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.dur">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['dur']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.amp">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['amp']`
              }
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'VClamp') {
      var variableContent = (
        <div className="scrollbar scrollchild">
          <NetPyNEField id="netParams.stimSourceParams.tau1">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['tau1']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau2">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['tau2']`
              }
            />
          </NetPyNEField>

          <NetPyNEField
            id="netParams.stimSourceParams.vClampDur"
            className="listStyle"
          >
            <ListComponent
              model={
                `netParams.stimSourceParams['${this.props.name}']['dur']`
              }
            />
          </NetPyNEField>

          <NetPyNEField
            id="netParams.stimSourceParams.vClampAmp"
            className="listStyle"
          >
            <ListComponent
              model={
                `netParams.stimSourceParams['${this.props.name}']['amp']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gain">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['gain']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.rstim">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['rstim']`
              }
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'AlphaSynapse') {
      var variableContent = (
        <div className="scrollbar scrollchild">
          <NetPyNEField id="netParams.stimSourceParams.onset">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['onset']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.tau">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['tau']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.gmax">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['gmax']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.e">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['e']`
              }
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'NetStim') {
      var variableContent = (
        <div className="scrollbar scrollchild">
          <NetPyNEField id="netParams.stimSourceParams.rate">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['rate']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.interval">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${
                  this.props.name
                }']['interval']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.number">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${
                  this.props.name
                }']['number']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.start">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['start']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.noise">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['noise']`
              }
            />
          </NetPyNEField>
        </div>
      );
    } else if (this.state.sourceType == 'SEClamp') {
      var variableContent = (
        <div className="scrollbar scrollchild">
          <NetPyNEField
            id="netParams.stimSourceParams.vClampDur"
            className="listStyle"
          >
            <ListComponent
              model={
                `netParams.stimSourceParams['${this.props.name}']['dur']`
              }
            />
          </NetPyNEField>

          <NetPyNEField
            id="netParams.stimSourceParams.vClampAmp"
            className="listStyle"
          >
            <ListComponent
              model={
                `netParams.stimSourceParams['${this.props.name}']['amp']`
              }
            />
          </NetPyNEField>

          <NetPyNEField id="netParams.stimSourceParams.rs">
            <NetPyNETextField
              variant="filled"
              fullWidth
              model={
                `netParams.stimSourceParams['${this.props.name}']['rs']`
              }
            />
          </NetPyNEField>
        </div>
      );
    } else {
      var variableContent = <div />;
    }

    return (
      <Box className="scrollbar scrollchild" mt={1}>
        {/* <Box display='flex' flexDirection='column' style={ { gap: '0.5rem' } }>
            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="Seed"
            />
            <NetPyNEField mb={0} id="netParams.popParams.cellType">
              <NetPyNESelectField
                style={{mb: 0}}
                method="netpyne_geppetto.getAvailableCellTypes"
                model={
                  `netParams.popParams['${this.props.name}']['cellType']`
                }
                postProcessItems={this.postProcessMenuItems}
              />
            </NetPyNEField>

            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="Seed"
            />

<Box display='flex' alignItems='flex-start' style={{gap: '1rem'}}>
              <Typography style={ {
                  color: experimentLabelColor, flexShrink: 0, padding: '18.5px 0 18.5px 10px', fontSize: '0.875rem', lineHeight: '130%', fontWeight: 400
                } }
              >
                Spiking Pulse / Rate
              </Typography>
              <Box display='flex' flexDirection='column' style={{gap: '0.5rem'}}>
                { this.state.pulses.map((pulse, index) => ( <Grid container alignItems='center' spacing={1} key={`stimpulse_${index}`}>
                  <Grid item xs={4}>
                    <TextField
                      variant="filled"
                      fullWidth
                      onChange={this.handleRenameChange}
                      value={this.state.currentName}
                      disabled={this.renaming}
                      label="Start"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="filled"
                      fullWidth
                      onChange={this.handleRenameChange}
                      value={this.state.currentName}
                      disabled={this.renaming}
                      label="End"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="filled"
                      fullWidth
                      onChange={this.handleRenameChange}
                      value={this.state.currentName}
                      disabled={this.renaming}
                      label="Noise"
                    />
                  </Grid>
                </Grid> )
                )}
              </Box>
            </Box>

            <Box pl={1.25}>
              <Button
                className='noHover'
                disableRipple
                style={ { color: primaryColor, padding: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.01rem', lineHeight: '200%', fontWeight: 700 } }
                variant='text'
                onClick={() => this.addAnotherPulse()}
              >+ add another pulse</Button>
            </Box>

            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="Spike intervals (ms)"
            />


            <NetPyNEField mb={0} id="netParams.importCellParams.importSynMechs">
              <Checkbox
                fullWidth
                noBackground
              />
            </NetPyNEField>


            <NetPyNEField mb={0} id="netParams.popParams.cellType">
              <NetPyNESelectField
                style={{mb: 0}}
                method="netpyne_geppetto.getAvailableCellTypes"
                model={
                  `netParams.popParams['${this.props.name}']['cellType']`
                }
                postProcessItems={this.postProcessMenuItems}
              />
            </NetPyNEField>

            <Grid container alignItems='center' spacing={1}>
              <Grid item xs={2} justifyContent='center'>
                <Typography style={{color: experimentLabelColor, fontSize: '0.875rem', lineHeight: '130%', fontWeight: 400}}>Start</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="filled"
                  fullWidth
                  onChange={this.handleRenameChange}
                  value={this.state.currentName}
                  disabled={this.renaming}
                  label="Start"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  variant="filled"
                  fullWidth
                  onChange={this.handleRenameChange}
                  value={this.state.currentName}
                  disabled={this.renaming}
                  label="End"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  variant="filled"
                  fullWidth
                  onChange={this.handleRenameChange}
                  value={this.state.currentName}
                  disabled={this.renaming}
                  label="Noise"
                />
              </Grid>
            </Grid>

            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="Frequency (Hz)"
            />
          </Box> */}
        <div>
          <Box mb={1}>
            <TextField
              fullWidth
              variant="filled"
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="The name of the stimulation source"
            />
          </Box>

          <NetPyNEField
            id="netParams.stimSourceParams.type"
            className={classes.selectField}
          >
            <Select
              fullWidth
              id="stimSourceSelect"
              label="stimulation type"
              value={this.state.sourceType}
              onChange={this.handleStimSourceTypeChange}
            >
              {this.stimSourceTypeOptions != undefined
                ? this.stimSourceTypeOptions.map((
                  stimSourceTypeOption,
                ) => (
                  <MenuItem
                    id={`${stimSourceTypeOption.type}MenuItem`}
                    key={stimSourceTypeOption.type}
                    value={stimSourceTypeOption.type}
                  >
                    {stimSourceTypeOption.type}
                  </MenuItem>
                ))
                : null}
            </Select>
          </NetPyNEField>
        </div>
        {variableContent}
        {dialogPop}
      </Box>
    );
  }
}

export default withStyles(styles)(NetPyNEStimulationSource);
