import React, { useState } from 'react';
import { Experiments } from '../index';
import EditExperiment from './ExperimentEdit';
import ViewExperiment from './ExperimentView';

const ExperimentManager = () => {
  const [list, setList] = useState(true);
  const [editState, setEditState] = useState(false);
  const [viewExperiment, setViewExperiment] = useState(false);
  const [experimentName, setExperimentName] = useState(null);
  return (
    // eslint-disable-next-line no-nested-ternary
    list ? (
      <Experiments
        setList={setList}
        setEditState={setEditState}
        setExperimentName={setExperimentName}
        setViewExperiment={setViewExperiment}
      />
    )
      : viewExperiment ? (
        <ViewExperiment setList={setList} name={experimentName} />
      ) : (
        <EditExperiment setList={setList} editState={editState} name={experimentName} />
      )
  );
};

export default ExperimentManager;
