import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import {
  NetPyNEField,
  NetPyNETextField,
} from 'netpyne/components';
import Utils from '../../../Utils';

const styles = ({ spacing }) => ({
  selectField: { width: '100%' },
  field: {
    width: '95%!important',
    marginLeft: spacing(3),
  },
});

/**
 * Population Dimensions Component
 */
class DimensionsComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modelName: props.modelName,
      dimension: 'numCells',
    };
    this.popDimensionsOptions = [
      {
        label: 'Number of cells',
        value: 'numCells',
      },
      {
        label: 'Density',
        value: 'density',
      },
      {
        label: 'Grid spacing',
        value: 'gridSpacing',
      },
      {
        label: 'Population List',
        value: 'populationList',
      },
    ];
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.modelName != prevState.modelName) {
      this.updateLayout();
    }
  }

  componentWillUnmount () {
    this.mounted = false;
  }

  componentDidMount () {
    this.mounted = true;
    this.updateLayout();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.state.modelName != nextProps.modelName) {
      this.setState({
        modelName: nextProps.modelName,
        dimension: 'numCells',
      });
    }
  }

  updateLayout () {
    const requests = this.popDimensionsOptions.map((popDimensionsOption) =>
      // FIXME Better to wrap calls rather than directly accessing objects
      // eslint-disable-next-line implicit-arrow-linebreak
      Utils.evalPythonMessage(`'${popDimensionsOption.value}' in netpyne_geppetto.netParams.popParams['${this.state.modelName}']`));

    // Get population dimension by asking each for each key
    Promise.all(requests)
      .then((values) => {
        const index = values.indexOf(true);
        if (this.mounted) {
          if (index == -1) {
            this.setState({ dimension: 'numCells' });
          } else {
            this.setState({ dimension: this.popDimensionsOptions[index].value });
          }
        }
      });
  }

  handleDimValueChange (event) {
    let newValue = (event.target.type == 'number') ? parseFloat(event.target.value) : event.target.value;
    // Update State
    if (Object.is(newValue, NaN)) {
      newValue = 0;
    }
    this.setState({ value: newValue });
    this.triggerUpdate(() => {
      // Set Population Dimension Python Side
      Utils
        .evalPythonMessage('netpyne_geppetto.netParams.popParams.setParam', [this.props.modelName, this.props.dimensionType, newValue])
        .then(() => this.props.callback());
    });
  }

  render () {
    const { classes } = this.props;
    return (
      <div>
        <NetPyNEField id="netParams.popParams.numCells" className={classes.selectField}>
          <FormControl fullWidth>
            <InputLabel>
              <Box mt={1} ml={2}>Dimension type</Box>
            </InputLabel>
            <Select
              fullWidth
              variant="filled"
              value={this.state.dimension}
              onChange={(event) => this.setState({ dimension: event.target.value })}
            >
              {(this.popDimensionsOptions != undefined)
                ? this.popDimensionsOptions.map((popDimensionsOption) => (
                  <MenuItem
                    id={`popParamS${popDimensionsOption.value}`}
                    key={popDimensionsOption.value}
                    value={popDimensionsOption.value}
                  >
                    {popDimensionsOption.label}
                  </MenuItem>
                )) : null}
            </Select>
          </FormControl>

        </NetPyNEField>
        {
          this.state.dimension != undefined && this.state.dimension != ''
          && (
            <Box ml={1}>
              <NetPyNEField
                id={`netParams.popParams.${this.state.dimension}`}
                className={classes.fields}
              >
                <NetPyNETextField
                  fullWidth
                  variant="filled"
                  handleChange={this.handleDimValueChange}
                  model={`netParams.popParams['${this.state.modelName}']['${this.state.dimension}']`}
                  modelName={this.state.modelName}
                  dimensionType={this.state.dimension}
                  callback={(newValue, oldValue) => {
                    this.props.updateCards();
                  }}
                />
              </NetPyNEField>
            </Box>
          )
        }
      </div>
    );
  }
}

export default withStyles(styles)(DimensionsComponent);
