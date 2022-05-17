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

const RxdReaction = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['reactions']['${props.id}']`;

  const postProcessMenuItems = (pythonData, selected) => {
    let results = [];
    if (pythonData !== undefined) {
      results = pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
    return results;
  };

  return (
    <>
      { !props.id && (
        <>
          <RxdNoData message="There are no Reactions yet." callbackText="Add new region" callback={props.addSingleReaction} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.reactions.reactant">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['reactant']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.reactions.product">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['product']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.reactions.custom_dynamics">
              <NetPyNECheckbox model={`${baseTag}['custom_dynamics']`} />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.reactions.regions">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['regions']`}
                method="netpyne_geppetto.getAvailableRxdRegions"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.reactions.rate_f">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['rate_f']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.reactions.rate_b">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['rate_b']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdReaction;
