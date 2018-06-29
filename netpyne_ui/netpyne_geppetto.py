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
import traceback
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync, GeppettoJupyterGUISync
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G


from netpyne import specs, sim, analysis, utils
from netpyne.metadata import metadata, api
from netpyne_model_interpreter import NetPyNEModelInterpreter
from pygeppetto.model.model_serializer import GeppettoModelSerializer
import matplotlib.pyplot as plt
from pygeppetto import ui
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
import neuron
from shutil import copyfile


class NetPyNEGeppetto():

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

    def instantiateNetPyNEModelInGeppetto(self):
        try:
            netpyne_model = self.instantiateNetPyNEModel()
            self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
            return GeppettoModelSerializer().serialize(self.geppetto_model)
        except:
            return self.getJSONError("Error while instantiating the NetPyNE model",traceback.format_exc())
        
    def simulateNetPyNEModelInGeppetto(self, modelParameters):
        try:
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
        except:
            return self.getJSONError("Error while simulating the NetPyNE model",traceback.format_exc())

    def getJSONReply(self):
        data = {}
        data['type'] = 'OK'
        return json.dumps(data)

    def getJSONError(self, message, details):
        data = {}
        data['type'] = 'ERROR'
        data['message'] = message
        data['details'] = details
        return json.dumps(data)

    def compileModMechFiles(self, compileMod, modFolder):
        #Create Symbolic link
        if compileMod:
            modPath = os.path.join(str(modFolder),"x86_64")

            subprocess.call(["rm", "-r", modPath])
            
            os.chdir(modFolder)
            subprocess.call(["nrnivmodl"])
            
        # Load mechanism if mod path is passed
        if modFolder:
            neuron.load_mechanisms(str(modFolder))

    def importModel(self, modelParameters):
        try:
            # Get Current dir
            owd = os.getcwd()
            
            self.compileModMechFiles(modelParameters['compileMod'], modelParameters['modFolder'])
            
            import netpyne_geppetto
            # NetParams
            netParamsPath = str(modelParameters["netParamsPath"])
            sys.path.append(netParamsPath)
            os.chdir(netParamsPath)
            # Import Module 
            netParamsModuleName = importlib.import_module(str(modelParameters["netParamsModuleName"]))
            # Import Model attributes
            netpyne_geppetto.netParams = getattr(netParamsModuleName, str(modelParameters["netParamsVariable"]))

            # SimConfig
            simConfigPath = str(modelParameters["simConfigPath"])
            sys.path.append(simConfigPath)
            os.chdir(simConfigPath)
            # Import Module 
            simConfigModuleName = importlib.import_module(str(modelParameters["simConfigModuleName"]))
            # Import Model attributes
            netpyne_geppetto.simConfig = getattr(simConfigModuleName, str(modelParameters["simConfigVariable"]))

            os.chdir(owd)
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while importing the NetPyNE model",traceback.format_exc())
    
    def importCellTemplate(self, modelParameters, modFolder, compileMod):
        try:
            import netpyne_geppetto
            self.compileModMechFiles(compileMod, modFolder)

            # import cell template
            netParams.importCellParams(**modelParameters)
            
            netpyne_geppetto.netParams.cellParams[modelParameters['label']]['conds'] = {}
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while importing the NetPyNE cell template",traceback.format_exc())
        
    def exportModel(self, modelParameters):
        try:
            sim.initialize (netParams = netParams, simConfig = simConfig)
            sim.saveData()
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while exporting the NetPyNE model",traceback.format_exc())

    def instantiateNetPyNEModel(self):
        sim.create(netParams, simConfig)
        sim.net.defineCellShapes()  # creates 3d pt for cells with stylized geometries
        sim.gatherData(gatherLFP=False)
        #sim.saveData()
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

    def getDirList(self, dir=None, onlyDirs = False):
        # Get Current dir
        if dir == None:
            dir = os.getcwd()
        dir_list = []
        for f in sorted(os.listdir(str(dir)), key=str.lower):
           ff=os.path.join(dir,f)
           if os.path.isdir(ff):
               dir_list.insert(0, {'title': f, 'path': ff, 'load': False, 'children': [{'title': 'Loading...'}]})
           elif not onlyDirs:
               dir_list.append({'title': f, 'path': ff})
        return dir_list
            
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
        return svgs.__str__()
    
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
        return svgs.__str__()
        
    def getNetPyNELFPTimeSeriesPlot(self):
       args = self.getPlotSettings('plotLFP')
       args['plots'] = ['timeSeries']
       fig = analysis.plotLFP(showFig=False, **args)
       if fig==-1:
           return fig
       else:
            fig=fig[0]
       return ui.getSVG(fig)

    def getNetPyNELFPPSDPlot(self):
       args = self.getPlotSettings('plotLFP')
       args['plots'] = ['PSD']
       fig = analysis.plotLFP(showFig=False, **args)
       if fig==-1:
           return fig
       else:
            fig=fig[0]
       return ui.getSVG(fig)

    def getNetPyNELFPSpectrogramPlot(self):
       args = self.getPlotSettings('plotLFP')
       args['plots'] = ['spectrogram']
       fig = analysis.plotLFP(showFig=False, **args)
       if fig==-1:
           return fig
       else:
            fig=fig[0]
       return ui.getSVG(fig)

    def getNetPyNELFPLocationsPlot(self):
       args = self.getPlotSettings('plotLFP')
       args['plots'] = ['locations']
       fig = analysis.plotLFP(showFig=False, **args)
       if fig==-1:
           return fig
       else:
            fig=fig[0]
       return ui.getSVG(fig)

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
    
    def getAvailableMechs(self):
        mechs = utils.mechVarList()['mechs']
        for key in mechs.keys():
            if 'ion' in key: del mechs[key]
        for key in ["morphology", "capacitance", "extracellular"]: del mechs[key]
        return mechs.keys()
    
    def getMechParams(self, mechanism):
        params = utils.mechVarList()['mechs'][mechanism]
        return [value[:-(len(mechanism) + 1)] for value in params]
        
    def getAvailablePlots(self):
        plots  = ["plotRaster", "plotSpikeHist", "plotSpikeStats","plotRatePSD", "plotTraces", "plotLFP", "plotShape", "plot2Dnet", "plotConn", "granger"]
        return [plot for plot in plots if plot not in simConfig.analysis.keys()]

    def deleteParam(self, paramToDel):
        logging.debug("Checking if netParams."+paramToDel+" is not null")
        if eval("netParams."+paramToDel) is not None:
            exec("del netParams.%s" % (paramToDel))
            logging.debug('Parameter netParams.'+paramToDel+' has been deleted')
        else:
            logging.debug('Parameter '+paramToDel+' is null, not deleted')

G.createProject(name='NetPyNE Project')
netParams = specs.NetParams()
simConfig = specs.SimConfig()

GeppettoJupyterModelSync.current_model.original_model = json.dumps({'netParams': netParams.__dict__,
                                                                    'simConfig': simConfig.__dict__,
                                                                    'metadata': metadata.metadata,
                                                                    'requirement': 'from netpyne_ui.netpyne_geppetto import *',
                                                                    'isDocker': os.path.isfile('/.dockerenv'),
                                                                    'currentFolder': os.getcwd()})