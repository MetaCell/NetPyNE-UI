/* eslint-disable no-nested-ternary */
/* eslint-disable lines-between-class-members */
/* eslint-disable consistent-return */
import {
  CLONE_EXPERIMENT,
  EDIT_EXPERIMENT,
  setExperiments,
  VIEW_EXPERIMENTS_RESULTS,
  TRIAL_LOAD_MODEL_SPEC
} from 'root/redux/actions/experiments';
import { NETPYNE_COMMANDS, EDIT_WIDGETS } from 'root/constants';
import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions';
import * as ExperimentsApi from '../../api/experiments';

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
  openConfirmationDialog
} from '../actions/general';
import { OPEN_BACKEND_ERROR_DIALOG, openBackendErrorDialog } from '../actions/errors';
import { closeDrawerDialogBox } from '../actions/drawer';
import Utils from '../../Utils';
import { downloadJsonResponse, downloadPythonResponse } from './utils';
import * as Constants from '../../constants';
import { ADD_EXPERIMENT, REMOVE_EXPERIMENT } from '../actions/experiments';


const TIMEOUT = 10000;
const EXPERIMENT_POLL_INTERVAL = 5000;

const STABLE_EXPERIMENTS_STATES = new Set([
  Constants.EXPERIMENT_STATE.DESIGN, Constants.EXPERIMENT_STATE.SIMULATED, Constants.EXPERIMENT_STATE.ERROR
]);

let previousLayout = {
  edit: undefined,
  network: undefined,
};

