from __future__ import print_function
from neuron import h
import threading
import time
import datetime
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from geppettoJupyter.geppetto_comm import GeppettoJupyterGUISync
from RunControl import *
from LoadAndAnalysisPanels import *
from collections import defaultdict

class LoopTimer(threading.Thread) :
    """
    a Timer that calls f every interval
    """
    def __init__(self, interval, fun = None) :
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

    def run(self) :
        #TODO With this line it hangs in some setups. Figure out if it's needed
        #h.nrniv_bind_thread(threading.current_thread().ident);
        self.started = True
        while True:
            self.fun()
            time.sleep(self.interval)

    def process_events(self) :
        #h.doEvents()
        #h.doNotify()
        
        for key,value in GeppettoJupyterModelSync.record_variables.items():
            value.timeSeries = key.to_python() 
        
        for key,value in GeppettoJupyterGUISync.sync_values.items():
            if value.sync_value != str(eval("h."+key)):
                print("taka")
                print(value.sync_value)
                print(str(eval("h."+key)))
            value.sync_value = str(eval("h."+key))


# Refresh value every 1 
class Event(object):
    def __init__(self):
        self.fih = h.FInitializeHandler(1, self.callback)

    def callback(self) :
        for key,value in GeppettoJupyterGUISync.sync_values.items():
            if value.sync_value != str(eval("h._ref_t."+key)):
                print("taka1")
                print(value.sync_value)
                print(str(eval("h._ref_t."+key)))
            value.sync_value = str(eval("h._ref_t."+key))

        h.cvode.event(h.t + 1, self.callback)



def init():
    # Reset any previous value
    GeppettoJupyterGUISync.sync_values = defaultdict(list)
    GeppettoJupyterModelSync.record_variables = defaultdict(list)
    GeppettoJupyterModelSync.current_project = None
    GeppettoJupyterModelSync.current_experiment = None
    GeppettoJupyterModelSync.current_model = None

    # Sync values when no sim is running
    timer = LoopTimer(0.1)
    timer.start()
    while not timer.started:
        time.sleep(0.001)

    # Sync values when a sim is running
    e = Event()

    # Init Panels    
    showRunControlPanel()
    showSampleModelsPanel()
    showAnalysisPanel()

