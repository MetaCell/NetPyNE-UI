import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  NetPyNECheckbox,
  NetPyNESelectField,
} from 'netpyne/components';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Utils from '../../Utils';
import RxdNoData from './RxdNoData';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdConstant = (props) => {
  const classes = useStyles();
  const baseTag = "netParams.rxdParams['constants']";

  return (
    <>
      { props.constants.map((constant) => (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <TextField
              fullWidth
              disabled={1}
              label="parameter"
              variant="filled"
              defaultValue={`${baseTag}[${constant}]`}
            />
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNETextField
              fullWidth
              label="value"
              variant="filled"
              model={`${baseTag}[${constant}]`}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default RxdConstant;
