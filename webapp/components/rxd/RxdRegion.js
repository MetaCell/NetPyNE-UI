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

const RxdRegion = (props) => {
  const classes = useStyles();
  const base_tag = `netParams.rxdParams['regions']['${props.id}']`;

  const postProcessPops = (pythonData) => {
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

  const postProcessSecs = (pythonData) => {
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

  const postProcessDimensions = () => {
    const dimensions = [1, 3];
    const results = dimensions.map((name) => (
      <MenuItem id={`${name}MenuItem`} key={name} value={name}>
        {`${name}D`}
      </MenuItem>
    ));
    return results;
  };

  return (
    <>
      { !props.id && (
        <>
          <RxdNoData message="There are no Regions yet." callbackText="Add new region" callback={props.addSingleRegion} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.regions.cells">
              <NetPyNESelectField
                multiple={1}
                model={`${base_tag}['cells']`}
                method="netpyne_geppetto.getAvailableCellTypes"
                postProcessItems={postProcessPops}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.secs">
              <NetPyNESelectField
                multiple={1}
                model={`${base_tag}['secs']`}
                method="netpyne_geppetto.getAvailableRxDSections"
                pythonParams={[props.id]}
                postProcessItems={postProcessSecs}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.nrn_region">
              <SelectField variant="filled" model={`${base_tag}['nrn_region']`} />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.geometry">
              <SelectField variant="filled" model={`${base_tag}['geometry']`} />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dimension">
              <NetPyNESelectField
                model={`${base_tag}['dimension']`}
                postProcessItems={postProcessDimensions}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.volume_fraction">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['volume_fraction']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.tortuosity">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['tortuosity']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dx">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['dx']`}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.regions.xlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['xlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.ylo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['ylo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['zlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.xhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['xhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.yhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['yhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${base_tag}['zhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.extracellular" className="netpyneCheckbox">
              <NetPyNECheckbox model={`${base_tag}['extracellular']`} />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdRegion;
