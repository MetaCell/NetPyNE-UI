import { 
  UPDATE_CARDS, CREATE_NETWORK, CREATE_SIMULATE_NETWORK, PYTHON_CALL, SIMULATE_NETWORK, SHOW_NETWORK, 
  editModel, EDIT_MODEL, LOAD_TUTORIAL, RESET_MODEL, setDefaultWidgets
} from '../actions/general';
import FLEXLAYOUT_DEFAULT_STATE from '../../components/layout/defaultLayout';
import { openBackendErrorDialog } from '../actions/errors';
import { closeDrawerDialogBox } from '../actions/drawer';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';
import { downloadJsonResponse, downloadPythonResponse } from './utils'

import { setWidgets, setLayout } from '../actions/layout';
import * as Constants from '../../constants';

let previousLayout = { edit: undefined, network: undefined };


export default store => next => action => {
 

  const switchLayoutAction = (edit = true, reset = true) => {
    previousLayout[store.getState().general.editMode ? 'edit' : 'network'] = store.getState().layout;
    if (reset) {
      previousLayout = { edit: undefined, network: undefined };
    }
    return next(edit  
      ? previousLayout.edit ? setLayout(previousLayout.edit) : setWidgets({ ...Constants.EDIT_WIDGETS })  
      : previousLayout.network ? setLayout(previousLayout.network) : setWidgets({ ...Constants.DEFAULT_NETWORK_WIDGETS }));
  }
  const toNetworkCallback = reset => () => {
    
    switchLayoutAction(false, reset);
    next(action);
  };

  const pythonErrorCallback = errorPayload => next(openBackendErrorDialog(errorPayload.message));
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  case SHOW_NETWORK:
    
    switchLayoutAction(false, false);
    next(action);
    break;
  case EDIT_MODEL:{
    switchLayoutAction(true, false);
    next(action);
    break
  }
  case RESET_MODEL:{
    IPython.notebook.restart_kernel({ confirm: false }).then(
      () => {
        window.location.reload();
      }
    );
    break
  }
  case CREATE_NETWORK:{  
    instantiateNetwork({}).then(toNetworkCallback(false), pythonErrorCallback);
    break;
  }
  case CREATE_SIMULATE_NETWORK:{
    simulateNetwork({ parallelSimulation: false }).then(toNetworkCallback(false), pythonErrorCallback);
    break;
  }
  case SIMULATE_NETWORK:
    simulateNetwork({ parallelSimulation: false, usePrevInst: true }).then(toNetworkCallback(false), pythonErrorCallback);
    break
  case PYTHON_CALL: {
    const callback = response => {
      switch (action.cmd) {
      case NETPYNE_COMMANDS.exportModel:
        downloadJsonResponse(response)
        break;
      case NETPYNE_COMMANDS.exportHLS:
        downloadPythonResponse(response)
        break;
      case NETPYNE_COMMANDS.deleteModel:
        next(editModel);
        switchLayoutAction(true, true);
       
        break;
      default:
        break;
      }
      next(closeDrawerDialogBox)
    }
    pythonCall(action).then(callback, pythonErrorCallback);
    break;
  }
  case LOAD_TUTORIAL: {
    const tutName = action.payload.replace('.py', '')
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, `Loading tutorial ${tutName}`);
    
    const params = {
      modFolder: 'mod',
      loadMod: false,
      compileMod: false,

      netParamsPath:".",
      netParamsModuleName: tutName,
      netParamsVariable: "netParams",

      simConfigPath:".",
      simConfigModuleName: tutName,
      simConfigVariable: "simConfig",

    }

    pythonCall({ cmd: 'netpyne_geppetto.importModel', args:params })
      .then(response => console.log(response))
    break
  }
  default: {
    next(action);
  }
  }


}


const instantiateNetwork = payload => createSimulateBackendCall(
  NETPYNE_COMMANDS.instantiateModel,
  payload,
  "The NetPyNE model is getting instantiated...",
  GEPPETTO.Resources.INSTANTIATING_MODEL)


const simulateNetwork = payload => 
  createSimulateBackendCall(
    NETPYNE_COMMANDS.simulateModel,
    payload,
    "The NetPyNE model is getting simulated...",
    GEPPETTO.Resources.RUNNING_SIMULATION
  )


const createSimulateBackendCall = async (cmd, payload, consoleMessage, spinnerType) => {
  GEPPETTO.CommandController.log(consoleMessage);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);

  
  const response = await Utils.evalPythonMessage(cmd, [payload]);
  console.log('Python response', response);
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  const responsePayload = processError(response);
  console.log('Python payload', responsePayload);
  if (responsePayload) {
    throw new Error(responsePayload.errorMessage);
  } else {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
    GEPPETTO.Manager.loadModel(response);
    GEPPETTO.CommandController.log('Instantiation / Simulation completed.');
      
  }
  return response;
}

export const processError = response => {
  var parsedResponse = Utils.getErrorResponse(response);
  if (parsedResponse) {
    return { errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] }
  }
  return false
}

const pythonCall = async ({ cmd, args }) => {
  const response = await Utils.evalPythonMessage(cmd, [args])
  const errorPayload = await processError(response);
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  if (errorPayload) {
    throw new Error(errorPayload);
  } 
  return response;
}
