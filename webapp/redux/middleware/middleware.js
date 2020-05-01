import { 
  UPDATE_CARDS, CREATE_NETWORK, CREATE_SIMULATE_NETWORK, PYTHON_CALL, SIMULATE_NETWORK,
  showNetwork, createNetwork, createAndSimulateNetwork, editModel, EDIT_MODEL
} from '../actions/general';
import { switchLayout } from '../actions/layout'
import { openBackendErrorDialog } from '../actions/errors';
import { closeDrawerDialogBox } from '../actions/drawer';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';
import { downloadJsonResponse, downloadPythonResponse } from './utils'

export default store => next => action => {
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  case EDIT_MODEL:{
    next(action)
    next(switchLayout)
    break
  }
  case CREATE_NETWORK:{
    instantiateNetwork({}, next, createNetwork, switchLayout, true)
    break;
  }
  case CREATE_SIMULATE_NETWORK:{
    simulateNetwork({ parallelSimulation: false }, next, action, true)
    break;
  }
    
  case SIMULATE_NETWORK:
    simulateNetwork({ parallelSimulation: false, usePrevInst: true }, next, action, false)
    break
  case PYTHON_CALL:
    pythonCall(next, action)
    break;
  default: {
    next(action);
  }
  }
}


const instantiateNetwork = async (payload, next, action, shouldSwitchLayout) => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.instantiateModel,
    payload, next, action,
    "The NetPyNE model is getting instantiated...",
    GEPPETTO.Resources.INSTANTIATING_MODEL,
    shouldSwitchLayout
  )
}

const simulateNetwork = async (payload, next, action, shouldSwitchLayout) => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.simulateModel,
    payload, next, action,
    "The NetPyNE model is getting simulated...",
    GEPPETTO.Resources.RUNNING_SIMULATION,
    shouldSwitchLayout
  )
}

const createSimulateBackendCall = async (cmd, payload, next, action, consoleMessage, spinnerType, shouldSwitchLayout) => {
  GEPPETTO.CommandController.log(consoleMessage);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);
  
  const response = await Utils.evalPythonMessage(cmd, [payload])
    
  const errorPayload = await processError(response)
  if (errorPayload) {
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    next(openBackendErrorDialog(errorPayload))
  } else {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
    GEPPETTO.Manager.loadModel(response);
    GEPPETTO.CommandController.log('Instantiation / Simulation completed.');
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

    next(action)
    if (shouldSwitchLayout) {
      next(switchLayout)
    }
  }
}

export const processError = response => {
  var parsedResponse = Utils.getErrorResponse(response);
  if (parsedResponse) {
    return { errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] }
  }
  return false
}

const pythonCall = async (next, action) => {
  const response = await Utils.evalPythonMessage(action.cmd, [action.args])
  const errorPayload = await processError(response)
  if (errorPayload) {
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    next(openBackendErrorDialog(errorPayload))
  } else {
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
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    next(closeDrawerDialogBox)
  }
}
