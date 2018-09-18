"""
netpyne_geppetto_init.py
Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import traceback
import json
import logging
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync, GeppettoJupyterGUISync
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
import time
import threading
import importlib

def getJSONError(message, details):
    data = {}
    data['type'] = 'ERROR'
    data['message'] = message
    data['details'] = details
    return json.dumps(data)

def getJSONReply():
    data = {}
    data['type'] = 'OK'
    return json.dumps(data)

def configure_logging():
    logger = logging.getLogger()
    fhandler = logging.FileHandler(filename='netpyne-ui.log', mode='a')
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fhandler.setFormatter(formatter)
    logger.addHandler(fhandler)
    logger.setLevel(logging.DEBUG)
    logging.debug('Log configured')

def initGeppetto():      
    try:
        # Configure log
        configure_logging()

        logging.debug('Initialising Geppetto Jupyter communication')

        # Reset any previous value
        logging.debug('Initialising Sync and Status Variables')
        GeppettoJupyterModelSync.current_project = None
        GeppettoJupyterModelSync.current_experiment = None
        GeppettoJupyterModelSync.current_model = None
        GeppettoJupyterModelSync.current_python_model = None
        GeppettoJupyterModelSync.events_controller = GeppettoJupyterModelSync.EventsSync()
        logging.debug('EventSync was created: ')
        logging.debug(GeppettoJupyterModelSync.events_controller)
        GeppettoJupyterModelSync.events_controller.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Global_message']], globalMessageHandler)

        # Sync values when no sim is running
        logging.debug('Initialising Sync Mechanism for non-sim environment')

        
    except Exception as exception:
        logging.exception("Unexpected error while initializing Geppetto from Python:")
        logging.error(exception)

def startSynchronization(scope):
    timer = LoopTimer(0.3,scope)
    timer.start()
    while not timer.started:
        time.sleep(0.001)

class LoopTimer(threading.Thread):
    """
    a Timer that calls f every interval

    A thread that checks all the variables that we are synching between Python and Javascript and if 
    these variables have changed on the Python side will propagate the changes to Javascript

    TODO This code should move to a generic geppetto class since it's not NetPyNE specific
    """

    def __init__(self, interval, scope, fun=None):
        """
        @param interval: time in seconds between call to fun()
        @param fun: the function to call on timer update
        """
        self.started = False
        self.interval = interval
        self.scope = scope
        if fun == None:
            fun = self.process_events
        self.fun = fun
        threading.Thread.__init__(self)
        self.setDaemon(True)

    def run(self):
        self.started = True
        while True:# from netpyne_ui import neuron_utils
            self.fun()
            time.sleep(self.interval)

    def process_events(self):
        try:
            # Using 'list' so that a copy is made and we don't get: dictionary changed size during iteration items
            for key, value in list(GeppettoJupyterModelSync.record_variables.items()):
                value.timeSeries = key.to_python()

            for model, synched_component in list(GeppettoJupyterGUISync.synched_models.items()):
                modelValue=None
                if model != '':
                    try:
                        modelValue = eval(model, globals(), self.scope)
                        #logging.debug("Evaluating "+model+" = ")
                        #logging.debug(modelValue)
                        
                    except KeyError:
                        pass
                        #logging.debug("Error evaluating "+model+", don't worry, most likely the attribute is not set in the current model")

                if modelValue==None:
                    modelValue=""
                
                synched_component.value = json.dumps(modelValue)

        except Exception as exception:
            logging.exception(
                "Error on Sync Mechanism for non-sim environment thread")
            raise


def globalMessageHandler(identifier, command, parameters):
    try:
        logging.debug('Global Message Handler')
        logging.debug('Command: ' +  str(command))
        logging.debug('Parameter: ' + str(parameters))

        if parameters == '':
            response = eval(command)
        else:
            response = eval(command + '(*parameters)')
        
        GeppettoJupyterModelSync.events_controller.triggerEvent(
            "receive_python_message", {'id': identifier, 'response': response.decode("utf-8") if isinstance(response, bytes) else response})
    except:
        response = getJSONError("Error while executing command "+command,traceback.format_exc())
        GeppettoJupyterModelSync.events_controller.triggerEvent(
            "receive_python_message", {'id': identifier, 'response': response})
    
logging.debug('Initialising Geppetto')
initGeppetto()
logging.debug('Geppetto initialised')