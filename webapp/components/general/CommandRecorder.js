import { store } from '../../redux/actiondomainStore'
import { recordCommand } from '../../redux/actions/actiondomain';
import { execPythonMessageWithoutRecording } from './GeppettoJupyterUtils';


const registerKernelListeners = () => {
  try {
    if(IPython.notebook.kernel == null) {
      console.warn("Kernel not initialized. Waiting to register kernel event listeners");
      setTimeout(registerKernelListeners, 500);
      return;
    }
  } catch (error) {
    console.warn("IPython not initialized.  Waiting to register kernel event listeners");
    setTimeout(registerKernelListeners, 500);
    return
  }

  const notebook = IPython.notebook;
  const handleKernelStatusChange = (event, data) => {
    const kernelStatusEvent = new CustomEvent("kernelstatus", {
        detail: {
          "type": event.type,
          ...data
        },
    });
    window.dispatchEvent(kernelStatusEvent);
  };

  const handleExecutionRequest = (event, data) => {
    if (data.content.netpyne_ui_triggered) {
      return
    }
    const { kernel, content } = data;
    console.log("Kernel", kernel.id, "execute", content.code)
    record(kernel.id, content.code);
  }

  // Kernel lifecycle requests
  notebook.events.on('kernel_created.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_reconnecting.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_connected.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_starting.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_restarting.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_autorestarting.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_interrupting.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_disconnected.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_ready.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_killed.Kernel', handleKernelStatusChange);
  notebook.events.on('kernel_dead.Kernel', handleKernelStatusChange);

  // Execution requests
  notebook.events.on('execution_request.Kernel', handleExecutionRequest);
}
registerKernelListeners();


const record = (kernelID, command) => {
  store.dispatch(recordCommand(kernelID, command))
  const actionStore = store.getState();
  console.log("store", actionStore)
}

const replayAll = (kernelID) => {
  const commands = [
    "from jupyter_geppetto import jupyter_geppetto",
    "from jupyter_geppetto import utils",
    "from netpyne_ui.netpyne_geppetto import netpyne_geppetto",
    "netpyne_geppetto.deleteModel({})",
    ...store.getState()[kernelID]];
  commands.pop()  // we drop the last command which is probably the faulty one
  execPythonMessageWithoutRecording(commands.join('\n'))
}

export { record, replayAll }