import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  NetPyNESelectField,
  MenuItem
} from 'netpyne/components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Utils from '../../Utils' 

const RxdSpecie = (props) => {
  const [tempSpecieId, setTempSpecieId] = useState("");
  const [specieId, setSpecieId] = useState(props.id);
  const base_tag = `netParams.rxdParams[\'species\'][\'${specieId}\']`;

  React.useEffect(() => {
    setSpecieId(props.id);
  }, [props.id]);

  const postProcessMenuItems = (pythonData, selected) => {
    if (pythonData !== undefined) {
      return pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
  }

  return(
      <div className="scrollbar scrollchild">
      { !specieId && <>
        <TextField
            variant="filled"
            fullWidth
            label="Specie name"
            disabled={!!specieId}
            value={specieId}
            onChange={(event) => { 
              setTempSpecieId(event.target.value)
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Utils.execPythonMessage(
                `netpyne_geppetto.netParams.rxdParams[\'species\'][\'${
                  tempSpecieId
                }\'] = {}`);
                setSpecieId(tempSpecieId);
                props.onAddSpecie(tempSpecieId);
            }}
          >
            CREATE
        </Button>
        </> 
        }
        { specieId && <> 
        <NetPyNEField id="netParams.rxdParams.regions">
          <NetPyNESelectField
            fullWidth
            model={`${base_tag}['regions']`}
            method="netpyne_geppetto.getAvailableRxdRegions"
            postProcessItems={postProcessMenuItems}
          />
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
        </>   
      }
    </div>
  )
}
export default RxdSpecie;
