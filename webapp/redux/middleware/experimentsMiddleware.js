/* eslint-disable no-nested-ternary */
/* eslint-disable lines-between-class-members */
/* eslint-disable consistent-return */
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import {
  UPDATE_CARDS,
  CREATE_NETWORK,
  CREATE_SIMULATE_NETWORK,
  PYTHON_CALL,
  SIMULATE_NETWORK,
  SHOW_NETWORK,
  editModel,
  EDIT_MODEL,
  LOAD_TUTORIAL,
  RESET_MODEL,
  showNetwork,
  addInstancesToCanvas,
} from '../actions/general';
import {
  CLONE_EXPERIMENT,
  ADD_EXPERIMENT,
  EDIT_EXPERIMENT,
  REMOVE_EXPERIMENT,
  setExperiments,
  VIEW_EXPERIMENTS_RESULTS,
  TRIAL_LOAD_MODEL_SPEC,

} from 'root/redux/actions/experiments';
import { NETPYNE_COMMANDS, EDIT_WIDGETS } from 'root/constants';

import * as ExperimentsApi from '../../api/experiments';
const SUPPORTED_TYPES = [Constants.REAL_TYPE.INT, Constants.REAL_TYPE.FLOAT, Constants.REAL_TYPE.STR, Constants.REAL_TYPE.BOOL];

import Utils from '../../Utils';

import * as Constants from '../../constants';
import { pythonCall, PythonMessageFilter } from './utils';

const EXPERIMENT_POLL_INTERVAL = 1000;

const createSimulateBackendCall = async (cmd, payload, consoleMessage, spinnerType) => {
  console.log(consoleMessage);
  // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);

  const response = await Utils.evalPythonMessage(cmd, [payload]);
  console.log('Python response', response);
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  const responsePayload = processError(response);
  console.log('Python payload', responsePayload);

  if (responsePayload) {
    throw responsePayload;
  } else {
    // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);

    dehydrateCanvas();

    GEPPETTO.Manager.loadModel(response);
    console.log('Instantiation / Simulation completed.');
  }
  return response;
};

const instantiateNetwork = (payload) => createSimulateBackendCall(
  NETPYNE_COMMANDS.instantiateModel,
  payload,
  'The NetPyNE model is getting instantiated...',
  GEPPETTO.Resources.INSTANTIATING_MODEL,
);

const simulateNetwork = (payload) => createSimulateBackendCall(
  NETPYNE_COMMANDS.simulateModel,
  payload,
  'The NetPyNE model is getting simulated...',
  GEPPETTO.Resources.RUNNING_SIMULATION,
);


const errorMessageFilter = new PythonMessageFilter();

