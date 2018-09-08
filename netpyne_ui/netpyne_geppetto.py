"""
netpyne_geppetto.py
Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import io
import json
import os
import importlib
import sys
import subprocess
import logging
import threading
import traceback



from netpyne import specs, sim, analysis, utils
from netpyne.metadata import metadata, api
from netpyne_ui.netpyne_model_interpreter import NetPyNEModelInterpreter
from pygeppetto.model.model_serializer import GeppettoModelSerializer
import matplotlib.pyplot as plt
from pygeppetto import ui
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
import neuron
from shutil import copyfile
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync, GeppettoJupyterGUISync
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
import imp


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
            
            from . import netpyne_geppetto
            
            if modelParameters['importFormat']=='py':
                # NetParams
                netParamsPath = str(modelParameters["netParamsPath"])
                sys.path.append(netParamsPath)
                os.chdir(netParamsPath)
                # Import Module 
                netParamsModuleName = importlib.import_module(str(modelParameters["netParamsModuleName"]))
                # Import Model attributes
                netpyne_geppetto.netParams = getattr(netParamsModuleName, str(modelParameters["netParamsVariable"]))
                
                for key, value in netpyne_geppetto.netParams.cellParams.items():
                    if hasattr(value, 'todict'):
                        netpyne_geppetto.netParams.cellParams[key] = value.todict()
                
                # SimConfig
                simConfigPath = str(modelParameters["simConfigPath"])
                sys.path.append(simConfigPath)
                os.chdir(simConfigPath)
                # Import Module 
                simConfigModuleName = importlib.import_module(str(modelParameters["simConfigModuleName"]))
                # Import Model attributes
                netpyne_geppetto.simConfig = getattr(simConfigModuleName, str(modelParameters["simConfigVariable"]))
            
            elif modelParameters['importFormat']=='json':
                with open(modelParameters['jsonModelFolder'], 'r') as file:
                    jsonData = json.load(file)
                
                if 'net' in jsonData:
                    if 'params' in jsonData['net'] and 'simConfig' in jsonData:
                        netpyne_geppetto.netParams = specs.NetParams(jsonData['net']['params'])
                        netpyne_geppetto.simConfig = specs.SimConfig(jsonData['simConfig'])
                        netpyne_geppetto.netParams.cellParams = jsonData['net']['params']['cellParams']
                    else:
                        return self.getJSONError("Assertion error while importing the NetPyNE model", "The json file does not contain the following keys: [params, simConfig]")
                else:
                    return self.getJSONError("Assertion error while importing the NetPyNE model", "The json file does not contain the following keys: [net]")
            else: 
                return self.getJSONError("Assertion error while importing the NetPyNE model", "frontend sent a wrong option for 'importFormat'. allowed values are py and json")
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while importing the NetPyNE model",traceback.format_exc())
        finally:
            os.chdir(owd)

    def importCellTemplate(self, modelParameters, modFolder, compileMod):
        try:
            # Get Current dir
            owd = os.getcwd()

            from .netpyne_geppetto import netParams

            self.compileModMechFiles(compileMod, modFolder)

            # import cell template
            netParams.importCellParams(**modelParameters)
            
            # convert fron netpyne.specs.dict to dict
            rule = modelParameters["label"]
            netParams.cellParams[rule] = netParams.cellParams[rule].todict()

            return self.getJSONReply()
        except:
            return self.getJSONError("Error while importing the NetPyNE cell template",traceback.format_exc())
        finally:
            os.chdir(owd)
        
    def exportModel(self, modelParameters):
        try:
            sim.initialize (netParams = netParams, simConfig = simConfig)
            sim.saveData()
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while exporting the NetPyNE model",traceback.format_exc())

    def instantiateNetPyNEModel(self):
        import sys; imp.reload(sys)
        sim.initialize(netParams, simConfig)  # create network object and set cfg and net params
        sim.net.createPops()                  # instantiate network populations
        sim.net.createCells()                 # instantiate network cells based on defined populations
        sim.net.connectCells()                # create connections between cells based on params
        sim.net.addStims()                    # add external stimulation to cells (IClamps etc)
    
        sim.net.defineCellShapes()  # creates 3d pt for cells with stylized geometries
        sim.gatherData(gatherLFP=False)
        #sim.saveData()
        return sim

    def simulateNetPyNEModel(self):
        import sys; imp.reload(sys)
        sim.setupRecording() 
        sim.simulate()
        sim.saveData()
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
    
    def getPlot(self, plotName, LFPflavour):
        args = self.getPlotSettings(plotName)
        if LFPflavour:
            args['plots'] = [LFPflavour]
        fig = getattr(analysis, plotName)(showFig=False, **args)[0]
        if fig==-1:
            return fig
        elif isinstance(fig, list):
            return [ui.getSVG(fig[0])].__str__()
        elif isinstance(fig, dict):
            svgs = []
            for key, value in fig.items():
                logging.debug("Found plot for "+ key)
                svgs.append(ui.getSVG(value))
            return svgs.__str__()
        else:
            return [ui.getSVG(fig)].__str__()
        
    def getAvailablePops(self):
        return list(netParams.popParams.keys())

    def getAvailableCellModels(self):
        cellModels = set([])
        for p in netParams.popParams:
            if 'cellModel' in netParams.popParams[p]:
                cm = netParams.popParams[p]['cellModel']
                if cm not in cellModels:
                    cellModels.add(cm)
        return cellModels
    
    def getAvailableCellTypes(self):
        cellTypes = set([])
        for p in netParams.popParams:
            if 'cellType' in netParams.popParams[p]:
                ct = netParams.popParams[p]['cellType']
                if ct not in cellTypes:
                    cellTypes.add(ct)
        return cellTypes
    
    def getAvailableSections(self):
        sections = {}
        for cellRule in netParams.cellParams:
            sections[cellRule] = list(netParams.cellParams[cellRule]['secs'].keys())
        return sections
        
    def getAvailableStimSources(self):
        return list(netParams.stimSourceParams.keys())
    
    def getAvailableSynMech(self):
        return list(netParams.synMechParams.keys())
    
    def getAvailableMechs(self):
        mechs = utils.mechVarList()['mechs']
        for key in list(mechs.keys()):
            if 'ion' in key: del mechs[key]
        for key in ["morphology", "capacitance", "extracellular"]: del mechs[key]
        return list(mechs.keys())
    
    def getMechParams(self, mechanism):
        params = utils.mechVarList()['mechs'][mechanism]
        return [value[:-(len(mechanism) + 1)] for value in params]
        
    def getAvailablePlots(self):
        plots  = ["plotRaster", "plotSpikeHist", "plotSpikeStats","plotRatePSD", "plotTraces", "plotLFP", "plotShape", "plot2Dnet", "plotConn", "granger"]
        return [plot for plot in plots if plot not in list(simConfig.analysis.keys())]

    def deleteParam(self, paramToDel):
        logging.debug("Checking if netParams."+paramToDel+" is not null")
        if eval("netParams."+paramToDel) is not None:
            exec("del netParams.%s" % (paramToDel))
            logging.debug('Parameter netParams.'+paramToDel+' has been deleted')
        else:
            logging.debug('Parameter '+paramToDel+' is null, not deleted')
        
    def validateFunction(self, functionString):
        return utils.ValidateFunction(functionString, netParams.__dict__)
         
    def generateScript(self, metadata):
        def convert2bool(string):
            return string.replace('true', 'True').replace('false', 'False')
            
        def header(title, spacer='-'):
            return '\n# ' + title.upper() + ' ' + spacer*(77-len(title)) + '\n'
        
        try :
            params =  ['popParams' , 'cellParams', 'synMechParams']
            params += ['connParams', 'stimSourceParams', 'stimTargetParams']
            
            fname = metadata['scriptName'] if metadata['scriptName'][-3:]=='.py' else metadata['scriptName']+'.py'
            
            with open(fname, 'w') as script:
                script.write('from netpyne import specs, sim\n')
                script.write(header('documentation'))
                script.write("''' Script generated with NetPyNE-UI. Please visit:\n")
                script.write("    - https://www.netpyne.org\n    - https://github.com/MetaCell/NetPyNE-UI\n'''\n")
                script.write(header('script', spacer='='))
                script.write('netParams = specs.NetParams()\n')
                script.write('simConfig = specs.SimConfig()\n')
                script.write(header('single value attributes'))
                for attr, value in list(netParams.__dict__.items()):
                    if attr not in params:
                        if value!=getattr(specs.NetParams(), attr):
                            script.write('netParams.' + attr + ' = ')
                            script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                        
                script.write(header('network attributes'))
                for param in params:
                    for key, value in list(getattr(netParams, param).items()):
                        script.write("netParams." + param + "['" + key + "'] = ")
                        script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                
                script.write(header('network configuration'))
                for attr, value in list(simConfig.__dict__.items()):
                    if value!=getattr(specs.SimConfig(), attr):
                        script.write('netParams.' + attr + ' = ')
                        script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                
                script.write(header('create simulate analyze  network'))
                script.write('sim.createSimulateAnalyze(netParams=netParams, simConfig=simConfig)\n')
                
                script.write(header('end script', spacer='='))
            
            return self.getJSONReply()
        
        except:
            return self.getJSONError("Error while importing the NetPyNE model", traceback.format_exc())
            

G.createProject(name='NetPyNE Project')
netParams = specs.NetParams()
simConfig = specs.SimConfig()

GeppettoJupyterModelSync.current_model.original_model = json.dumps({'netParams': netParams.__dict__,
                                                                    'simConfig': simConfig.__dict__,
                                                                    'metadata': metadata.metadata,
                                                                    'requirement': 'from netpyne_ui.netpyne_geppetto import *',
                                                                    'isDocker': os.path.isfile('/.dockerenv'),
                                                                    'currentFolder': os.getcwd()})