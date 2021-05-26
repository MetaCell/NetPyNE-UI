import { DELETE_NETPARAMS_OBJ, updateCards } from '../actions/general';
import Utils from '../../Utils';
import { NETPYNE_COMMANDS } from '../../constants';

function deleteNetPyNEObj (paramName, paramPath, next, action) {
  Utils.evalPythonMessage(NETPYNE_COMMANDS.deleteParam, [paramPath, paramName]).then((response) => {
    if (response) {
      /*
       * var model = this.state.value;
       * delete model[name];
       * this.setState({ value: model, selectedPopulation: undefined, populationDeleted: name }, () => this.props.updateCards());
       */
      next(action);
    }
  });
}

export default (store) => (next) => (action) => {
  switch (action.type) {
    case DELETE_NETPARAMS_OBJ: {
      console.log('Triggered a rule deletion update');
      console.log(action.payload);
      const { paramName, paramPath } = action.payload;
      deleteNetPyNEObj(paramName, paramPath, next, updateCards);
      break;
    }

    default: {
      next(action);
    }
  }
};
