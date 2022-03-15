import React from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  GridLayout,
} from 'netpyne/components';

const RxdReactions = () => (
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

      <NetPyNEField id="simConfig.simLabel">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="simConfig.simLabel"
        />
      </NetPyNEField>

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
  </GridLayout>
);
export default RxdReactions;
