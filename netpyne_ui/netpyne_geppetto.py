"""
netpyne_geppetto.py
Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import StringIO
import json
import os
import importlib
import sys
import subprocess
import logging
import threading
import time


from netpyne import specs, sim, analysis
from netpyne.metadata import metadata, api
from netpyne_model_interpreter import NetPyNEModelInterpreter
from model.model_serializer import GeppettoModelSerializer
import matplotlib.pyplot as plt
from model import ui
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
import neuron
from shutil import copyfile
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync, GeppettoJupyterGUISync
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G



class NetPyNEGeppetto():

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

    def instantiateNetPyNEModelInGeppetto(self):
        netpyne_model = self.instantiateNetPyNEModel()
        self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
        return GeppettoModelSerializer().serialize(self.geppetto_model)
        
    def simulateNetPyNEModelInGeppetto(self, modelParameters):

        if modelParameters['parallelSimulation']:
            logging.debug('Running parallel simulation')

            netParams.save("netParams.json")
            simConfig.saveJson = True
            simConfig.save("simParams.json")

            template = os.path.join(os.path.dirname(__file__), 'template.py')
            copyfile(template, 'init.py')

            subprocess.call(["mpiexec", "-n", modelParameters['cores'], "nrniv", "-python", "-mpi", "init.py"])

            sim.load('model_output.json')

            self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
            netpyne_model = sim
       
        else:
            if modelParameters['previousTab'] == 'define':
                logging.debug('Instantiating single thread simulation')
                netpyne_model = self.instantiateNetPyNEModel()
                self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
            
            logging.debug('Running single thread simulation')
            netpyne_model = self.simulateNetPyNEModel()
        
        return GeppettoModelSerializer().serialize(self.geppetto_model)


    def importModel(self, modelParameters):
       
        # Get Current dir
        owd = os.getcwd()
        
        #Create Symbolic link
        if modelParameters['compileMod']:
            modPath = os.path.join(modelParameters['modFolder'],"x86_64")
            subprocess.call(["rm", "-r", modPath])
            
            os.chdir(modelParameters["modFolder"])
            subprocess.call(["nrnivmodl"])
            
        # Load mechanism if mod path is passed
        if modelParameters['modFolder']:
            neuron.load_mechanisms(str(modelParameters["modFolder"] ))
        
        import netpyne_geppetto

        # NetParams
        netParamsPath = modelParameters["netParamsPath"]
        sys.path.append(netParamsPath)
        os.chdir(netParamsPath)
        # Import Module 
        netParamsModuleName = importlib.import_module(modelParameters["netParamsModuleName"])
        # Import Model attributes
        netpyne_geppetto.netParams = getattr(netParamsModuleName, modelParameters["netParamsVariable"])

        # SimConfig
        simConfigPath = modelParameters["simConfigPath"]
        sys.path.append(simConfigPath)
        os.chdir(simConfigPath)
        # Import Module 
        simConfigModuleName = importlib.import_module(modelParameters["simConfigModuleName"])
        # Import Model attributes
        netpyne_geppetto.simConfig = getattr(simConfigModuleName, modelParameters["simConfigVariable"])

        os.chdir(owd)
    
    def importCellTemplate(self, params):
        # Get Current dir
        owd = os.getcwd()
        
        #Create Symbolic link
        if params['compileMod']:
            modPath = os.path.join(params['modFolder'],"x86_64")
            subprocess.call(["rm", "-r", modPath])
            os.chdir(params["modFolder"])
            subprocess.call(["nrnivmodl"])
        del params['compileMod']
        
        # Load mechanism if mod path is passed
        if params['modFolder']:
            neuron.load_mechanisms(str(params['modFolder'] ))
        del params['modFolder']
        
        # import cell template
        netParams.importCellParams(**params)
        
        # delete conditions for this cell Rule
        netParams.cellParams[params['label']]['conds'] = {}
        
        os.chdir(owd)
        
    def exportModel(self, modelParameters):
        sim.initialize (netParams = netParams, simConfig = simConfig)
        sim.saveData()

    def instantiateNetPyNEModel(self):
        sim.create(netParams, simConfig)
        sim.net.defineCellShapes()  # creates 3d pt for cells with stylized geometries
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

    def getPlotSettings(self, plot):
        if simConfig.analysis and plot in simConfig.analysis:
            return simConfig.analysis[plot]
        return {}
            
    def getNetPyNE2DNetPlot(self):
        args = self.getPlotSettings('plot2Dnet')
        fig = analysis.plot2Dnet(showFig=False, **args)
        if fig==-1:
            return fig
        return ui.getSVG(fig)
    
    def getNetPyNEShapePlot(self):
        args = self.getPlotSettings('plotShape')
        fig = analysis.plotShape(showFig=False, **args)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNEConnectionsPlot(self):
        args = self.getPlotSettings('plotConn')
        fig = analysis.plotConn(showFig=False, **args)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNERasterPlot(self):
        args = self.getPlotSettings('plotRaster')
        fig = analysis.plotRaster(showFig=False, **args)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNETracesPlot(self):
        args = self.getPlotSettings('plotTraces')
        figs = analysis.plotTraces(showFig=False, **args)
        if figs==-1:
            return figs
        svgs = []
        for key, value in figs.iteritems():
            logging.debug("Found plot for "+ key)
            svgs.append(ui.getSVG(value))
        return svgs
    
    def getNetPyNESpikeHistPlot(self):
        args = self.getPlotSettings('plotSpikeHist')    
        fig = analysis.plotSpikeHist(showFig=False, **args)
        if fig==-1:
            return fig
        return ui.getSVG(fig)

    def getNetPyNESpikeStatsPlot(self):
        args = self.getPlotSettings('plotSpikeStats')
        fig = analysis.plotSpikeStats(showFig=False, **args)
        if fig==-1:
            return fig
        else:
            fig=fig[0]
        return ui.getSVG(fig)

    def getNetPyNEGrangerPlot(self):
        args = self.getPlotSettings('granger')
        fig = analysis.granger(plotFig=True, showFig=False, **args)
        if fig==-1:
            return fig
        else:
            fig=fig[-1]
        return ui.getSVG(fig)
    
    def getNetPyNERatePSDPlot(self):
        args = self.getPlotSettings('plotRatePSD')
        fig = analysis.plotRatePSD(showFig=False, **args)
        if fig==-1:
            return fig
        else:
            fig=fig[0]
        svgs = []
        svgs.append(ui.getSVG(fig))
        return svgs

    def getAvailablePops(self):
        return netParams.popParams.keys()

    def getAvailableCellModels(self):
        cellModels = set([])
        for p in netParams.popParams:
            cm = netParams.popParams[p]['cellModel']
            if cm not in cellModels:
                cellModels.add(cm)
        return cellModels
    
    def getAvailableCellTypes(self):
        cellTypes = set([])
        for p in netParams.popParams:
            ct = netParams.popParams[p]['cellType']
            if ct not in cellTypes:
                cellTypes.add(ct)
        return cellTypes

    def getAvailableStimSources(self):
        return netParams.stimSourceParams.keys()
    
    def getAvailableSynMech(self):
        return netParams.synMechParams.keys()
        
    def getAvailablePlots(self):
        plots  = ["plotRaster", "plotSpikeHist", "plotSpikeStats","plotRatePSD", "plotTraces", "plotLFP", "plotShape", "plot2Dnet", "plotConn", "granger"]
        return [plot for plot in plots if plot not in simConfig.analysis.keys()]

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
                        modelValue = eval(model)
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
    """
    TODO This code should move to a generic geppetto class since it's not NetPyNE specific
    """
    logging.debug('Global Message Handler')
    logging.debug('Command: ' +  command)
    logging.debug('Parameter: ' + str(parameters))
    if parameters == '':
        response = eval(command)
    else:
        response = eval(command + '(*parameters)')
    GeppettoJupyterModelSync.events_controller.triggerEvent(
        "receive_python_message", {'id': identifier, 'response': response})

def configure_logging():
        logger = logging.getLogger()
        fhandler = logging.FileHandler(filename='netpyne-ui.log', mode='a')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fhandler.setFormatter(formatter)
        logger.addHandler(fhandler)
        logger.setLevel(logging.DEBUG)
        logging.debug('Log configured')

def GeppettoInit():      
    try:
        # Configure log
        configure_logging()

        logging.debug('Initialising NetPyNE')

        # Reset any previous value
        logging.debug('Initialising Sync and Status Variables')
        GeppettoJupyterModelSync.current_project = None
        GeppettoJupyterModelSync.current_experiment = None
        GeppettoJupyterModelSync.current_model = None
        GeppettoJupyterModelSync.current_python_model = None
        GeppettoJupyterModelSync.events_controller = GeppettoJupyterModelSync.EventsSync()
        GeppettoJupyterModelSync.events_controller.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Global_message']], globalMessageHandler)

        G.createProject(name='NetPyNE Project')

        # Sync values when no sim is running
        logging.debug('Initialising Sync Mechanism for non-sim environment')
        timer = LoopTimer(0.3)
        timer.start()
        while not timer.started:
            time.sleep(0.001)
    except Exception as exception:
        logging.exception("Unexpected error while initializing Geppetto from Python:")
        logging.error(exception)


GeppettoInit()
netpyne_geppetto = NetPyNEGeppetto()
netParams = specs.NetParams()
simConfig = specs.SimConfig()

GeppettoJupyterModelSync.current_model.original_model = json.dumps({'netParams': netParams.__dict__,
                                                                    'simConfig': simConfig.__dict__,
                                                                    'metadata': metadata.metadata,
                                                                    'requirement': 'from netpyne_ui.netpyne_geppetto import *',
                                                                    'isDocker': os.path.isfile('/.dockerenv')})
