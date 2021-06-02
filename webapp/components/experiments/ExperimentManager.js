import React, { useState } from 'react';
import { Experiments } from '../index';
import EditExperiment from './ExperimentEdit';
import ViewExperiment from './ExperimentView';
import JsonViewer from './JsonViewer';

const ExperimentManager = () => {
  const [list, setList] = useState(true);
  const [editState, setEditState] = useState(false);
  const [viewExperiment, setViewExperiment] = useState(false);
  const [jsonViewer, setJsonViewer] = useState(false);
  const [experimentName, setExperimentName] = useState(null);
  const [trial, setTrial] = useState(null);

  return (
    // eslint-disable-next-line no-nested-ternary
    list ? (
      <Experiments
        setList={setList}
        setEditState={setEditState}
        setExperimentName={setExperimentName}
        setViewExperiment={setViewExperiment}
      />
    )// eslint-disable-next-line no-nested-ternary
      : viewExperiment ? (
        <ViewExperiment
          setList={setList}
          name={experimentName}
          setTrial={setTrial}
          setJsonViewer={setJsonViewer}
          setViewExperiment={setViewExperiment}
        />
      ) : jsonViewer ? (
        <JsonViewer
          setList={setList}
          name={experimentName}
          trial={trial}
          setJsonViewer={setJsonViewer}
          setViewExperiment={setViewExperiment}
        />
      ) : (
        <EditExperiment setList={setList} editState={editState} name={experimentName} />
      )
  );
};

export default ExperimentManager;