let previousWidgets = {
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
      additionalInfo: parsedResponse.additionalInfo,
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
  // GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

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

function isGeppettoModel(obj) {
  return Boolean(obj && obj.eClass)
}
const createSimulateBackendCall = async (cmd, payload, consoleMessage, spinnerType) => {
  console.log(consoleMessage);

  const response = await Utils.evalPythonMessage(cmd, [payload]);
  console.log('Python response', response);

  const responsePayload = processError(response);
  console.log('Python payload', responsePayload);

  if (responsePayload) {
    throw responsePayload;
  } else if(isGeppettoModel(response)) {


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

const simulateNetwork = (isBatch) => createSimulateBackendCall(
  NETPYNE_COMMANDS.simulateModel,
  isBatch,
  'The NetPyNE model is getting simulated...',
  GEPPETTO.Resources.RUNNING_SIMULATION,
);

class PythonMessageFilter {
  errorIds = new Set();
  shouldLaunch(e) {
    const errorId = e.additionalInfo?.sim_id;
    if (!errorId) {
      return true;
    }
    if (errorId) {
      if (this.errorIds.has(errorId)) {
        return false;
      }
      this.errorIds.add(errorId);
      return true;
    }
  }
}

function addMetadataToWindow(data) {

  window.metadata = data.metadata;
  window.currentFolder = data.currentFolder;
  window.isDocker = data.isDocker;
  window.pythonConsoleLoaded = true;
  window.tuts = data.tuts;
  window.cores = data.cores;
}

const errorMessageFilter = new PythonMessageFilter();

export default (store) => (next) => (action) => {
  const switchLayoutAction = (edit = true, reset = true) => {
    previousLayout[store.getState().general.editMode ? 'edit' : 'network'] = store.getState().layout;
    previousWidgets[store.getState().general.editMode ? 'edit' : 'network'] = store.getState().widgets;
    if (reset) {
      previousLayout = {
        edit: undefined,
        network: undefined,
      };
      previousWidgets = {
        edit: undefined,
        network: undefined,
      };
    }
    // TO FIX: I am not sure the one below is to fix, previously we were setting layout or widgets but I don't understand
    // how the widgets where making it back into the redux store without the set widgets
    return next(edit
      ? previousLayout.edit
        ? GeppettoActions.setLayout(previousLayout.edit) && GeppettoActions.setWidgets(previousWidgets.edit)
        : GeppettoActions.setWidgets({ ...Constants.EDIT_WIDGETS })
      : previousLayout.network
        ? GeppettoActions.setLayout(previousLayout.network) && GeppettoActions.setWidgets(previousWidgets.network)
        : GeppettoActions.setWidgets({ ...Constants.DEFAULT_NETWORK_WIDGETS }));
  };

  const toNetworkCallback = (reset) => () => {
    switchLayoutAction(false, reset);
    getExperiments()
    next(action);

  };

  const pythonErrorCallback = (error) => {
    console.debug(Utils.getPlainStackTrace(error.errorDetails));
    getExperiments()
    if (errorMessageFilter.shouldLaunch(error)) {
      return next(openBackendErrorDialog(error));
    }

    return next(action);
  };


  const getExperiments = () => {
    Utils.evalPythonMessage(NETPYNE_COMMANDS.getExperiments, [])
      .then((experiments) => {
        next(setExperiments(experiments));

        if (experiments.find(e => !STABLE_EXPERIMENTS_STATES.has(e.state))) {
          setTimeout(getExperiments, EXPERIMENT_POLL_INTERVAL);
        }
      }
      );
  }

  const checkParametersThen = (callback, goToNetworkView = false, waitingMessage = '') => {
    let allParams = true;
    const inDesignExp = store.getState().experiments?.inDesign;

    if(inDesignExp) {
      ExperimentsApi.getParameters()
      .then((params) => {
        const flattened = Utils.flatten(params);
        const paramKeys = new Set(Object.keys(flattened));

        inDesignExp.params?.forEach((param) => {
          if (!paramKeys.has(param.mapsTo)) {
            pythonErrorCallback(
              {
                errorDetails: `Experiment parameter ${param.mapsTo} is missing from the current model`,
                errorMessage: 'Error',
              },
            );
            allParams = false;
          }
        });
        if (allParams) {
          callback().then((response => {
            next(openConfirmationDialog({title: "Experiment started", ...response}));
            getExperiments();
          })
            ,pythonErrorCallback);
        }
      }, pythonErrorCallback);
    } else {
      next(GeppettoActions.waitData(waitingMessage, GeppettoActions.layoutActions.SET_WIDGETS));
      callback().then(toNetworkCallback(goToNetworkView), pythonErrorCallback)
    }

  }

  switch (action.type) {
    case GeppettoActions.layoutActions.SET_WIDGETS: {
      if (Object.values(action.data).length == 1) {
        // Initializing, only Python console is here
        next(GeppettoActions.waitData('Loading NetPyNE-UI', GeppettoActions.clientActions.MODEL_LOADED));
      }
      next(action);
      break;
    }


    case "JUPYTER_GEPPETTO_EXTENSION_READY": {
      next(action);
      const project = {
        id: 1,
        name: 'Project',
        experiments: [{
          id: 1,
          name: 'Experiment',
          status: 'DESIGN',
        }],
      };
      // to move to redux action, if not working create tech debt card and we do it later.
      GEPPETTO.Manager.loadProject(project, false);
      // to remove the experiment.
      // GEPPETTO.Manager.loadExperiment(1, [], []);

      let responded = false;
      Utils.execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      Utils.evalPythonMessage('netpyne_geppetto.getData', [])
        .then((response) => {
          responded = true;
          next(GeppettoActions.waitData('Loading NetPyNE-UI', GeppettoActions.clientActions.MODEL_LOADED));

          const metadata = Utils.convertToJSON(response);
          addMetadataToWindow(metadata);
          next(GeppettoActions.setWidgets(EDIT_WIDGETS));

          next(GeppettoActions.modelLoaded())
          getExperiments()
        });

      setTimeout(() => {
        if (!responded) {
          next(GeppettoActions.waitData('Reloading Python Kernel', GeppettoActions.clientActions.MODEL_LOADED));
          IPython.notebook.restart_kernel({ confirm: false })
            .then(() => window.location.reload());
        }
      }, TIMEOUT);
      break;
    }
    case OPEN_BACKEND_ERROR_DIALOG:
      next(GeppettoActions.setWidgets(store.getState().widgets));
      next(action);
      break;
    case GeppettoActions.clientActions.MODEL_LOADED:
      if (store.getState()?.general?.modelState === Constants.MODEL_STATE.NOT_INSTANTIATED) {
        const networkPath = window.Instances.getInstance('network');
        if (networkPath) {
          store.dispatch(addInstancesToCanvas([{
            instancePath: networkPath.getInstancePath(),
            color: Constants.DEFAULT_COLOR,
          }]));
        }
      }
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
      // GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Reloading Python Kernel');
      IPython.notebook.restart_kernel({ confirm: false })
        .then(
          () => {
            window.location.reload();
          },
        );
      break;
    }
    case CREATE_NETWORK: {
      checkParametersThen(() => instantiateNetwork({}), false, "Instantiating the NetPyNE Model")

      break;
    }
    case CREATE_SIMULATE_NETWORK: {
      checkParametersThen(() => simulateNetwork({ allTrials: false }), false, "Instantiating and simulating the NetPyNE Model")

      break;
    }
    case SIMULATE_NETWORK: {
      if (action.payload) {
        next(GeppettoActions.activateWidget(EDIT_WIDGETS.experimentManager.id));
      }

      checkParametersThen(() => simulateNetwork({ allTrials: action.payload, usePrevInst: (store.getState().general.modelState !== Constants.MODEL_STATE.NOT_INSTANTIATED) }), false, "Simulating the NetPyNE Model")
      break;
    }
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
      next(action);
      break;
    }
    case LOAD_TUTORIAL: {
      const tutName = action.payload.replace('.py', '');
      next(GeppettoActions.waitData(`Importing ${tutName}...`, LOAD_TUTORIAL));

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
        .then((response) => {
          next(action)
          console.log("Tutorial imported", response)
        }
        );

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
