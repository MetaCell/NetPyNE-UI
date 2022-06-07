import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  NetPyNECheckbox,
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

const RxdMultiReaction = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['multicompartmentReactions']['${props.id}']`;

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
          <RxdNoData message="There are no Multi Compartment Reactions yet." callbackText="Add new region" callback={props.addSingleReaction} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.reactant">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['reactant']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.product">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['product']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.rate_f">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['rate_f']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.rate_b">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['rate_b']`}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.regions">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['regions']`}
                method="netpyne_geppetto.getAvailableRxdRegions"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.membrane">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['membrane']`}
              />
            </NetPyNEField>
            <NetPyNEField
              id="netParams.rxdParams.multicompartmentReactions.custom_dynamics"
              className="netpyneCheckbox"
            >
              <NetPyNECheckbox model={`${baseTag}['custom_dynamics']`} />
            </NetPyNEField>
            <NetPyNEField
              id="netParams.rxdParams.multicompartmentReactions.membrane_flux"
              className="netpyneCheckbox"
            >
              <NetPyNECheckbox model={`${baseTag}['membrane_flux']`} />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdMultiReaction;
