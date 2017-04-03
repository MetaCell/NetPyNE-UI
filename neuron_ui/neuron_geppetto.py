"""
GeppettoNeuron.py
Initialise geppetto neuron, listeners and variables
"""
import logging
from collections import defaultdict
import threading
import time
from neuron import h
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync
from neuron_ui.sample_models import SampleModels
from neuron_ui.neuron_menu import NeuronMenu
from neuron_ui import neuron_utils

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

            for key, value in list(GeppettoJupyterGUISync.sync_values.items()):
                if key != '':
                    value.sync_value = str(eval("h." + key))

        except Exception as exception:
            logging.exception("Error on Sync Mechanism for non-sim environment thread")
            raise

class Event(object):

    def __init__(self):
        self.fih = h.FInitializeHandler(1, self.callback)

    def callback(self):
        try:
            # Using 'list' so that a copy is made and we don't get: dictionary changed size during iteration items
            for key, value in list(GeppettoJupyterGUISync.sync_values.items()):
                if key != '':
                    value.sync_value = str(eval("h._ref_t." + key))

            h.cvode.event(h.t + 1, self.callback)

        except Exception as exception:
            logging.exception("Error on Sync Mechanism for sim environment thread")
            raise

def init():
    try:
        # Configure log
        neuron_utils.configure_logging()

        logging.debug('Initialising GeppettoNeuron')

        # from IPython.core.debugger import Tracer
        # Tracer()()

        # Reset any previous value
        logging.debug('Initialising Sync and Status Variables')
        GeppettoJupyterGUISync.sync_values = defaultdict(list)
        GeppettoJupyterModelSync.record_variables = defaultdict(list)
        GeppettoJupyterModelSync.current_project = None
        GeppettoJupyterModelSync.current_experiment = None
        GeppettoJupyterModelSync.current_model = None
        GeppettoJupyterModelSync.current_python_model = None
        GeppettoJupyterModelSync.events_controller = GeppettoJupyterModelSync.EventsSync()

        # Sync values when no sim is running
        logging.debug('Initialising Sync Mechanism for non-sim environment')
        timer = LoopTimer(0.3)
        timer.start()
        while not timer.started:
            time.sleep(0.001)

        # Sync values when a sim is running
        logging.debug('Initialising Sync Mechanism for sim environment')
        e = Event()

        # Init Panels
        logging.debug('Initialising GUI')
        SampleModels.Instance()
        NeuronMenu.Instance()

    except Exception as exception:
        logging.exception("Unexpected error in neuron_geppetto initialization:")
        raise
