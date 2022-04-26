import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'species\']';
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.species.regions">
          <SelectField variant="filled" model="netParams.rxdParams.species.regions" />
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
      </div>
    </GridLayout>
  )
}
export default Rxdreactions;
