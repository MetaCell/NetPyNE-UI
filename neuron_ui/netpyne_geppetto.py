"""
GeppettoNeuron.py
Initialise geppetto neuron, listeners and variables
"""
import logging
import threading
import time
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync
from neuron_ui import neuron_utils
from neuron_ui.netpyne_init import netParams, simConfig, tests


class LoopTimer(threading.Thread):
    """
    a Timer that calls f every interval
    """

    def __init__(self, interval, fun=None):
        """
        @param interval: time in seconds between call to fun()
        @param fun: the function to call on timer update
        """
        self.started = False
        self.interval = interval
        if fun == None:
            fun = self.process_events
        self.fun = fun
        threading.Thread.__init__(self)
        self.setDaemon(True)

    def run(self):
        # TODO With this line it hangs in some setups. Figure out if it's needed
        # h.nrniv_bind_thread(threading.current_thread().ident);
        self.started = True
        while True:
            self.fun()
            time.sleep(self.interval)

    def process_events(self):
        # h.doEvents()
        # h.doNotify()

        try:
            # Using 'list' so that a copy is made and we don't get: dictionary changed size during iteration items
            for key, value in list(GeppettoJupyterModelSync.record_variables.items()):
                value.timeSeries = key.to_python()

            for model, synched_component in list(GeppettoJupyterGUISync.synched_models.items()):
                if model != '':
                    try:
                        modelValue = eval(model)
                    except KeyError:
                        exec(model + "= ''")
                        modelValue = eval(model)

                synched_component.value = modelValue

        except Exception as exception:
            logging.exception(
                "Error on Sync Mechanism for non-sim environment thread")
            raise

def globalMessageHandler(identifier, command, parameters):
    logging.debug('Global Message Handler')
    logging.debug(command)
    logging.debug(parameters)
    if len(parameters) == 0:
        response = eval(command)
    else:
        response = eval(command + '(*parameters)')
    GeppettoJupyterModelSync.events_controller.triggerEvent(
        "receive_python_message", {'id': identifier, 'response': response})


try:
    # Configure log
    neuron_utils.configure_logging()

    logging.debug('Initialising NetpyneNeuron')

    # from IPython.core.debugger import Tracer
    # Tracer()()

    # Reset any previous value
    logging.debug('Initialising Sync and Status Variables')
    # GeppettoJupyterGUISync.sync_values = defaultdict(list)
    # GeppettoJupyterModelSync.record_variables = defaultdict(list)
    GeppettoJupyterModelSync.current_project = None
    GeppettoJupyterModelSync.current_experiment = None
    GeppettoJupyterModelSync.current_model = None
    GeppettoJupyterModelSync.current_python_model = None
    GeppettoJupyterModelSync.events_controller = GeppettoJupyterModelSync.EventsSync()
    GeppettoJupyterModelSync.events_controller.register_to_event(
        [GeppettoJupyterModelSync.events_controller._events['Global_message']], globalMessageHandler)

    # Sync values when no sim is running
    logging.debug('Initialising Sync Mechanism for non-sim environment')
    timer = LoopTimer(0.3)
    timer.start()
    while not timer.started:
        time.sleep(0.001)

    # Init Panels
    logging.debug('Initialising NetPyne')

except Exception as exception:
    logging.exception("Unexpected error in neuron_geppetto initialization:")
    logging.error(exception)
