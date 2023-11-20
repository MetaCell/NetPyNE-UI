import { KERNEL_HANDLING } from '../../constants';
import { store } from '../../redux/actiondomainStore'
import { recordCommand, dropLastCommand, dropFromIndex } from '../../redux/actions/actiondomain';
import { execPythonMessage, execPythonMessageWithoutRecording } from './GeppettoJupyterUtils';


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
}

const TIMEFRAME = 10 * 1000; // 10s
let lastReplayTime = 0

const getCommands = (kernelID) => {
  return [
    "from jupyter_geppetto import jupyter_geppetto",
    "from jupyter_geppetto import utils",
    "from netpyne_ui.netpyne_geppetto import netpyne_geppetto",
    "netpyne_geppetto.deleteModel({})",
    `netpyne_geppetto.loadFromIndexFile("${KERNEL_HANDLING.tmpModelPath}")`,
    ...store.getState()[kernelID]
  ]
}

const replayAll = (kernelID, fromRec = false) => {
  const currentTimestamp = Date.now();
  const commands = getCommands(kernelID);

  if (!fromRec && currentTimestamp - lastReplayTime < TIMEFRAME) {
    const restartLoop = new CustomEvent("kernelRestartLoop", {
        detail: {
          "kernel": kernelID,
          "state": "looping"
        }
    });
    window.dispatchEvent(restartLoop);
    store.dispatch(dropLastCommand(kernelID))
    replayAll(kernelID, true)
    return
  }

  const lastCommand = commands.pop()  // we drop the last command which is probably the faulty one
  const script = commands.join('\n')
  console.log("Playing", script)
  console.log("Skipping last command", lastCommand)
  lastReplayTime = currentTimestamp
  execPythonMessageWithoutRecording(script).then(() => {
    store.dispatch(dropLastCommand(kernelID))
  })
}

export { record, replayAll }