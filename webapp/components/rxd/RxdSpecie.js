import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField';
import Utils from '../../Utils' 

const RxdSpecie = (props) => {
  const [specieId, setSpecieId] = useState(props.id);
  const base_tag = `netParams.rxdParams[\'regions\'][\'${specieId}\']`;


  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
      { !specieId && <>
        <TextField
            variant="filled"
            fullWidth
            label="Specie name"
            disabled={!!specieId}
            value={specieId}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Utils.execPythonMessage(
                `netpyne_geppetto.netParams.rxdParams[\'species\'][\'${
                  specieId
                }\'] = {}`);
                setSpecieId(specieId);
                props.onAddSpecie(specieId);
            }}
          >
            CREATE
        </Button>
        </> 
        }
        { specieId && <> 
        <NetPyNEField id="netParams.rxdParams.regions">
          <SelectField variant="filled" model={`${base_tag}['regions']`} mulitple={true} ></SelectField>
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.d">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['d']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.charge">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['charge']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.initial">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['initial']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.esc_boundary_conditions">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['esc_boundary_conditions']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.atolscale">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['atolscale']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.name">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['name']`}
          />
        </NetPyNEField>        
    </>}
    </div>
    </GridLayout>
  )
}
export default RxdSpecie;
