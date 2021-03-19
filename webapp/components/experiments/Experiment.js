import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterTrials } from 'root/redux/actions/experiments';
import Utils from 'root/Utils';
import Button from '@material-ui/core/Button';

// TODO: @lrebscher extract from component
const getModelAsJson = (payload) => Utils.evalPythonMessage('netpyne_geppetto.getModelAsJson', []);

/**
 * Detail view of a single Experiment.
 */
const Experiment = () => {
  const dispatch = useDispatch();
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);

  // Don't need to save modelTree in global state.
  const [modelTree, setModelTree] = useState({});

  const filter = (payload) => {
    dispatch(filterTrials(payload));
  };

  const viewJson = () => {
    getModelAsJson({})
      .then((response) => {
        setModelTree(response);
      });
  };

  const exploreTrial = (payload) => {
    // open Model>Explore view
    console.log(payload);
  };

  console.log(experimentDetail);
  console.log(modelTree);

  return (
    <div>
      <div>{experimentDetail.name}</div>
      <Button onClick={viewJson}>View JSON</Button>
    </div>
  );
};

export default Experiment;
