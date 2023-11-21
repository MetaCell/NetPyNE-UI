import React from 'react';
import TextField from '@material-ui/core/TextField';
import { BottomNavigation, BottomNavigationAction, Grid, Switch, Typography } from '@material-ui/core';
import FontIcon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

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
} from 'netpyne/components';
import Utils from '../../../Utils';
import Checkbox from '../../general/Checkbox';
import { vars } from '../../../theme';
import { BASE_PATH } from '../../general/NetPyNEIcons';

const styles = ({ spacing }) => ({
  fields: {
    marginTop: spacing(3),
    width: '100%',
  },
} );

const { textColor, primaryColor, experimentLabelColor } = vars;

class NetPyNEPopulation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentName: props.name,
      selectedIndex: 0,
      sectionId: 'General',
      errorMessage: undefined,
      errorDetails: undefined,
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      currentName: nextProps.name,
      selectedIndex: 0,
      sectionId: 'General',
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.model == undefined
      || this.state.currentName != nextState.currentName
      || this.state.cellModelFields != nextState.cellModelFields
      || this.state.sectionId != nextState.sectionId
      || this.state.selectedIndex != nextState.selectedIndex
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
        key="CellList"
        label="Cell List"
        icon={<FontIcon className="fa fa-list" />}
        onClick={() => select(3, 'CellList')}
      />,
    );

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

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  postProcessMenuItems (pythonData, selected) {
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
    } else if (this.state.sectionId == 'CellList') {
      var content = (
        <div>Option to provide individual list of cells. Coming soon ...</div>
      );
    } else if (this.state.sectionId == 'Stimulation') {
      var content = (
        <Box className="scrollbar scrollchild" mt={ 1 }>
          <Box mb={ 3.5 } display='flex' style={ { gap: '0.5rem' } }>
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
          </Box>
          <Box display='flex' flexDirection='column' style={ { gap: '0.5rem' } }>
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

            <Box display='flex' alignItems='center' style={{gap: '1rem'}}>
              <Typography style={ {
                  color: experimentLabelColor, paddingLeft: '0.625rem', fontSize: '0.875rem', lineHeight: '130%', fontWeight: 400
                } }
              >
                Spiking Pulse / Rate
              </Typography>
              <Grid container alignItems='center' spacing={1}>
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
              </Grid>
            </Box>


            <Box display='flex' alignItems='center' style={{gap: '1rem'}}>
              <Typography style={ {
                  color: experimentLabelColor, paddingLeft: '0.625rem', fontSize: '0.875rem', lineHeight: '130%', fontWeight: 400, visibility: 'hidden'
                } }
              >
                Spiking Pulse / Rate
              </Typography>
              <Grid container alignItems='center' spacing={1}>
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
              </Grid>
            </Box>

            <Box pl={1.25}>
              <Button
                className='noHover'
                disableRipple
                style={ { color: primaryColor, padding: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.01rem', lineHeight: '200%' } }
                variant='text'
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

            <Box display='flex' alignItems='center' style={ { gap: '1rem' } }>
              <Typography style={ { color: experimentLabelColor, fontSize: '0.875rem', paddingLeft: '0.625rem', lineHeight: '130%', fontWeight: 400 } }>Start</Typography>
              <Grid container alignItems='center' spacing={1}>
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
                <Grid item xs={3}>
                  <TextField
                    variant="filled"
                    fullWidth
                    onChange={this.handleRenameChange}
                    value={this.state.currentName}
                    disabled={this.renaming}
                    label="End"
                  />
                </Grid>
                <Grid item xs={3}>
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
            </Box>



            <TextField
              variant="filled"
              fullWidth
              onChange={this.handleRenameChange}
              value={this.state.currentName}
              disabled={this.renaming}
              label="Frequency (Hz)"
            />
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
