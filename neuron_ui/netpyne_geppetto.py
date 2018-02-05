"""
GeppettoNeuron.py
Initialise geppetto neuron, listeners and variables
"""
import logging
import threading
import time
import StringIO
import json
import os
import importlib
import sys
import subprocess

from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync
from neuron_ui import neuron_utils
from neuron_ui.netpyne_init import netParams, simConfig, tests, metadata, api, sim, analysis
from netpyne_model_interpreter import NetPyNEModelInterpreter
from model.model_serializer import GeppettoModelSerializer
import matplotlib.pyplot as plt
from model import ui
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
import neuron
# TODO we should probablye first import something generic for geppetto which brings in the timer, the global handler, etc


class LoopTimer(threading.Thread):
    """
    a Timer that calls f every interval

    A thread that checks all the variables that we are synching between Python and Javascript and if 
    these variables have changed on the Python side will propagate the changes to Javascript

    TODO This code should move to a generic geppetto class since it's not NetPyNE specific
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
                        logging.debug("Error evaluating "+model)
                        exec(model + "= ''")
                        modelValue = eval(model)

                synched_component.value = json.dumps(modelValue)

        except Exception as exception:
            logging.exception(
                "Error on Sync Mechanism for non-sim environment thread")
            raise

def globalMessageHandler(identifier, command, parameters):
    """
    TODO This code should move to a generic geppetto class since it's not NetPyNE specific
    """
    logging.debug('Global Message Handler')
    logging.debug(command)
    logging.debug(parameters)
    if parameters == '':
        response = eval(command)
    else:
        response = eval(command + '(*parameters)')
    logging.debug("concatenate")
    #logging.debug(response)
    GeppettoJupyterModelSync.events_controller.triggerEvent(
        "receive_python_message", {'id': identifier, 'response': response})

class NetPyNEGeppetto():

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

    def instantiateNetPyNEModelInGeppetto(self):
        netpyne_model = self.instantiateNetPyNEModel()
        self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
        return GeppettoModelSerializer().serialize(self.geppetto_model)
        
    def simulateNetPyNEModelInGeppetto(self):
        netpyne_model = self.simulateNetPyNEModel()
        self.geppetto_model = self.model_interpreter.updateGeppettoModel(netpyne_model, self.geppetto_model)
        return GeppettoModelSerializer().serialize(self.geppetto_model)


    def importModel(self, modelParameters):
        logging.debug(modelParameters)
        
        # Get Current dir
        owd = os.getcwd()
        modelPath = modelParameters["modelPath"]
        
        #Create Symbolic link
        if modelParameters['compileMod']:
            modPath = os.path.join(modelParameters['modFolder'],"x86_64")
            subprocess.call(["rm", "-r", modPath])
            
            os.chdir(modelParameters["modFolder"])
            subprocess.call(["nrnivmodl"])
            
        # Load mechanism if mod path is passed
        if modelParameters['modFolder']:
            neuron.load_mechanisms(str(modelParameters["modFolder"] ))
        
        # Change to new path and add to system path
        sys.path.append(modelPath)
        os.chdir(modelPath)

        # Import Module 
        module = importlib.import_module(modelParameters["moduleName"])
        
        # Import Model attributes
        import netpyne_geppetto
        netpyne_geppetto.netParams = getattr(module, modelParameters["netParamsVariable"])
        netpyne_geppetto.simConfig = getattr(module, modelParameters["simConfigVariable"])

        os.chdir(owd)    

    def instantiateNetPyNEModel(self):
        sim.create(netParams, simConfig, True)
        sim.analyze()
        return sim

    def simulateNetPyNEModel(self):
        sim.simulate()
        sim.analyze()

        return sim

    def rename(self, path, oldValue,newValue):
        command =  'sim.rename('+path+',"'+oldValue+'","'+newValue+'")'
        logging.debug('renaming '+command)
        eval(command)

        for model, synched_component in list(GeppettoJupyterGUISync.synched_models.items()):
            if model != '' and oldValue in model:
                GeppettoJupyterGUISync.synched_models.pop(model)
                newModel = model.replace(oldValue,newValue)
                GeppettoJupyterGUISync.synched_models[newModel]=synched_component

    def getNetPyNE2DNetPlot(self):
        fig = analysis.plot2Dnet(showFig=False)
        if fig==-1:
            return fig
        return ui.getSVG(fig)
    
    def getNetPyNEShapePlot(self):
        fig = analysis.plotShape(includePost = ['all'],showFig=False)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNEConnectionsPlot(self):
        fig = analysis.plotConn(showFig=False)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNERasterPlot(self):
        fig = analysis.plotRaster(showFig=False)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNETracesPlot(self):
        #the hardcoded include 1 will need to go, ask Salvador about include "recorded"
        figs = analysis.plotTraces(include=None, showFig=False)
        if figs==-1:
            return figs
        svgs = []
        for key, value in figs.iteritems():
            logging.debug("Found plot for "+ key)
            svgs.append(ui.getSVG(value))
        return svgs
    
    def getNetPyNESpikeHistPlot(self):
        fig = analysis.plotSpikeHist(showFig=False)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNESpikeStatsPlot(self):
        fig = analysis.plotSpikeStats(showFig=False)
        if fig==-1:
            return fig
        else:
            fig=fig[0]
        return ui.getSVG(fig)

    def getNetPyNEGrangerPlot(self):
        fig = analysis.granger(showFig=False)
        if fig==-1:
            return fig
        else:
            fig=fig[-1]
        return ui.getSVG(fig)
    
    def getNetPyNERatePSDPlot(self):
        fig = analysis.plotRatePSD(showFig=False)
        if fig==-1:
            return fig
        else:
            fig=fig[0]
        svgs = []
        svgs.append(ui.getSVG(fig))
        return svgs
        


try:
    # Configure log
    neuron_utils.configure_logging()

    logging.debug('Initialising NetPyNE')

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


    netpyne_geppetto = NetPyNEGeppetto()

except Exception as exception:
    logging.exception("Unexpected error in neuron_geppetto initialization:")
    logging.error(exception)
