import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { BottomNavigation, BottomNavigationAction, Grid, Switch, Typography } from '@material-ui/core';
import FontIcon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { withStyles } from '@material-ui/core/styles';
import {
  Dimensions,
  NetPyNEField,
  NetPyNECoordsRange,
  NetPyNESelectField,
  NetPyNETextField,
  ListComponent,
  Tooltip,
} from 'netpyne/components';
import Utils from '../../../Utils';
import Checkbox from '../../general/Checkbox';
import { vars } from '../../../theme';
import { BASE_PATH } from '../../general/NetPyNEIcons';
import { evalPythonMessage, execPythonMessage } from '../../general/GeppettoJupyterUtils';

const styles = ({ spacing }) => ({
  fields: {
    marginTop: spacing(3),
    width: '100%',
  },
});

const { textColor, primaryColor, experimentLabelColor } = vars;
const newPulseObject = {
  start: 0,
  end: 0,
  rate: 0,
  noise: 0,
};

class NetPyNEPopulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: 'General',
      errorMessage: undefined,
      errorDetails: undefined,
      startParam: 'start',
      model: undefined
    };

    this.updateModel()
  }

  updateModel = async (componentName) => {
    const name = componentName ? componentName : this.props.name;
    const command = `utils.convertToJS(netpyne_geppetto.netParams.popParams['${name}'])`
    const response = await execPythonMessage(command)
    this.setState({ model: response })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      currentName: nextProps.name,
      selectedIndex: 0,
      sectionId: 'General',
    });
    this.updateModel(nextProps.name)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.model == undefined
      || this.state.currentName != nextState.currentName
      || this.state.cellModelFields != nextState.cellModelFields
      || this.state.sectionId != nextState.sectionId
      || this.state.selectedIndex != nextState.selectedIndex
      || this.state.model != nextState.model
    );
  }

  getModelParameters = () => {
    const select = (index, sectionId) => this.setState({
      selectedIndex: index,
      sectionId,
    });

    const modelParameters = [];
    modelParameters.push(
      <BottomNavigationAction
        id="generalPopTab"
        key="General"
        label="General"
        icon={<FontIcon className="fa fa-bars" />}
        onClick={() => select(0, 'General')}
      />,
    );
    modelParameters.push(
      <BottomNavigationAction
        id="spatialDistPopTab"
        key="SpatialDistribution"
        label="Spatial Distribution"
        icon={<FontIcon className="fa fa-cube" />}
        onClick={() => select(1, 'SpatialDistribution')}
      />,
    );
    if (
      typeof this.state.cellModelFields !== 'undefined'
      && this.state.cellModelFields != ''
    ) {
      modelParameters.push(
        <BottomNavigationAction
          key={this.state.cellModel}
          label={`${this.state.cellModel} Model`}
          icon={<FontIcon className="fa fa-balance-scale" />}
          onClick={() => select(2, this.state.cellModel)}
        />,
      );
    }
    modelParameters.push(
      <BottomNavigationAction
        key="Stimulation"
        label="Stimulation"
        icon={<FontIcon><img src={`${BASE_PATH}stimSourceParams.svg`} style={{ height: '100%', filter: this.state.sectionId === 'Stimulation' ? 'none' : 'brightness(0) invert(1)' }} /></FontIcon>}
        onClick={() => select(4, 'Stimulation')}
      />,
    );

    return modelParameters;
  };

  handleRenameChange = (event) => {
    const storedValue = this.props.name;
    const newValue = Utils.nameValidation(event.target.value);
    const updateCondition = this.props.renameHandler(newValue);
    const triggerCondition = Utils.handleUpdate(
      updateCondition,
      newValue,
      event.target.value,
      this,
      'Population',
    );

    if (triggerCondition) {
      this.triggerUpdate(() => {
        // Rename the population in Python
        Utils.renameKey(
          'netParams.popParams',
          storedValue,
          newValue,
          (response, newValue) => {
            this.renaming = false;
            this.props.updateCards();
          },
        );
        this.renaming = true;
      });
    }
  };

  triggerUpdate(updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  postProcessMenuItems(pythonData, selected) {
    return pythonData.map((name) => (
      <MenuItem
        id={`${name}MenuItem`}
        key={name}
        checked={selected.indexOf(name) > -1}
        value={name}
      >
        {name}
      </MenuItem>
    ));
  }


  changeCellModel = (newValue) => {
    this.updateModel()
  }

  changeCellPattern = (newValue) => {
    if (!newValue) {
      execPythonMessage(`del netpyne_geppetto.netParams.popParams['${this.props.name}']['spikePattern']`)
    }
    else {
      execPythonMessage(`netpyne_geppetto.netParams.popParams['${this.props.name}']['spikePattern'] = {}
netpyne_geppetto.netParams.popParams['${this.props.name}']['spikePattern']['type'] = '${newValue}'`)
    }
    this.updateModel()
  }

  handleStartMaxChange = (newValue) => {
    const maxIsSet = !(!newValue || newValue === '')
    if (maxIsSet) {
      const command = `
pattern = netpyne_geppetto.netParams.popParams['${this.props.name}']['spikePattern']
pattern['start'], pattern['startMin'] = -1, pattern.get('start', '')`
      execPythonMessage(command)
    } else {
      const command = `
pattern = netpyne_geppetto.netParams.popParams['${this.props.name}']['spikePattern']
pattern['start'] = pattern['startMin']
del pattern['startMin']`
      execPythonMessage(command)
    }

    this.setState({
      startParam: maxIsSet ? "startMin" : "start"
    })
  }

  rhythmicLayout = () => {
    return <>
      <Box display='flex' alignItems='center' style={{ gap: '1rem' }}>
        <Typography style={{ color: experimentLabelColor, fontSize: '0.875rem', paddingLeft: '0.625rem', lineHeight: '130%', fontWeight: 400 }}>Start</Typography>
        <Grid container alignItems='center' spacing={1}>
          <Grid item xs={4}>
            <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.start">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.popParams['${this.props.name}']['spikePattern']['${this.state.startParam}']`}
              />
            </NetPyNEField>
          </Grid>
          <Grid item xs={4}>
            <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.startMax">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.popParams['${this.props.name}']['spikePattern']['startMax']`}
                callback={this.handleStartMaxChange}
              />
            </NetPyNEField>
          </Grid>
          <Grid item xs={4}>
            <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.startStd">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`netParams.popParams['${this.props.name}']['spikePattern']['startStd']`}
              />
            </NetPyNEField>
          </Grid>
        </Grid>
      </Box>

      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.freq">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['freq']`}
        />
      </NetPyNEField>

      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.freqStd">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['freqStd']`}
        />
      </NetPyNEField>

      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.distribution">
        <NetPyNESelectField
          style={{ mb: 0 }}
          method="netpyne_geppetto.getAvailableStimulationDistribution"
          model={
            `netParams.popParams['${this.props.name}']['spikePattern']['distribution']`
          }
          postProcessItems={this.postProcessMenuItems}
        />
      </NetPyNEField>

      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.eventsPerCycle">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['eventsPerCycle']`}
        />
      </NetPyNEField>

      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.repeats">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['repeats']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.rhythmic.stop">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['stop']`}
        />
      </NetPyNEField>
    </>
  }

  evokedLayout = () => {
    return <>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.evoked.start">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['start']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.evoked.inc">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['inc']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.evoked.startStd">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['startStd']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.evoked.numspikes">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['numspikes']`}
        />
      </NetPyNEField>
    </>
  }

  poissonLayout = () => {
    return <>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.poisson.start">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['start']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.poisson.stop">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['stop']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.poisson.frequency">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['frequency']`}
        />
      </NetPyNEField>
    </>
  }

  gaussLayout = () => {
    return <>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.gauss.mu">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['mu']`}
        />
      </NetPyNEField>
      <NetPyNEField mb={0} id="netParams.popParams.spikePattern.gauss.sigma">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['spikePattern']['sigma']`}
        />
      </NetPyNEField>
    </>
  }

  changeStimulationPatternLayout = (pattern) => {
    const patternKey = `${pattern}Layout`;
    if (!(patternKey in this)) {
      return <></>
    }
    return this[patternKey]()
  }

  addAnotherPulse = () => {
    const command = `
pulse = {'start': 0, 'end': 0, 'rate': 0, 'noise': 0}
netpyne_geppetto.netParams.popParams['${this.props.name}'].setdefault('pulses', []).append(pulse)
pulse`
    execPythonMessage(command).then((_) => {
      this.updateModel()
    })
  };

  removePulse = (index) => {
    const command = `
netpyne_geppetto.netParams.popParams['${this.props.name}']['pulses'].pop(${index})`
    execPythonMessage(command).then((_) => {
      this.updateModel()
    })
  }

  displayPulses = () => {
    if (!this.state.model || !this.state.model.pulses) {
      return <></>
    }
    return this.state.model.pulses.map((pulse, index) => (
      <Grid container alignItems='center' spacing={1} key={`pulse_${index}`}>
        <Tooltip title="Delete pulse" placement="top">
          <IconButton size="small" onClick={() => this.removePulse(index)}>
            <Icon fontSize="inherit" style={{ color: primaryColor }} className="fa fa-trash-o" />
          </IconButton>
        </Tooltip>
        <Grid item xs={3}>
          <NetPyNEField mb={0} id="netParams.popParams.pulses.start">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`netParams.popParams['${this.props.name}']['pulses'][${index}]['start']`}
            />
          </NetPyNEField>
        </Grid>
        <Grid item xs={3}>
          <NetPyNEField mb={0} id="netParams.popParams.pulses.end">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`netParams.popParams['${this.props.name}']['pulses'][${index}]['end']`}
            />
          </NetPyNEField>
        </Grid>
        <Grid item xs={2}>
          <NetPyNEField mb={0} id="netParams.popParams.pulses.rate">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`netParams.popParams['${this.props.name}']['pulses'][${index}]['rate']`}
            />
          </NetPyNEField>
        </Grid>
        <Grid item xs={2}>
          <NetPyNEField mb={0} id="netParams.popParams.pulses.noise">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`netParams.popParams['${this.props.name}']['pulses'][${index}]['noise']`}
            />
          </NetPyNEField>
        </Grid>
        {/* <Grid item xs={1}>
          <IconButton size="small" onClick={() => this.removePulse(index)} >
            <Icon fontSize="inherit" style={ { color: primaryColor } } className="fa fa-trash-o" />
          </IconButton>
        </Grid> */}
      </Grid>))
  }

  cellStimulationLayout = () => {
    if (!this.state.model) {
      return <></>
    }
    if (!["VecStim", "NetStim"].includes(this.state.model.cellModel)) {
      return <></>
    }
    return <>
      <NetPyNEField id="netParams.popParams.seed">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['seed']`}
        />
      </NetPyNEField>
      <NetPyNEField
        id="netParams.popParams.spkTimes"
        className="listStyle"
      >
        <ListComponent
          model={`netParams.popParams['${this.props.name}']['spkTimes']`}
        />
      </NetPyNEField>
      <Box display='flex' alignItems='flex-start' style={{ gap: '1rem' }}>
        <Typography style={{
          color: experimentLabelColor, flexShrink: 0, padding: '18.5px 0 18.5px 10px', fontSize: '0.875rem', lineHeight: '130%', fontWeight: 400
        }}
        >
          Spiking Pulse
        </Typography>
        <Box display='flex' flexDirection='column' style={{ gap: '0.5rem' }}>
          {this.displayPulses()}
        </Box>
      </Box>

      <Box pl={1.25}>
        <Button
          className='noHover'
          disableRipple
          style={{ color: primaryColor, padding: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.01rem', lineHeight: '200%' }}
          variant='text'
          onClick={() => this.addAnotherPulse()}
        >+ add another pulse</Button>
      </Box>

      <NetPyNEField mb={0} id="netParams.popParams.interval">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model={`netParams.popParams['${this.props.name}']['interval']`}
        />
      </NetPyNEField>


      {/* <NetPyNEField mb={0} id="netParams.importCellParams.importSynMechs">
        <Checkbox
          fullWidth
          noBackground
        />
      </NetPyNEField> */}


      <NetPyNEField mb={0} id="netParams.popParams.spikePattern">
        <NetPyNESelectField
          style={{ mb: 0 }}
          method="netpyne_geppetto.getAvailableStimulationPattern"
          model={
            `netParams.popParams['${this.props.name}']['spikePattern']['type']`
          }
          postProcessItems={this.postProcessMenuItems}
          postHandleChange={this.changeCellPattern}
        />
      </NetPyNEField>

      {this.changeStimulationPatternLayout(this.state.model?.spikePattern?.type)}


    </>
  }

  render() {

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
    if (this.state.sectionId == 'General') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          <Box mb={1}>
            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="The name of the population"
            />
          </Box>

          <div id="netParams_popParams_cellType">
            <NetPyNEField id="netParams.popParams.cellType">
              <NetPyNESelectField
                value=""
                method="netpyne_geppetto.getAvailableCellTypes"
                model={
                  `netParams.popParams['${this.props.name}']['cellType']`
                }
                postProcessItems={this.postProcessMenuItems}
              />
            </NetPyNEField>
          </div>
          <Dimensions modelName={this.props.name} />
          {dialogPop}
        </Box>
      );
    } else if (this.state.sectionId == 'SpatialDistribution') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          <NetPyNECoordsRange
            id="xRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'xRange',
                label: 'Absolute',
              },
              {
                value: 'xnormRange',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="yRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'yRange',
                label: 'Absolute',
              },
              {
                value: 'ynormRange',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="zRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'zRange',
                label: 'Absolute',
              },
              {
                value: 'znormRange',
                label: 'Normalized',
              },
            ]}
          />
        </Box>
      );
    } else if (this.state.sectionId == 'Stimulation') {
      var content = (
        <Box className="scrollbar scrollchild" mt={1}>
          {/* <Box mb={ 3.5 } display='flex' style={ { gap: '0.5rem' } }>
            <Box>
              <Switch checked={true} />
            </Box>
            <Box>
              <Typography style={ {
                fontSize: '0.875rem',
                lineHeight: '130%',
                color: textColor
              }}>Override stimulation</Typography>
              <Typography style={ {
                marginBottom: '0.25rem',
                opacity: '0.7',
                fontSize: '0.75rem',
                lineHeight: '130%',
                color: textColor
              }}>
                Stimulation is automatically set to the same configurations as the VectStim’s stimulation that has been set in ‘Stim. Sources’
              </Typography>
              <Button
                className='noHover'
                disableRipple
                style={ { color: primaryColor, padding: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.01rem', lineHeight: '200%' } }
                variant='text'
              >View Configurations in stim. source</Button>
            </Box>
          </Box> */}
          <Box display='flex' flexDirection='column' style={{ gap: '0.5rem' }}>
            <NetPyNEField mb={0} id="netParams.popParams.cellModel">
              <NetPyNESelectField
                style={{ mb: 0 }}
                method="netpyne_geppetto.getAvailableCellModels"
                model={
                  `netParams.popParams['${this.props.name}']['cellModel']`
                }
                postProcessItems={this.postProcessMenuItems}
                postHandleChange={this.changeCellModel}
              />
            </NetPyNEField>
            {this.cellStimulationLayout()}
          </Box>
          {/* <NetPyNECoordsRange
            id="xRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'xRange',
                label: 'Absolute',
              },
              {
                value: 'xnormRange',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="yRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'yRange',
                label: 'Absolute',
              },
              {
                value: 'ynormRange',
                label: 'Normalized',
              },
            ]}
          />

          <NetPyNECoordsRange
            id="zRangePopParams"
            name={this.props.name}
            model="netParams.popParams"
            items={[
              {
                value: 'zRange',
                label: 'Absolute',
              },
              {
                value: 'znormRange',
                label: 'Normalized',
              },
            ]}
          /> */}
        </Box>
      );
    } else {
      var content = <div>{this.state.cellModelFields}</div>;
    }

    return (
      <div className="layoutVerticalFitInner">
        <BottomNavigation showLabels value={this.state.selectedIndex}>
          {this.getModelParameters()}
        </BottomNavigation>
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNEPopulation);
