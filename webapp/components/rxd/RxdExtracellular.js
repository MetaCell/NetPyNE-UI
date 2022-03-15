import React from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout,
} from 'netpyne/components';

const RxdExtracellular = () => (
  <GridLayout className="gridLayout">
    <div />
    <div className="scrollbar scrollchild">
      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>

      <NetPyNEField id="netParams.scale">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.scale"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.defaultWeight">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.defaultWeight"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.defaultDelay">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.defaultDelay"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.scaleConnWeight">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.scaleConnWeight"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.scaleConnWeightNetStims">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.scaleConnWeightNetStims"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.scaleConnWeightNetStims">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.scaleConnWeightNetStims"
        />
      </NetPyNEField>
    </div>
    <div className="scrollbar scrollchild">
      <NetPyNEField
        id="netParams.scaleConnWeightModels"
        className="listStyle"
      >
        <ListComponent model="netParams.scaleConnWeightModels" />
      </NetPyNEField>

      <NetPyNEField id="netParams.sizeX">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.sizeX"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.sizeY">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="netParams.sizeY"
        />
      </NetPyNEField>
    </div>
  </GridLayout>
);
export default RxdExtracellular;
