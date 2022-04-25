import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const RxdMulticompartmentReactions = () => {
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  const [membrane_flux, set_membrane_flux] = useState(false);
  const base_tag = 'netParams.rxdParams[\'multicompartmentReactions\']';
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.reactant">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['reactant']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.product">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['product']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.rate_f">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate_f']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.rate_b">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate_f']`}
          />
        </NetPyNEField> 
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.regions">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate_f']`}
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
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.membrane">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate_f']`}
          />
        </NetPyNEField> 
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.membrane_flux">
          <Checkbox
            fullWidth
            noBackground
            checked={membrane_flux}
            model={`${base_tag}['membrane_flux']`}
            onChange={(event) => set_membrane_flux(event.target.checked)}
          />
        </NetPyNEField> 
      </div>
    </GridLayout>
  )
}
export default RxdMulticompartmentReactions;
