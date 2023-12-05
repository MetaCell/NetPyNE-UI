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
    this.state = { rangeType: undefined, rangeValue: [undefined, undefined]  };

    this._isMounted = false;
  }

  componentDidMount () {
    this._isMounted = true;
    this.updateLayout();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.name != prevProps.name) {
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
    const evalMessage = `[key in ${message} for key in ['${items[0].value}', '${items[1].value}']]` ;

    Utils
    .evalPythonMessage(evalMessage)
    .then((response) => {

      let rangeType = undefined ;

      if (response[0] && this._isMounted === true) {
        rangeType = items[0].value ;
      } else if (response[1] && this._isMounted === true) {
        rangeType = items[1].value ;
      } 

      this.setState({ rangeType });

      if (rangeType)
      {
        const pythonMessage = `netpyne_geppetto.${model}['${name}']['${conds}']['${this.state.rangeType}']` ;
  
        Utils
        .evalPythonMessage(pythonMessage)
        .then((response) => {
          if (response && response.length > 0 ) {
            this.setState({ rangeValue: response });
        }});
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

  handleRangeTypeChange(event) {
    const {
      model,
      conds,
      name,
    } = this.props;

    const rangeType = event.target.value ;

    if (this.state.rangeType && this.state.rangeType.length > 0)
    {
      const pyPath = `netpyne_geppetto.${model}['${name}']['${conds}']`;
      const startLetter = String(this.state.rangeType)[0];
      const pythonMessageDelOpposite = `${pyPath} = {k: v for k, v in ${pyPath}.items() if not k.startswith('${startLetter}')}`;
      Utils.execPythonMessage(
        pythonMessageDelOpposite
      );

      const rangeValue = this.state.rangeValue ;

      if (!rangeValue.some(e => e === undefined))
      {
        const pythonMessage = `netpyne_geppetto.${model}['${name}']['${conds}']['${rangeType}'] = [${rangeValue}]` ;
        Utils.execPythonMessage(
          pythonMessage
        );
      }
    }

    this.setState({ rangeType})
  }

  //preConds: pop, cellType, cellModel, x, y, z, xnorm, ynorm, znorm
  handleCoordParamChange(index, newValue) {
    const {
      model,
      conds,
      name,
    } = this.props;


    if (newValue === '' || (/^\d+$/.test(newValue))) {
      if (this.state.rangeType && this.state.rangeType.length > 0)
      {
        const pyPath = `netpyne_geppetto.${model}['${name}']['${conds}']`;
        const startLetter = String(this.state.rangeType)[0];
        const pythonMessageDelOpposite = `${pyPath} = {k: v for k, v in ${pyPath}.items() if not k.startswith('${startLetter}')}`;
        Utils.execPythonMessage(
          pythonMessageDelOpposite
        );
      }

      const rangeValue = this.state.rangeValue ;
      rangeValue[index] = newValue ;

      if (!rangeValue.some(e => e === undefined))
      {
        const pythonMessage = `netpyne_geppetto.${model}['${name}']['${conds}']['${this.state.rangeType}'] = [${rangeValue}]` ;
        Utils.execPythonMessage(
          pythonMessage
        );
      }

      this.setState({ rangeValue })
    }
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

    const minVal = this.state.rangeValue[0];
    const maxVal = this.state.rangeValue[1];

    return (
      <div>
        <NetPyNEField id={meta}>
          <SelectField
            id={`${this.props.id}Select`}
            label="Range type"
            value={this.state.rangeType || ''}
            onChange={(event) => { this.handleRangeTypeChange(event); }}
          >
            {this.createMenuItems()}
          </SelectField>
        </NetPyNEField>
        {(this.state.rangeType != undefined)
          ? (
            <Box width="100%" p={1}>
                <TextField label="Minimum" id={min} variant="filled" value={minVal} fullWidth onChange={ (e) => { this.handleCoordParamChange(0, parseInt(e.target.value)) } } />
                <TextField label="Maximum" id={max} variant="filled" value={maxVal} fullWidth onChange={ (e) => { this.handleCoordParamChange(1, parseInt(e.target.value)) } } />
            </Box>
          )
          : null}
      </div>
    );
  }
}
