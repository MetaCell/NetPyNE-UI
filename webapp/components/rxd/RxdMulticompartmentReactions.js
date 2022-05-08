import React, { useState } from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  NetPyNECheckbox,
} from 'netpyne/components';

const RxdMulticompartmentReactions = () => {
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  const [membrane_flux, set_membrane_flux] = useState(false);
  const base_tag = 'netParams.rxdParams[\'multicompartmentReactions\']';
  return (
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
            model={`${base_tag}['rate_b']`}
          />
        </NetPyNEField> 
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.regions">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['regions']`}
          />
        </NetPyNEField> 
        <NetPyNEField
            id="netParams.rxdParams.multicompartmentReactions.custom_dynamics"
            className="netpyneCheckbox"
          >
          <NetPyNECheckbox model={`${base_tag}['custom_dynamics']`} />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.membrane">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['membrane']`}
          />
        </NetPyNEField> 
        <NetPyNEField
            id="netParams.rxdParams.multicompartmentReactions.membrane_flux"
            className="netpyneCheckbox"
          >
          <NetPyNECheckbox model={`${base_tag}['membrane_flux']`} />
        </NetPyNEField>
      </div>
    </GridLayout>
  )
}
export default RxdMulticompartmentReactions;
