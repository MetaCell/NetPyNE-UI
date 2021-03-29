import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { addExperiment, editExperiment, getParameters } from 'root/api/experiments';

/**
 * Edit/Add view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const EditExperiment = () => {
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);
  console.log(experimentDetail);

  const create = (experiment) => {
    // When user creates a new Experiment
    addExperiment({ name: 'New Experiment' })
      .then((result) => {
        console.log(result);
      });
  };

  const update = (experiment) => {
    // When user edits existing Experiment
    editExperiment('EI Populations', { name: 'New Experiment' })
      .then((result) => {
        console.log(result);
      });
  };

  const viewParameters = () => {
    getParameters.then((parameters) => {
      // netParams JSON dict
      console.log(parameters);
    });
  };

  return (
    <div>
      <div>{experimentDetail.name}</div>
      <Button onClick={viewParameters}>JSON View</Button>
      <Button onClick={create}>Create</Button>
      <Button onClick={update}>Update</Button>
    </div>
  );
};

export default EditExperiment;
