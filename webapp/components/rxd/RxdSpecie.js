import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  NetPyNESelectField,
} from 'netpyne/components';
import MenuItem from '@material-ui/core/MenuItem';
import RxdNoData from './RxdNoData';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdSpecie = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['species']['${props.id}']`;

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
          <RxdNoData message="There are no Species yet." callbackText="Add new region" callback={props.addSingleSpecie} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.species.regions">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['regions']`}
                method="netpyne_geppetto.getAvailableRxdRegions"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.species.d">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['d']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.species.charge">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['charge']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.species.initial">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['initial']`}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.species.esc_boundary_conditions">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['esc_boundary_conditions']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.species.atolscale">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['atolscale']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.species.name">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['name']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdSpecie;
