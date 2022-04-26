import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'rates\']';
  const [membrane_flux, set_membrane_flux] = useState(false);
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.parameters.species">
          <SelectField variant="filled" model="netParams.rxdParams.parameters.species" />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.parameters.rate">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.rates.regions">
          <SelectField variant="filled" model="netParams.rxdParams.rates.regions" />
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
export default Rxdreactions;