export default (store) => (next) => (action) => {


  const pythonErrorCallback = (error) => {
    console.debug(Utils.getPlainStackTrace(error.errorDetails));
    if (errorMessageFilter.shouldLaunch(error)) {
      return next(openBackendErrorDialog(error));
    }
    return next(action);
  };

  const toNetworkCallback = (reset) => () => {
    switchLayoutAction(false, reset);
    next(action);
    getExperiments();
  };

  const getExperiments = () => {
    Utils.evalPythonMessage(NETPYNE_COMMANDS.getExperiments, [])
      .then((experiments) => {
        next(setExperiments(experiments));

        if (experiments.find(e => !(e.state in [
          Constants.EXPERIMENT_STATE.DESIGN, Constants.EXPERIMENT_STATE.SIMULATED, Constants.EXPERIMENT_STATE.ERROR
        ]))) {
          setTimeout(EXPERIMENT_POLL_INTERVAL, getExperiments);
        }
      }
      );
  }

  switch (action.type) {
    case GeppettoActions.clientActions.MODEL_LOADED:
      getExperiments();
      break;
    case CREATE_NETWORK: {
      next(GeppettoActions.waitData('Instantiating the NetPyNE Model', GeppettoActions.layoutActions.SET_WIDGETS));
      let allParams = true;
      ExperimentsApi.getParameters()
        .then((params) => {
          const flattened = Utils.flatten(params);
          const paramKeys = Object.keys(flattened);

          const filteredKeys = paramKeys.filter((key) => {
            // TODO: avoid to fetch field twice!
            const field = Utils.getMetadataField(`netParams.${key}`);
            if (field && SUPPORTED_TYPES.includes(field.type)) {
              return true;
            }
            return false;
          });
          const expData = store.getState().experiments;
          expData?.inDesign?.params?.forEach((param) => {
            if (!filteredKeys.includes(param.mapsTo)) {
              pythonErrorCallback(
                {
                  errorDetails: 'Missing Parameters',
                  errorMessage: 'Error',
                },
              );
              allParams = false;
            }
          });
          if (allParams) {
            instantiateNetwork({})
              .then(toNetworkCallback(false), pythonErrorCallback);
          }
        }, pythonErrorCallback);
      break;
    }
    case CREATE_SIMULATE_NETWORK: {
      next(GeppettoActions.waitData('Simulating the NetPyNE Model', GeppettoActions.layoutActions.SET_WIDGETS));
      let allParams = true;
      ExperimentsApi.getParameters()
        .then((params) => {
          const flattened = Utils.flatten(params);
          const paramKeys = Object.keys(flattened);

          const filteredKeys = paramKeys.filter((key) => {
            // TODO: avoid to fetch field twice!
            const field = Utils.getMetadataField(`netParams.${key}`);
            if (field && SUPPORTED_TYPES.includes(field.type)) {
              return true;
            }
            return false;
          });
          const expData = store.getState().experiments;
          expData?.inDesign?.params?.forEach((param) => {
            if (!filteredKeys.includes(param.mapsTo)) {
              pythonErrorCallback(
                {
                  errorDetails: 'Missing Parameters',
                  errorMessage: 'Error',
                },
              );
              allParams = false;
            }
          });
          if (allParams) {
            simulateNetwork({ allTrials: false })
              .then(toNetworkCallback(false), pythonErrorCallback);
          }
        }, pythonErrorCallback);
      break;
    }
    case SIMULATE_NETWORK: {
      if (!action.payload) {
        next(GeppettoActions.waitData('Simulating the NetPyNE Model', GeppettoActions.layoutActions.SET_WIDGETS));
      } else {
        next(GeppettoActions.activateWidget(EDIT_WIDGETS.experimentManager.id));
      }
      let allParams = true;
      ExperimentsApi.getParameters()
        .then((params) => {
          const flattened = Utils.flatten(params);
          const paramKeys = Object.keys(flattened);

          const filteredKeys = paramKeys.filter((key) => {
            // TODO: avoid to fetch field twice!
            const field = Utils.getMetadataField(`netParams.${key}`);
            if (field && SUPPORTED_TYPES.includes(field.type)) {
              return true;
            }
            return false;
          });
          const expData = store.getState().experiments;
          expData?.inDesign?.params?.forEach((param) => {
            if (!filteredKeys.includes(param.mapsTo)) {
              pythonErrorCallback(
                {
                  errorDetails: 'Missing Parameters',
                  errorMessage: 'Error',
                },
              );
              allParams = false;
            }
          });
          if (allParams) {
            simulateNetwork({ allTrials: action.payload, usePrevInst: false })
              .then(toNetworkCallback(false), pythonErrorCallback);
          }
        }, pythonErrorCallback);
      break;
    }
    case CLONE_EXPERIMENT: {
      pythonCall({
        cmd: NETPYNE_COMMANDS.cloneExperiment,
        args: action.payload,
      })
        .then((response) => {
          console.log(response);
          getExperiments()
        });
      break;
    }
    case REMOVE_EXPERIMENT: {
      ExperimentsApi.removeExperiment(action.payload)
        .then((response) => {
          console.log(response);
          getExperiments()
        });
      break;
    }
    case ADD_EXPERIMENT: {

      ExperimentsApi.addExperiment(action.payload)
        .then((response) => {
          console.log(response);
          getExperiments()
        });
      break;
    }
    case EDIT_EXPERIMENT: {

      ExperimentsApi.editExperiment(action.payload.name, action.payload.details)
        .then((response) => {
          console.log(response);
          getExperiments()
        });
      break;
    }
    case TRIAL_LOAD_MODEL_SPEC: {
      const { name, trial } = action.payload;
      // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading ${trial.name} of experiment ${name}`);
      pythonCall({
        cmd: NETPYNE_COMMANDS.viewExperimentResults,
        args: { name, trial: trial.id, onlyModelSpecification: true },
      })
        .then(() => {
          store.dispatch(editModel);
          next(action);
        }, pythonErrorCallback);
      break;
    }
    case VIEW_EXPERIMENTS_RESULTS: {
      const { name, trial } = action.payload;
      // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading ${trial.name} of experiment ${name}`);
      pythonCall({
        cmd: NETPYNE_COMMANDS.viewExperimentResults,
        args: { name, trial: trial.id },
      })
        .then((response) => {
          const responsePayload = processError(response);
          if (responsePayload) {
            throw responsePayload;
          }

          if (response) {
            // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
            dehydrateCanvas();
            GEPPETTO.Manager.loadModel(response);
            console.log('Instantiation / Simulation completed.');

            store.dispatch(showNetwork);
          }
          next(action);
        }, pythonErrorCallback);
      break;
    }
    default: {
      next(action);
    }
  }
};
