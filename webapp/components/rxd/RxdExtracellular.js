import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  SelectField
} from 'netpyne/components';
import Checkbox from '../general/Checkbox';

const RxdExtracellular = () => {
  const [custom_dynamics, set_custom_dynamics] = useState(false);
  const [membrane_flux, set_membrane_flux] = useState(false);
  const base_tag = 'netParams.rxdParams[\'extracellular\']';
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.extracellular.xlo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.ylo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['ylo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.zlo">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['zlo']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.xhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['xhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.yhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['yhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.zhi">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['zhi']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.dx">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['dx']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.volume_fraction">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['volume_fraction']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.extracellular.tortuosity">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['tortuosity']`}
          />
        </NetPyNEField>
      </div>
    </GridLayout>
  )
}
export default RxdExtracellular;
