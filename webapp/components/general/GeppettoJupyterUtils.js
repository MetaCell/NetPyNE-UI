const handle_output = function (data) {
  // data is the object passed to the callback from the kernel execution
  switch (data.msg_type) {
    case 'error':
      console.log('ERROR while executing a Python command:');
      console.log(data.content.evalue.trim());
      console.error('ERROR while executing a Python command:');
      console.error(data.content.traceback);
      if (data.content.evalue === "name 'utils' is not defined") {
        execPythonMessage('from jupyter_geppetto import synchronization, utils, synchronization as jupyter_geppetto');
        execPythonMessage('from netpyne_ui.netpyne_geppetto import netpyne_geppetto');
      }
      // dispatch(GeppettoActions.geppettoError);
      GEPPETTO.trigger(GEPPETTO.Events.Error_while_exec_python_command, data.content);
      break;
    case 'execute_result':
      try {
        var response = JSON.parse(data.content.data['text/plain'].replace(/^'(.*)'$/, '$1'));
      } catch (error) {
        var response = data.content.data['text/plain'].replace(/^'(.*)'$/, '$1');
      }
      GEPPETTO.trigger(GEPPETTO.Events.Receive_Python_Message, { id: data.parent_header.msg_id, type: data.msg_type, response });
      break;
    case 'display_data':
    // FIXME
      break;
    default:
      console.log(data.content.text.trim(), true);
  }
};

const execPythonMessage = function (command, callback = handle_output) {
  const { kernel } = IPython.notebook;
  const messageID = kernel.execute(command, { iopub: { output: callback } }, { silent: false, stop_on_error: true, store_history: true });

  return new Promise((resolve, reject) => GEPPETTO.on(GEPPETTO.Events.Receive_Python_Message, (data) => {
    if (data.data.id == messageID) {
      resolve(data.data.response);
    }
  }));
};

const evalPythonMessage = function (command, parameters, parse = true) {
  let parametersString = '';
  if (parameters) {
    if (parameters.length > 0) {
      parametersString = `(${parameters.map((parameter) => `utils.convertToPython('${JSON.stringify(parameter)}')`).join(',')})`;
    } else {
      parametersString = '()';
    }
  }

  let finalCommand = command + parametersString;
  if (parse) {
    finalCommand = `utils.convertToJS(${finalCommand})`;
  }
  return execPythonMessage(finalCommand, handle_output);
};

export { execPythonMessage, evalPythonMessage };
