import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Tooltip } from 'netpyne/components';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Utils from '../../Utils';
import { REAL_TYPE } from '../../constants';

export default class NetPyNEField extends Component {
  constructor (props) {
    super(props);
    this.state = { open: false };
  }

  setErrorMessage (value) {
    return new Promise((resolve, reject) => {
      if (this.realType === REAL_TYPE.FUNC) {
        if (value !== '' && value !== undefined) {
          Utils.evalPythonMessage('netpyne_geppetto.validateFunction', [
            value,
          ]).then((response) => {
            if (!response) {
              resolve({ errorMsg: 'Not a valid function' });
            } else {
              resolve({ errorMsg: '' });
            }
          });
        } else {
          resolve({ errorMsg: '' });
        }
      } else if (this.realType === REAL_TYPE.FLOAT) {
        if (isNaN(value)) {
          resolve({ errorMsg: 'Only float allowed' });
        } else {
          resolve({ errorMsg: '' });
        }
      }
    });
  }

  prePythonSyncProcessing (value) {
    if (value === '') {
      if (this.default !== undefined) {
        return this.default;
      } if (
        !this.model.split('.')[0].startsWith('simConfig')
        || this.model.split('.')[1].startsWith('analysis')
      ) {
        Utils.execPythonMessage(`
        try:
          del netpyne_geppetto.${this.model}
        except KeyError:
          ...`);
      }
    }
    return value;
  }

  handleTooltip (action) {
    this.setState({ open: action });
  }

  render () {
    const { id, children } = this.props;

    const help = Utils.getMetadataField(id, 'help');
    const childWithProp = React.Children.map(children, (child) => {
      const extraProps = {};
      let name = child.type.name ? child.type.name : child.type.muiName;
      if (name === undefined) {
        if (child.type.options) {
          name = child.type.options.name;
        }
      }
      if (
        [
          'Select',
          'TextField',
          'MuiFormControl',
          'Checkbox',
          'MuiTextField',
          'PythonControlledControlWithPythonDataFetch',
        ].indexOf(name) === -1
      ) {
        extraProps.validate = this.setErrorMessage;
        extraProps.prePythonSyncProcessing = this.prePythonSyncProcessing;

        const dataSource = Utils.getMetadataField(id, 'suggestions');
        if (dataSource !== '') {
          extraProps.dataSource = dataSource;
        }
      }

      const floatingLabelText = Utils.getMetadataField(id, 'label');
      extraProps.label = floatingLabelText;

      const type = Utils.getHTMLType(id);
      if (type !== '') {
        extraProps.type = type;
      }

      let realType;
      if (name === 'PythonControlledControl') {
        realType = Utils.getMetadataField(id, 'type');
        extraProps.realType = realType;
      }

      let defaultValue = Utils.getMetadataField(id, 'default');
      if (defaultValue) {
        if (realType === REAL_TYPE.DICT || realType === REAL_TYPE.DICT_DICT) {
          defaultValue = JSON.parse(defaultValue);
        }
        extraProps.default = defaultValue;
      }

      const options = Utils.getMetadataField(id, 'options');
      if (options) {
        extraProps.children = options.map((name) => (
          <MenuItem id={name} key={name} value={name}>
            {name}
          </MenuItem>
        ));
      }

      return React.cloneElement(child, extraProps);
    });

    return (
      <Grid container alignItems="center">
        <Grid item>
          {(help !== undefined && help !== '')
            ? (
              <Tooltip
                title={help}
                placement="top-end"
                enterDelay={2000}
                enterTouchDelay={2000}
                enterNextDelay={2000}
                leaveTouchDelay={0}
                disableTouchListener
                disableFocusListener
                open={this.state.open}
              >
                <Box
                  mb={1}
                  width="100%"
                  onMouseEnter={() => { this.handleTooltip(true); }}
                  onMouseLeave={() => { this.handleTooltip(false); }}
                  onClick={() => { this.handleTooltip(false); }}
                >
                  {childWithProp}
                </Box>
              </Tooltip>
            )
            : (
              <Box mb={1} width="100%">
                {childWithProp}
              </Box>
            )}
        </Grid>
      </Grid>
    );
  }
}
