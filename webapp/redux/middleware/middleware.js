import { UPDATE_CARDS } from '../actions/general';

export default store => next => action => {
  switch (action.type) {

  case UPDATE_CARDS:
    console.log("Triggered card update")
    next(action);
    break;
  
  default: {
    next(action);
  }
  
  }
}