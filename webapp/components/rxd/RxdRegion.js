import React, { useState } from 'react';
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

const RxdRegion = (props) => {
  const [tempRegionId, setTempRegionId] = useState('');
  const [regionId, setRegionId] = useState('');
  const base_tag = `netParams.rxdParams['regions']['${regionId}']`;

  React.useEffect(() => {
    setRegionId(props.id);
  }, [props.id]);

  const postProcessMenuItems = (pythonData, selected) => {
    if (pythonData !== undefined) {
      return pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
  };

  return (
    <div className="scrollbar scrollchild">
      { !regionId && (
        <>
          <TextField
            variant="filled"
            fullWidth
            label="Region name"
            disabled={!!regionId}
            value={regionId}
            onChange={(event) => {
              setTempRegionId(event.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Utils.execPythonMessage(
                `netpyne_geppetto.netParams.rxdParams['regions']['${
                  tempRegionId
                }'] = {}`,
              );
              setRegionId(tempRegionId);
              props.onAddRegion(tempRegionId);
            }}
          >
            CREATE
          </Button>
        </>
      )}
      { regionId && (
        <>
          <NetPyNEField id={`netParams.rxdParams.regions[${regionId}].extracellular`} className="netpyneCheckbox">
            <NetPyNECheckbox model={`netParams.rxdParams.regions[${regionId}].extracellular`} />
          </NetPyNEField>
          <NetPyNEField id="netParams.rxdParams.regions.secs">
            <NetPyNESelectField
              model={`${base_tag}['secs']`}
              method="netpyne_geppetto.getAvailableSections"
              postProcessItems={postProcessMenuItems}
            />
          </NetPyNEField>
          <NetPyNEField id="netParams.rxdParams.regions.nrn_region">
            <SelectField variant="filled" model={`${base_tag}['nrn_region']`} />
          </NetPyNEField>
          <NetPyNEField id="netParams.rxdParams.regions.geometry">
            <SelectField variant="filled" model={`${base_tag}['geometry']`} />
          </NetPyNEField>
          <NetPyNEField id="netParams.rxdParams.regions.dimension">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`${base_tag}['dimension']`}
            />
          </NetPyNEField>
          <NetPyNEField id="netParams.rxdParams.regions.dx">
            <NetPyNETextField
              fullWidth
              variant="filled"
              model={`${base_tag}['dx']`}
            />
          </NetPyNEField>
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
        </>
      )}
    </div>
  );
};
export default RxdRegion;
