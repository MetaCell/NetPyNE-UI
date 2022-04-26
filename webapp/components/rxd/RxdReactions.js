import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'reactions\']';
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.reactions.reactant">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.reactions.product">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['ylo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.reactions.rate_f">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['zlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.reactions.rate_b">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.reactions.regions">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['yhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.custom_dynamics">
          <Checkbox
            fullWidth
            noBackground
            checked={custom_dynamics}
            model={`${base_tag}['custom_dynamics']`}
            onChange={(event) => set_custom_dynamics(event.target.checked)}
          />
        </NetPyNEField> 
      </div>
    </GridLayout>
  )
}
export default Rxdreactions;
