import { UPDATE_CARDS, showNetwork, CREATE_NETWORK, CREATE_SIMULATE_NETWORK } from '../actions/general';
import { openBackendErrorDialog } from '../actions/errors';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';

export default store => next => action => {
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  case CREATE_SIMULATE_NETWORK:
    simulateNetwork({ parallelSimulation: false }, next, showNetwork)
    break;
  case CREATE_NETWORK:
    instantiateNetwork({}, next, showNetwork)
    break;
  default: {
    next(action);
  }
  
  }
}


const instantiateNetwork = async (payload, next, action) => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.instantiateModel,
    payload, next, action,
    "The NetPyNE model is getting instantiated...",
    GEPPETTO.Resources.INSTANTIATING_MODEL
  )
}

const simulateNetwork = async (payload, next, action) => {
  createSimulateBackendCall(
    NETPYNE_COMMANDS.simulateModel,
    payload, next, action,
    "The NetPyNE model is getting simulated...",
    GEPPETTO.Resources.RUNNING_SIMULATION
  )
}

const createSimulateBackendCall = async (cmd, payload, next, action, consoleMessage, spinnerType) => {
  GEPPETTO.CommandController.log(consoleMessage);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, spinnerType);
  
  const response = await Utils.evalPythonMessage(cmd, [payload])
    
  const errorPayload = await processError(response)
  if (errorPayload) {
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    next(openBackendErrorDialog(payload))
  } else {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
    GEPPETTO.Manager.loadModel(response);
    GEPPETTO.CommandController.log(consoleMessage + ' was completed.');
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    next(action)
  }
}

const processError = response => {
  var parsedResponse = Utils.getErrorResponse(response);
  if (parsedResponse) {
    return { errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] }
  }
  return false
}