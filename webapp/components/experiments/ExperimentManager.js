import React, { useState } from 'react';
import { Experiments } from '../index';
import EditExperiment from './ExperimentEdit';

const ExperimentManager = () => {
  const [list, setList] = useState(true);
  const [editState, setEditState] = useState(false);
  const [experimentName, setExperimentName] = useState(null);
  return (
    list ? (
      <Experiments
        setList={setList}
        setEditState={setEditState}
        setExperimentName={setExperimentName}
      />
    )
      : <EditExperiment setList={setList} editState={editState} name={experimentName} />
  );
};

export default ExperimentManager;
