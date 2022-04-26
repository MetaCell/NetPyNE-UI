import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const RxdRegion = () => {
  const base_tag = 'netParams.rxdParams[\'regions\']';
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  const [region_id, set_region_id] = useState(false);
  return(
      <div className="scrollbar scrollchild">
        <NetPyNEField id={`netParams.rxdParams.regions[${region_id}].extracellular`}>
          <Checkbox
            fullWidth
            noBackground
            checked={custom_dynamics}
            model={`${base_tag}['custom_dynamics']`}
            onChange={(event) => set_custom_dynamics(event.target.checked)}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions.cells">
          <SelectField variant="filled" model="netParams.rxdParams.regions.cells" />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions.secs">
          <SelectField variant="filled" model="netParams.rxdParams.regions.secs" />
        </NetPyNEField> 
        <NetPyNEField id="netParams.rxdParams.regions.nrn_region">
          <SelectField variant="filled" model="netParams.rxdParams.regions.nrn_region" />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions.geometry">
          <SelectField variant="filled" model="netParams.rxdParams.regions.geometry" />
        </NetPyNEField>     
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.dimension">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['dimension']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.dx">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['dx']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.xlo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.ylo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['ylo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.zlo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['zlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.xhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.yhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['yhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.zhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['zhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.volume_fraction">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['volume_fraction']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.tortuosity">
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
