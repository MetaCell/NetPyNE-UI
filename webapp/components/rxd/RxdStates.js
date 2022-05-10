import React, {useState} from 'react';
import {
  NetPyNEField,
  NetPyNETextField,
  NetPyNESelectField,
  GridLayout
} from 'netpyne/components';
import MenuItem from '@material-ui/core/MenuItem';

const Rxdreactions = () => {
  const base_tag = 'netParams.rxdParams[\'states\']';
  const postProcessMenuItems = (pythonData, selected) => {
    if (pythonData !== undefined) {
      return pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
  }
  return(
    <GridLayout className="gridLayout">
      <div />
      <div className="scrollbar scrollchild">
      <NetPyNEField id="netParams.rxdParams.regions">
          <NetPyNESelectField
            fullWidth
            model={`${base_tag}['regions']`}
            method="netpyne_geppetto.getAvailableRxdRegions"
            postProcessItems={postProcessMenuItems}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.initial">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['initial']`}
          />
        </NetPyNEField>
        <NetPyNEField id="netParams.rxdParams.species.name">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model={`${base_tag}['name']`}
          />
        </NetPyNEField>          
      </div>
    </GridLayout>
  )
}
export default Rxdreactions;
