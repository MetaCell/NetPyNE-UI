import { UPDATE_CARDS, showNetwork, CREATE_NETWORK, CREATE_SIMULATE_NETWORK } from '../actions/general';

export default store => next => action => {
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  case CREATE_SIMULATE_NETWORK:
    next(showNetwork);
    break;
  case CREATE_NETWORK:
    next(showNetwork);
    break;
  default: {
    next(action);
  }
  
  }
}