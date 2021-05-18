import React, { useState } from 'react';
import { Experiments } from '../index';
import EditExperiment from './ExperimentEdit';

const ExperimentManager = () => {
  const [list, setList] = useState(true);
  return (
    list ? <Experiments setList={setList} /> : <EditExperiment setList={setList} />
  );
};

export default ExperimentManager;
