import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { AdapterComponent, NetPyNEField } from 'netpyne/components';
import SelectField from './Select';
import Utils from '../../Utils';

export default class NetPyNECoordsRange extends Component {
  constructor (props) {
    super(props);
    this.state = { rangeType: undefined };

    this._isMounted = false;
  }

  triggerUpdate (updateMethod) {
    // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
    if (this.updateTimer != undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(updateMethod, 1000);
  }

  componentDidMount () {
    this._isMounted = true;
    this.updateLayout();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.name != prevProps.name) {
      this.triggerUpdate(() => {
        const message = `netpyne_geppetto.${this.props.model}['${this.props.name}']${(this.props.conds != undefined) ? `['${this.props.conds}']` : ''}`;
        Utils
          .evalPythonMessage(`[key in ${message} for key in ['${this.props.items[0].value}', '${this.props.items[1].value}']]`)
          .then((response) => {
            if (response[0] && this._isMounted === true) {
              this.setState({ rangeType: this.props.items[0].value });
            } else if (response[1] && this._isMounted === true) {
              this.setState({ rangeType: this.props.items[1].value });
            } else if (this._isMounted === true) {
              this.setState({ rangeType: undefined });
            }
          });
      });
    } else if (this.props.conds != prevProps.conds) {
      this.updateLayout();
    }
  }

  updateLayout () {
    const {
      items,
      model,
      conds,
      name,
    } = this.props;

    const message = `netpyne_geppetto.${model}['${name}']${(conds !== undefined)
      ? `['${conds}']` : ''}`;
    Utils
      .evalPythonMessage(`[key in ${message} for key in ['${items[0].value}', '${items[1].value}']]`)
      .then((response) => {
        if (response[0] && this._isMounted === true) {
          this.setState({ rangeType: items[0].value });
        } else if (response[1] && this._isMounted === true) {
          this.setState({ rangeType: items[1].value });
        } else if (this._isMounted === true) {
          this.setState({ rangeType: undefined });
        }
      });
  }

  createMenuItems = () => this.props.items.map((obj) => (
    <MenuItem
      id={`${this.props.id + obj.label}MenuItem`}
      key={obj.value}
      value={obj.value}
    >
      {obj.label}
    </MenuItem>
  ));

  componentWillUnmount () {
    this._isMounted = false;
  }

  render () {
    if (this.props.conds != undefined) {
      var meta = `${this.props.model}.${this.props.conds}.${this.props.items[0].value}`;
      var path = `${this.props.model}['${this.props.name}']['${this.props.conds}']['${this.state.rangeType}']`;
    } else {
      var meta = `${this.props.model}.${this.props.items[0].value}`;
      var path = `${this.props.model}['${this.props.name}']['${this.state.rangeType}']`;
    }
    const min = `${this.props.id}MinRange`;
    const max = `${this.props.id}MaxRange`;
    return (
      <div>
        <NetPyNEField id={meta}>
          <SelectField
            id={`${this.props.id}Select`}
            label="Range type"
            value={this.state.rangeType || ''}
            onChange={(event) => this.setState({ rangeType: event.target.value })}
          >
            {this.createMenuItems()}
          </SelectField>
        </NetPyNEField>
        {(this.state.rangeType != undefined)
          ? (
            <Box width="100%" p={1}>
              <AdapterComponent
                model={path}
                convertToPython={(state) => {
                  if (!state[state.lastUpdated].toString()
                    .endsWith('.')
                    && ((!isNaN(parseFloat(state[min]))) && (!isNaN(parseFloat(state[max]))))) {
                    return [parseFloat(state[min]), parseFloat(state[max])];
                  }
                }}
                convertFromPython={(prevProps, prevState, value) => {
                  if (value != undefined && prevProps.value != value && value != '') {
                    const output = {};
                    output[min] = value[0];
                    output[max] = value[1];
                    return output;
                  }
                }}
              >
                <TextField label="Minimum" id={min} variant="filled" fullWidth />
                <TextField label="Maximum" id={max} variant="filled" fullWidth />
              </AdapterComponent>
            </Box>
          )
          : null}
      </div>
    );
  }
}
