import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Edit view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const EditExperiment = () => {
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);

  console.log(experimentDetail);

  const save = () => {
    console.log('Save experiment');
  };

  return (
    <div>{experimentDetail.name}</div>
  );
};

export default EditExperiment;
