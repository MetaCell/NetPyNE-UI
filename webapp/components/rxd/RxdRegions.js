import React from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout,
} from 'netpyne/components';

const RxdRegions = () => (
  <GridLayout className="gridLayout">
    <div />
    <div className="scrollbar scrollchild">
      <NetPyNEField id="simConfig.duration">
        <NetPyNETextField
          fullWidth
          variant="filled"
          model="simConfig.duration"
        />
      </NetPyNEField>

      <NetPyNEField id="simConfig.hParams" className="listStyle">
        <ListComponent model="simConfig.hParams" />
      </NetPyNEField>
    </div>

    <div className="scrollbar scrollchild">
      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>

      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>

      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>

      <NetPyNEField id="netParams.shape">
        <SelectField variant="filled" model="netParams.shape" />
      </NetPyNEField>
    </div>
  </GridLayout>
);
export default RxdRegions;
