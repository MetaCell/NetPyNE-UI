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

const RxdRate = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['rates']['${props.id}']`;

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
          <RxdNoData message="There are no Rates yet." callbackText="Add new rate" callback={props.addSingleRate} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.rates.rate">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['rate']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.rates.species">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['species']`}
                method="netpyne_geppetto.getAvailableRxdSpecies"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.rates.regions">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['regions']`}
                method="netpyne_geppetto.getAvailableRxdRegions"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.rates.membrane_flux" className="netpyneCheckbox">
              <NetPyNECheckbox model={`${baseTag}['membrane_flux']`} />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdRate;
