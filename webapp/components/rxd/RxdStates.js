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
        <NetPyNEField id="netParams.rxdParams.species.initial">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['initial']`}
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
