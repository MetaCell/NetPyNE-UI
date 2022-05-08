import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField,
} from 'netpyne/components';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'parameters\']';
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.parameters.regions">
          <SelectField variant="filled" model="netParams.rxdParams.parameters.regions" />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.parameters.name">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['name']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.parameters.charge">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['charge']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.parameters.value">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['value']`}
          />
        </NetPyNEField>
      </div>
    </GridLayout>
  )
}
export default Rxdreactions;
