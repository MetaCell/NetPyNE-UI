import React, { useState } from 'react';
import { Experiments, ExperimentEdit } from '../index';

import ViewExperiment from './ExperimentView';
import JsonViewer from '../general/JsonViewer';
import { EXPERIMENT_VIEWS } from '../../constants';

const ExperimentManager = () => {
  const [editState, setEditState] = useState(false);
  const [experimentName, setExperimentName] = useState(null);
  const [trial, setTrial] = useState(null);
  const [trialJSON, setTrialJSON] = useState(null);
  const [view, setView] = useState(EXPERIMENT_VIEWS.list);

  const viewHandler = () => {
    switch (view) {
      case EXPERIMENT_VIEWS.list: return (
        <Experiments
          setEditState={setEditState}
          setExperimentName={setExperimentName}
          setView={setView}
        />
      );
      case EXPERIMENT_VIEWS.viewExperiment: return (
        <ViewExperiment
          name={experimentName}
          setTrial={setTrial}
          setTrialJSON={setTrialJSON}
          setView={setView}
        />
      );
      case EXPERIMENT_VIEWS.jsonViewer: return (
        <JsonViewer
          baseTitle={experimentName}
          json={trialJSON}
          title={trial}
          setView={setView}
        />
      );
      case EXPERIMENT_VIEWS.edit: return (
        <ExperimentEdit
          editState={editState}
          name={experimentName}
          setView={setView}
        />
      );

      default: return (
        <Experiments
          setEditState={setEditState}
          setExperimentName={setExperimentName}
          setView={setView}
        />
      );
    }
  };
  return (
    <>{ viewHandler() }</>
  );
};

export default ExperimentManager;
