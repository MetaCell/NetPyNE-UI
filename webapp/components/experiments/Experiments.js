import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

/**
 * Lists all Experiments.
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Experiments = (props) => {
  const {
    experiments,
    getExperiments,
    editExperiment,
  } = props;

  useEffect(() => {
    getExperiments();
  }, []);

  const cleanExperiment = (payload) => {
    props.cleanExperiment(payload);
  };

  const deleteExperiment = (name) => {
    props.deleteExperiment(name);
  };

  const viewExperiment = (payload) => {
    props.viewExperiment(payload);
  };

  return (
    <div>
      <TextField />
      <Button onClick={editExperiment} />
      <Button onClick={cleanExperiment} />
      <Button onClick={deleteExperiment} />
      <Button onClick={viewExperiment} />
      {
        experiments.map((experiment) => <div>{experiment.name}</div>)
      }
    </div>
  );
};

export default Experiments;
