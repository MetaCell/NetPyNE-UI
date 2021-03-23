import React from 'react';
import TextField from '@material-ui/core/TextField';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FontIcon from '@material-ui/core/Icon';
import Utils from '../../../Utils';
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

const styles = ({ spacing }) => ({
  fields: {
    marginTop: spacing(3),
    width: '100%',
  },
});

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

  getModelParameters = () => {
    const select = (index, sectionId) =>
      this.setState({
        selectedIndex: index,
        sectionId: sectionId
      });

    const modelParameters = [];
    modelParameters.push(
      <BottomNavigationAction
        id={'generalPopTab'}
        key={'General'}
        label={'General'}
        icon={<FontIcon className={'fa fa-bars'}/>}
        onClick={() => select(0, 'General')}
      />
    );
    modelParameters.push(
      <BottomNavigationAction
        id={'spatialDistPopTab'}
        key={'SpatialDistribution'}
        label={'Spatial Distribution'}
        icon={<FontIcon className={'fa fa-cube'}/>}
        onClick={() => select(1, 'SpatialDistribution')}
      />
    );
    if (
      typeof this.state.cellModelFields != 'undefined'
      && this.state.cellModelFields !== ''
    ) {
      modelParameters.push(
        <BottomNavigationAction
          key={this.state.cellModel}
          label={this.state.cellModel + ' Model'}
          icon={<FontIcon className={'fa fa-balance-scale'}/>}
          onClick={() => select(2, this.state.cellModel)}
        />
      );
    }
    modelParameters.push(
      <BottomNavigationAction
        key={'CellList'}
        label={'Cell List'}
        icon={<FontIcon className={'fa fa-list'}/>}
        onClick={() => select(3, 'CellList')}
      />
    );

    return modelParameters;
  };

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.state.model === undefined
      || this.state.currentName !== nextState.currentName
      || this.state.cellModelFields !== nextState.cellModelFields
      || this.state.sectionId !== nextState.sectionId
      || this.state.selectedIndex !== nextState.selectedIndex
    );
  }

  handleRenameChange = event => {
    const storedValue = this.props.name;
    const newValue = Utils.nameValidation(event.target.value);
    const updateCondition = this.props.renameHandler(newValue);
    const triggerCondition = Utils.handleUpdate(
      updateCondition,
      newValue,
      event.target.value,
      this,
      'Population'
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
          }
        );
        this.renaming = true;
      });
    }
  };

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer !== undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  postProcessMenuItems (pythonData, selected) {
    return pythonData.map(name => (
      <MenuItem
        id={name + 'MenuItem'}
        key={name}
        checked={selected.indexOf(name) > -1}
        value={name}
      >
        {name}
      </MenuItem>
    ));
  }

  render () {
    let content;
    const { classes } = this.props;

    const dialogPop
      = this.state.errorMessage !== undefined ? (
      <Dialog open={true} style={{ whiteSpace: 'pre-wrap' }}>
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
            onClick={() =>
              this.setState({
                errorMessage: undefined,
                errorDetails: undefined,
              })
            }
          >
            BACK
          </Button>
        </DialogActions>
      </Dialog>
    ) : undefined;
    if (this.state.sectionId === 'General') {
      content = (
        <Box className={`scrollbar scrollchild`} mt={1}>
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
                method={'netpyne_geppetto.getAvailableCellTypes'}
                model={
                  'netParams.popParams[\'' + this.props.name + '\'][\'cellType\']'
                }
                postProcessItems={this.postProcessMenuItems}
              />
            </NetPyNEField>
          </div>
          <Dimensions modelName={this.props.name}/>
          {dialogPop}
        </Box>
      );
    } else if (this.state.sectionId === 'SpatialDistribution') {
      content = (
        <Box className={`scrollbar scrollchild`} mt={1}>
          <NetPyNECoordsRange
            id={'xRangePopParams'}
            name={this.props.name}
            model={'netParams.popParams'}
            items={[
              {
                value: 'xRange',
                label: 'Absolute'
              },
              {
                value: 'xnormRange',
                label: 'Normalized'
              },
            ]}
          />

          <NetPyNECoordsRange
            id="yRangePopParams"
            name={this.props.name}
            model={'netParams.popParams'}
            items={[
              {
                value: 'yRange',
                label: 'Absolute'
              },
              {
                value: 'ynormRange',
                label: 'Normalized'
              },
            ]}
          />

          <NetPyNECoordsRange
            id="zRangePopParams"
            name={this.props.name}
            model={'netParams.popParams'}
            items={[
              {
                value: 'zRange',
                label: 'Absolute'
              },
              {
                value: 'znormRange',
                label: 'Normalized'
              },
            ]}
          />
        </Box>
      );
    } else if (this.state.sectionId === 'CellList') {
      content = (
        <div>Option to provide individual list of cells. Coming soon ...</div>
      );
    } else {
      content = <div>{this.state.cellModelFields}</div>;
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
