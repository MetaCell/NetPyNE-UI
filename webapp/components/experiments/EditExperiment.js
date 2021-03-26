import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { getParameters } from 'root/api/experiments';

/**
 * Edit/Add view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const EditExperiment = () => {
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);
  console.log(experimentDetail);

  const save = (experiment) => {
    console.log(experiment);
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
      <Button onClick={save}>Save</Button>
    </div>
  );
};

export default EditExperiment;
