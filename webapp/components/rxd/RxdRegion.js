import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Utils from '../../Utils' 

const handleCreateNewRegion = (name) => {
  Utils.execPythonMessage(
    `netpyne_geppetto.netParams.rxdParams[\'regions\'][\'"${
      name
    }"\'] = {}`);
  set_region_id_created(true);
}

const RxdRegion = () => {
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  const [region_id, set_region_id] = useState("");
  const [region_id_created, set_region_id_created] = useState(false);
  const base_tag = `netParams.rxdParams[\'regions\'][${region_id}]`;
  return(
      <div className="scrollbar scrollchild">
        <NetPyNEField>
          <TextField
            variant="filled"
            fullWidth
            label="Region name"
            value={region_id}
            onChange={(event) => set_region_id(event.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCreateNewRegion(region_id);
            }}
          >
            CREATE
        </Button>
        </NetPyNEField>
        <NetPyNEField id={`netParams.rxdParams.regions[${region_id}].extracellular`}>
          <Checkbox
            fullWidth
            noBackground
            checked={custom_dynamics}
            model={`${base_tag}['extracellular']`}
            onChange={(event) => set_custom_dynamics(event.target.checked)}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions.cells">
          <SelectField variant="filled" model={`${base_tag}['cells']`} />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions.secs">
          <SelectField variant="filled" model={`${base_tag}['secs']`} />
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
      </div>
  )
}
export default RxdRegion;
