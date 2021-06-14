import React, { useState } from 'react';
import { Experiments } from '../index';
import EditExperiment from './ExperimentEdit';
import ViewExperiment from './ExperimentView';
import JsonViewer from '../general/JsonViewer';

const ExperimentManager = () => {
  const [list, setList] = useState(true);
  const [editState, setEditState] = useState(false);
  const [viewExperiment, setViewExperiment] = useState(false);
  const [jsonViewer, setJsonViewer] = useState(false);
  const [experimentName, setExperimentName] = useState(null);
  const [trial, setTrial] = useState(null);
  const [trialJSON, setTrialJSON] = useState(null);

  if (list) {
    return (
      <Experiments
        setList={setList}
        setEditState={setEditState}
        setExperimentName={setExperimentName}
        setViewExperiment={setViewExperiment}
      />
    );
  }

  if (viewExperiment) {
    return (
      <ViewExperiment
        setList={setList}
        name={experimentName}
        setTrial={setTrial}
        setJsonViewer={setJsonViewer}
        setViewExperiment={setViewExperiment}
        setTrialJSON={setTrialJSON}
      />
    );
  }

  if (jsonViewer) {
    return (
      <JsonViewer
        setList={setList}
        baseTitle={experimentName}
        json={trialJSON}
        title={trial}
        setJsonViewer={setJsonViewer}
        setBaseView={setViewExperiment}
      />
    );
  }

  return (
    <EditExperiment
      setList={setList}
      editState={editState}
      name={experimentName}
    />
  );
};

export default ExperimentManager;
