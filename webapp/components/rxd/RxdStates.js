import React from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  GridLayout,
} from 'netpyne/components';

const RxdStates = () => (
  <GridLayout className="gridLayout">
    <div />
    <div className="scrollbar scrollchild">
      <NetPyNEField id="simConfig.simLabel">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="simConfig.simLabel"
        />
      </NetPyNEField>

      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>
    </div>
    <div className="scrollbar scrollchild">
      <NetPyNEField id="simConfig.simLabel">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="simConfig.simLabel"
        />
      </NetPyNEField>
    </div>
  </GridLayout>
);
export default RxdStates;
