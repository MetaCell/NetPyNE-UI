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

const RxdParameter = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['parameters']['${props.id}']`;

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
          <RxdNoData message="There are no Parameters yet." callbackText="Add new parameter" callback={props.addSingleParameter} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.parameters.regions">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['regions']`}
                method="netpyne_geppetto.getAvailableRxdRegions"
                postProcessItems={postProcessMenuItems}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.parameters.name">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['name']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.parameters.charge">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['charge']`}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.parameters.value">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['value']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};
export default RxdParameter;
