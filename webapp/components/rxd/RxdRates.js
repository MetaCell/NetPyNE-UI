import React, { useState } from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  GridLayout,
  NetPyNESelectField,
  NetPyNECheckbox,
} from 'netpyne/components';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'rates\']';
  const postProcessMenuItems = (pythonData, selected) => {
    if (pythonData !== undefined) {
      return pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
  };
  return (
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.rxdParams.species">
          <NetPyNESelectField
            fullWidth
            model={`${base_tag}['species']`}
            method="netpyne_geppetto.getAvailableSpecies"
            postProcessItems={postProcessMenuItems}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.parameters.rate">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['rate']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.regions">
          <NetPyNESelectField
            fullWidth
            model={`${base_tag}['regions']`}
            method="netpyne_geppetto.getAvailableRxdRegions"
            postProcessItems={postProcessMenuItems}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.multicompartmentReactions.membrane_flux" className="netpyneCheckbox">
          <NetPyNECheckbox model={`${base_tag}['membrane_flux']`} />
        </NetPyNEField>
      </div>
    </GridLayout>
  );
};
export default Rxdreactions;
