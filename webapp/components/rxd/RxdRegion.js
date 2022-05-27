import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  NetPyNECheckbox,
  NetPyNESelectField,
} from 'netpyne/components';
import MenuItem from '@material-ui/core/MenuItem';
import RxdNoData from './RxdNoData';
import Utils from '../../Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdRegion = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['regions']['${props.id}']`;
  const extracellularTag = "netParams.rxdParams['extracellular']";

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

  const activateExtracellular = () => {
    if (props.extracellular) {
      // Utils.execPythonMessage(
      //   "del netpyne_geppetto.netParams.rxdParams['regions']['extracellular']",
      // );
    } else {
      // Utils.execPythonMessage(
      //   "netpyne_geppetto.netParams.rxdParams['regions']['extracellular'] = {}",
      // );
    }
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
                model={`${baseTag}['cells']`}
                method="netpyne_geppetto.getAvailableCellTypes"
                postProcessItems={postProcessPops}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.secs">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['secs']`}
                method="netpyne_geppetto.getAvailableRxDSections"
                pythonParams={[props.id]}
                postProcessItems={postProcessSecs}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.nrn_region">
              <SelectField variant="filled" model={`${baseTag}['nrn_region']`} />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dimension">
              <NetPyNESelectField
                model={`${baseTag}['dimension']`}
                postProcessItems={postProcessDimensions}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dx">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['dx']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.geometry">
              <SelectField variant="filled" model={`${baseTag}['geometry']`} />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.regions.extracellular" className="netpyneCheckbox">
              <NetPyNECheckbox
                model={`${extracellularTag}['extracellular']`}
                onChange={activateExtracellular}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.xlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['xlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.ylo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['ylo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['zlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.xhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['xhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.yhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['yhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['zhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.volume_fraction">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['volume_fraction']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.tortuosity">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['tortuosity']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdRegion;
