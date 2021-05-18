import React, { useEffect, useState } from 'react';
import { getExperiment, getJsonModel } from 'root/api/experiments';
import Button from '@material-ui/core/Button';

const ExperimentDetail = ({ name }) => {
  const [modelTree, setModelTree] = useState({});
  const [experiment, setExperiment] = useState(null);

  useEffect(() => {
    getExperiment(name)
      .then((exp) => {
        console.log(exp);
        setExperiment(exp);
      })
      .catch((error) => console.error(error));
  }, [name]);

  const filter = (payload) => {
    // TODO: filter by value of a specific parameter and combine filters
    //  enable pagination or load more to browse through all results
    //  of currently filtered parameter set
  };

  const viewJson = () => {
    getJsonModel({})
      .then((response) => {
        // TODO: open JSON Viewer with response
        setModelTree(response);
      });
  };

  const exploreTrial = (payload) => {
    // TODO: open Model > Explore view
    console.log(payload);
  };

  const useTrialAsModel = (payload) => {
    // TODO: open dialog explaining action, what should happen here in the UI?
  };

  return (
    <div>
      <div>{experiment ? experiment.name : ''}</div>
      <Button onClick={viewJson}>View JSON</Button>
    </div>
  );
};

export default ExperimentDetail;
