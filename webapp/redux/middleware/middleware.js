import { 
  UPDATE_CARDS, CREATE_NETWORK, CREATE_SIMULATE_NETWORK, PYTHON_CALL, SIMULATE_NETWORK,
  showNetwork, createNetwork, createAndSimulateNetwork, editModel, EDIT_MODEL
} from '../actions/general';

import { openBackendErrorDialog } from '../actions/errors';
import { closeDrawerDialogBox } from '../actions/drawer';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';
import { downloadJsonResponse, downloadPythonResponse } from './utils'

export default store => next => action => {
  const errorCallback = errorPayload => next(openBackendErrorDialog(errorPayload));
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  case EDIT_MODEL:{
    next(action);
    break
  }
  case CREATE_NETWORK:{
    instantiateNetwork({}).then(() => next(action), errorCallback);
    break;
  }
  case CREATE_SIMULATE_NETWORK:{
    simulateNetwork({ parallelSimulation: false }).then(() => next(action), errorCallback);
    break;
  }
    
  case SIMULATE_NETWORK:
    simulateNetwork({ parallelSimulation: false, usePrevInst: true }).then(() => next(action), errorCallback);
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
        next(editModel)
        break;
      default:
        break;
      }
      next(closeDrawerDialogBox)
    }
    pythonCall(action).then(callback, errorCallback);
    break;
  }
  default: {
    next(action);
  }
  }


}


const instantiateNetwork = async payload => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.instantiateModel,
    payload,
    "The NetPyNE model is getting instantiated...",
    GEPPETTO.Resources.INSTANTIATING_MODEL)
}

const simulateNetwork = async payload => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.simulateModel,
    payload,
    "The NetPyNE model is getting simulated...",
    GEPPETTO.Resources.RUNNING_SIMULATION
  )
}

const createSimulateBackendCall = async (cmd, payload, consoleMessage, spinnerType) => {
  GEPPETTO.CommandController.log(consoleMessage);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);
  
  const response = await Utils.evalPythonMessage(cmd, [payload])
  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
  const errorPayload = processError(response);
  if (errorPayload) {
    throw new Error(errorPayload);
  } else {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
    GEPPETTO.Manager.loadModel(response);
    GEPPETTO.CommandController.log('Instantiation / Simulation completed.');
  }
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
