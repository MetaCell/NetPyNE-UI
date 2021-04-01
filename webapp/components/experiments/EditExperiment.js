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

  // Example payload for new experiment
  const newExperiment = {
    name: 'New Experiment',
    params: [{
      mapsTo: 'netParams.connParams.weight',
      type: 'list',
      values: [1, 2, 3, 4, 5],
      inGroup: true,
    }, {
      mapsTo: 'netParams.connParams.probability',
      type: 'range',
      min: 0.0,
      max: 1.0,
      step: 0.3,
      inGroup: false,
    },
    ],
  };

  const create = () => {
    // When user creates a new Experiment
    addExperiment(newExperiment)
      .then((result) => {
        console.log(result);
      });
  };

  const update = () => {
    // When user edits existing Experiment
    // TODO: use name of current Experiment
    editExperiment('EI Populations', { name: 'New Experiment' })
      .then((result) => {
        console.log(result);
      });
  };

  const viewParameters = () => {
    getParameters().then((parameters) => {
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
