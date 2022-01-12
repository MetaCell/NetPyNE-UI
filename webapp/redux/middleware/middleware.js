import {
  CLONE_EXPERIMENT,
  GET_EXPERIMENTS,
  setExperiments,
  VIEW_EXPERIMENTS_RESULTS,
  TRIAL_LOAD_MODEL_SPEC,
} from 'root/redux/actions/experiments';
import { NETPYNE_COMMANDS } from 'root/constants';
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
  MODEL_LOADED,
} from '../actions/general';
import { openBackendErrorDialog } from '../actions/errors';
import { closeDrawerDialogBox } from '../actions/drawer';
import Utils from '../../Utils';
import { downloadJsonResponse, downloadPythonResponse } from './utils';
import * as Constants from '../../constants';

let previousLayout = {
  edit: undefined,
  network: undefined,
};

export const processError = (response) => {
  const parsedResponse = Utils.getErrorResponse(response);
  if (parsedResponse) {
    Utils.captureSentryException(parsedResponse);
    return {
      errorMessage: parsedResponse.message,
      errorDetails: parsedResponse.details,
    };
  }
  return false;
};

const pythonCall = async ({
  cmd,
  args,
}) => {
  const response = await Utils.evalPythonMessage(cmd, [args]);
  const errorPayload = processError(response);
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

  if (errorPayload) {
    throw errorPayload;
  }

  return response;
};

const dehydrateCanvas = () => {
  if ('CanvasContainer' in window) {
    CanvasContainer.engine.reset();
    Object.values(CanvasContainer.engine.meshes)
      .forEach((mesh) => {
        CanvasContainer.engine.removeObject(mesh);
      });
  }
};

const createSimulateBackendCall = async (cmd, payload, consoleMessage, spinnerType) => {
  console.log(consoleMessage);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);

  const response = await Utils.evalPythonMessage(cmd, [payload]);
  console.log('Python response', response);
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  const responsePayload = processError(response);
  console.log('Python payload', responsePayload);

  if (responsePayload) {
    throw responsePayload;
  } else {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);

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

export default (store) => (next) => (action) => {
  const switchLayoutAction = (edit = true, reset = true) => {
    previousLayout[store.getState().general.editMode ? 'edit' : 'network'] = store.getState().layout;
    if (reset) {
      previousLayout = {
        edit: undefined,
        network: undefined,
      };
    }
    // TO FIX: I am not sure the one below is to fix, previously we were setting layout or widgets but I don't understand
    // how the widgets where making it back into the redux store without the set widgets
    return next(edit
      ? GeppettoActions.setLayout(previousLayout.edit) && GeppettoActions.setWidgets({ ...Constants.EDIT_WIDGETS })
      : GeppettoActions.setLayout(previousLayout.network) && GeppettoActions.setWidgets({ ...Constants.DEFAULT_NETWORK_WIDGETS }));
  };

  const toNetworkCallback = (reset) => () => {
    switchLayoutAction(false, reset);
    next(action);
  };

  const pythonErrorCallback = (error) => {
    console.debug(Utils.getPlainStackTrace(error.errorDetails));
    return next(openBackendErrorDialog(error));
  };

  switch (action.type) {
    case MODEL_LOADED:
      next(GeppettoActions.waitData('Loading the NetPyNE Model', GeppettoActions.clientActions.MODEL_LOADED));
      next(action);
      break;
    case UPDATE_CARDS:
      console.log('Triggered card update');
      next(action);
      break;
    case SHOW_NETWORK:
      switchLayoutAction(false, false);
      next(action);
      break;
    case EDIT_MODEL: {
      switchLayoutAction(true, false);
      next(action);
      break;
    }
    case RESET_MODEL: {
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Reloading Python Kernel');
      IPython.notebook.restart_kernel({ confirm: false })
        .then(
          () => {
            window.location.reload();
          },
        );
      break;
    }
    case CREATE_NETWORK: {
      instantiateNetwork({})
        .then(toNetworkCallback(false), pythonErrorCallback);
      break;
    }
    case CREATE_SIMULATE_NETWORK: {
      simulateNetwork({ allTrials: false })
        .then(toNetworkCallback(false), pythonErrorCallback);
      break;
    }
    case SIMULATE_NETWORK:
      simulateNetwork({ allTrials: action.payload, usePrevInst: false })
        .then(toNetworkCallback(false), pythonErrorCallback);
      break;
    case PYTHON_CALL: {
      const callback = (response) => {
        switch (action.cmd) {
          case NETPYNE_COMMANDS.exportModel:
            downloadJsonResponse(response);
            break;
          case NETPYNE_COMMANDS.exportHLS:
            downloadPythonResponse(response);
            break;
          case NETPYNE_COMMANDS.deleteModel:
            next(editModel);
            switchLayoutAction(true, true);
            break;
          default:
            break;
        }
        next(closeDrawerDialogBox);
      };
      pythonCall(action)
        .then(callback, pythonErrorCallback);
      break;
    }
    case LOAD_TUTORIAL: {
      const tutName = action.payload.replace('.py', '');
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading tutorial ${tutName}`);

      const params = {
        modFolder: 'mod',
        loadMod: false,
        compileMod: false,

        netParamsPath: '.',
        netParamsModuleName: tutName,
        netParamsVariable: 'netParams',

        simConfigPath: '.',
        simConfigModuleName: tutName,
        simConfigVariable: 'simConfig',
      };

      pythonCall({
        cmd: NETPYNE_COMMANDS.importModel,
        args: params,
      })
        .then((response) => console.log(response));
      break;
    }
    case GET_EXPERIMENTS: {
      Utils.evalPythonMessage(NETPYNE_COMMANDS.getExperiments, [])
        .then((response) => next(setExperiments(response)));
      break;
    }
    case CLONE_EXPERIMENT: {
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Cloning experiment ${action.payload.name}`);
      pythonCall({
        cmd: NETPYNE_COMMANDS.cloneExperiment,
        args: action.payload,
      })
        .then((response) => console.log(response));
      break;
    }
    case TRIAL_LOAD_MODEL_SPEC: {
      const { name, trial } = action.payload;
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading ${trial.name} of experiment ${name}`);
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
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading ${trial.name} of experiment ${name}`);
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
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
            dehydrateCanvas();
            GEPPETTO.Manager.loadModel(response);
            GEPPETTO.CommandController.log('Instantiation / Simulation completed.');

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
