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
import time
import traceback
import re

from netpyne import specs, sim, analysis
from netpyne.specs.utils import validateFunction
from netpyne.conversion.neuronPyHoc import mechVarList
from netpyne.metadata import metadata
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
import importlib as imp
from contextlib import redirect_stdout, redirect_stderr

class NetPyNEGeppetto():

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

    def instantiateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not 'usePrevInst' in args or not args['usePrevInst']:
                    netpyne_model = self.instantiateNetPyNEModel()
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
                
                return GeppettoModelSerializer().serialize(self.geppetto_model)
        except:
            return self.getJSONError("Error while instantiating the NetPyNE model",traceback.format_exc())
        
    def simulateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if args['parallelSimulation']: # TODO mpi is not finding  libmpi.dylib.. set LD_LIBRARY_PATH to openmpi bin folder, but nothing
                    logging.debug('Running parallel simulation')
                    if not 'usePrevInst' in args or not args['usePrevInst']:
                        netParams.save("netParams.json")
                        simConfig.saveJson = True
                        simConfig.save("simParams.json")
                        template = os.path.join(os.path.dirname(__file__), 'template.py')
                    else:
                        sim.cfg.saveJson = True
                        oldName = sim.cfg.filename
                        sim.cfg.filename = 'model_output'
                        sim.saveData()
                        sim.cfg.filename = oldName
                        template = os.path.join(os.path.dirname(__file__), 'template2.py')
                    copyfile(template, './init.py')
                    
                    cp = subprocess.run(["mpiexec", "-n", args['cores'], "nrniv", "-mpi", "-python", "init.py"], capture_output=True)
                    print(cp.stdout.decode()+cp.stderr.decode())
                    if cp.returncode!=0: return self.getJSONError("Error while simulating the NetPyNE model", cp.stderr.decode())
                    sim.load('model_output.json')
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
                    netpyne_model = sim
                    
                else: # single cpu computation
                    if not 'usePrevInst' in args or not args['usePrevInst']:
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
    
    def loadModel(self, args): # handles all data coming from a .json file (default file system for Netpyne)
        def remove(dictionary):
            # remove reserved keys such as __dict__, __Method__, etc 
            # they appear when we do sim.loadAll(json_file)
            if isinstance(dictionary, dict):
                for key, value in list(dictionary.items()):
                    if key.startswith('__'):
                        dictionary.pop(key)
                    else:
                        remove(value)

        if not any([args[option] for option in ['loadNetParams', 'loadSimCfg', 'loadSimData', 'loadNet']]):
            return self.getJSONError("Error while loading data", 'You have to select at least one option') 

        try:
            owd = os.getcwd()
            self.compileModMechFiles(args['compileMod'], args['modFolder'])
        except:
            return self.getJSONError("Error while importing/compiling mods",traceback.format_exc())
        finally:
            os.chdir(owd)
        
        try: 
            with redirect_stdout(sys.__stdout__):
                from . import netpyne_geppetto
                sim.initialize()
                wake_up_geppetto = False  
                if all([args[option] for option in ['loadNetParams', 'loadSimCfg', 'loadSimData', 'loadNet']]):
                    wake_up_geppetto = True
                    if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                    sim.initialize()
                    sim.loadAll(args['jsonModelFolder'])
                    netpyne_geppetto.netParams = sim.net.params
                    netpyne_geppetto.simConfig = sim.cfg
                    remove(netpyne_geppetto.netParams.todict())
                    remove(netpyne_geppetto.simConfig.todict())
                else:
                    if args['loadNet']:
                        wake_up_geppetto = True
                        if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                        sim.initialize()
                        sim.loadNet(args['jsonModelFolder'])

                    if args['loadSimData']: # TODO (https://github.com/Neurosim-lab/netpyne/issues/360)
                        wake_up_geppetto = True
                        if not self.doIhaveInstOrSimData()['haveInstance']: 
                            sim.create(specs.NetParams(), specs.SimConfig())
                            sim.net.defineCellShapes()
                            sim.gatherData(gatherLFP=False)
                        sim.loadSimData(args['jsonModelFolder'])
                        
                    if args['loadSimCfg']:
                        sim.loadSimCfg(args['jsonModelFolder'])
                        netpyne_geppetto.simConfig = sim.cfg
                        remove(netpyne_geppetto.simConfig.todict())
                        
                    if args['loadNetParams']:
                        if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                        sim.loadNetParams(args['jsonModelFolder'])
                        netpyne_geppetto.netParams = sim.net.params
                        remove(netpyne_geppetto.netParams.todict())
                    
                if wake_up_geppetto:
                    section = list(sim.net.cells[0].secs.keys())[0]
                    if not 'pt3d' in list(sim.net.cells[0].secs[section].geom.keys()):
                        sim.net.defineCellShapes()
                        sim.gatherData()
                        sim.loadSimData(args['jsonModelFolder'])
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)

                    return GeppettoModelSerializer().serialize(self.geppetto_model)
                else:
                    return self.getJSONReply()
        except:
            return self.getJSONError("Error while loading the NetPyNE model",traceback.format_exc())
        
    def importModel(self, modelParameters):
        try:
            # Get Current dir
            owd = os.getcwd()
            
            self.compileModMechFiles(modelParameters['compileMod'], modelParameters['modFolder'])
            
            from . import netpyne_geppetto

            with redirect_stdout(sys.__stdout__):
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
        
    def exportModel(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not args['netCells']:
                    sim.initialize(netParams = netParams, simConfig = simConfig)    
                sim.cfg.filename = args['fileName']
                include = [el for el in specs.SimConfig().saveDataInclude if el in args.keys() and args[el]]
                if args['netCells']: include += ['netPops']
                sim.cfg.saveJson = True
                sim.saveData(include)
                sim.cfg.saveJson = False
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while exporting the NetPyNE model",traceback.format_exc())
    
    def exportNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.exportNeuroML2(modelParams['fileName'], specs.SimConfig())
            return self.getJSONReply()
        except:
            return self.getJSONError("Error while exporting the NetPyNE model", traceback.format_exc())
    
    def importNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.initialize()
                sim.importNeuroML2(modelParams['neuroMLFolder'], simConfig=specs.SimConfig(), simulate=False, analyze=False)
                self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
            return GeppettoModelSerializer().serialize(self.geppetto_model)

        except:
            return self.getJSONError("Error while exporting the NetPyNE model",traceback.format_exc())

    def deleteModel(self, modelParams):
        try:
            from . import netpyne_geppetto
            with redirect_stdout(sys.__stdout__):       
                netpyne_geppetto.netParams = specs.NetParams()
                netpyne_geppetto.simConfig = specs.SimConfig()
                netpyne_geppetto.netParams.todict()
                netpyne_geppetto.netParams.todict()
                if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                self.geppetto_model = None
            return self.getJSONReply()

        except:
            return self.getJSONError("Error while exporting the NetPyNE model",traceback.format_exc())
    
    def create_docker_container(self, args):
        from subprocess import Popen
        
        with redirect_stdout(sys.__stdout__):
            try:
                # delete previous data
                subprocess.call(['rm', '-r', './GUIdocker'])
                subprocess.call(['mkdir', './GUIdocker'])
                subprocess.call(['mkdir', './GUIdocker/mod'])
                
                # copy dockerfile to build docker
                copyfile('./dockerfile_template', './GUIdocker/dockerfile')

                # generate netpyne script
                self.exportHLS({'fileName': './GUIdocker/init.py'})
                
                # create bash script
                script = 'docker build -t %s -f ./dockerfile .'%(args['label'])
                with open('./cmd.sh', 'w') as f: f.write(script)

                # copy mod folder
                if args['modFolder']!='':
                    subprocess.call(['cp', '-r', args['modFolder'], './GUIdocker'])

                # build docker
                with open('out.log', 'w') as stdout, open('err.log', 'w') as stderr:
                    Popen(['/bin/bash', '../cmd.sh'], stdout=stdout, stderr=stderr, cwd='./GUIdocker')

                return self.getJSONReply()
            except:
                return self.getJSONError("Error while exporting the NetPyNE model", traceback.format_exc())
        
    def instantiateNetPyNEModel(self):
        with redirect_stdout(sys.__stdout__):
            from . import netpyne_geppetto
            saveData = sim.allSimData if hasattr(sim, 'allSimData') and 'spkt' in sim.allSimData.keys() and len(sim.allSimData['spkt'])>0 else False
            sim.create(netpyne_geppetto.netParams, netpyne_geppetto.simConfig)
            sim.net.defineCellShapes()  # creates 3d pt for cells with stylized geometries
            sim.gatherData(gatherLFP=False)
            if saveData: sim.allSimData = saveData  # preserve data from previous simulation
        
        return sim

    def simulateNetPyNEModel(self):
        with redirect_stdout(sys.__stdout__):
            sim.setupRecording() 
            sim.simulate()
            sim.saveData()
        return sim
    
    def doIhaveInstOrSimData(self): # return [bool, bool] telling if we have an instance and simulated data
        with redirect_stdout(sys.__stdout__):
            out = [False, False]
            if hasattr(sim, 'net'):
                if hasattr(sim.net, 'cells') and hasattr(sim.net, 'pops'):
                    if len(sim.net.cells)>0 and len(sim.net.pops.keys())>0:
                        out[0] = True
            if hasattr(sim, 'allSimData'):
                if 'spkt' in sim.allSimData.keys() and 'spkid' in sim.allSimData.keys():
                    if len(sim.allSimData['spkt'])>0 and len(sim.allSimData['spkid'])>0:
                        out[1] = True
            
        return {'haveInstance': out[0], 'haveSimData': out[1]}

    def rename(self, path, oldValue,newValue):
        command =  'sim.rename('+path+',"'+oldValue+'","'+newValue+'")'
        logging.debug('renaming '+command)
        eval(command)
        for model, synched_component in list(GeppettoJupyterGUISync.synched_models.items()):
            if model != '' and oldValue in model and path in model: # 
                GeppettoJupyterGUISync.synched_models.pop(model)
                newModel = re.sub("(['])(?:(?=(\\?))\2.)*?\1", lambda x:x.group(0).replace(oldValue,newValue, 1), model)
                logging.debug("Rename funct - Model is "+model+" newModel is "+newModel)
                GeppettoJupyterGUISync.synched_models[newModel]=synched_component

    def getPlotSettings(self, plot):
        if simConfig.analysis and plot in simConfig.analysis:
            return simConfig.analysis[plot]
        return {}

    def getDirList(self, dir=None, onlyDirs = False, filterFiles=False):
        # Get Current dir
        if dir == None:
            dir = os.getcwd()
        dir_list = []
        for f in sorted(os.listdir(str(dir)), key=str.lower):
            ff=os.path.join(dir,f)
            if os.path.isdir(ff):
                dir_list.insert(0, {'title': f, 'path': ff, 'load': False, 'children': [{'title': 'Loading...'}]})
            elif not onlyDirs:
                if not filterFiles or os.path.isfile(ff) and ff.endswith(filterFiles):
                    dir_list.append({'title': f, 'path': ff})
        return dir_list
    
    def getPlot(self, plotName, LFPflavour):
        args = self.getPlotSettings(plotName)
        if LFPflavour:
            args['plots'] = [LFPflavour]
        content = getattr(analysis, plotName)(showFig=False, **args)
        
        if isinstance(content, int): 
            return content
        else:
            fig = content[0]

        if isinstance(fig, list):
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
        mechs = mechVarList()['mechs']
        for key in list(mechs.keys()):
            if 'ion' in key: del mechs[key]
        for key in ["morphology", "capacitance", "extracellular"]: del mechs[key]
        return list(mechs.keys())
    
    def getMechParams(self, mechanism):
        params = mechVarList()['mechs'][mechanism]
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
        return ValidateFunction(functionString, netParams.__dict__)
         
    def exportHLS(self, args):
        def convert2bool(string):
            return string.replace('true', 'True').replace('false', 'False')
            
        def header(title, spacer='-'):
            return '\n# ' + title.upper() + ' ' + spacer*(77-len(title)) + '\n'
        
        try :
            params =  ['popParams' , 'cellParams', 'synMechParams']
            params += ['connParams', 'stimSourceParams', 'stimTargetParams']
            
            fname = args['fileName'] if args['fileName'][-3:]=='.py' else args['fileName']+'.py'
            
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
    try:

        logging.debug('Global Message Handler')
        logging.debug('Command: ' +  command)
        logging.debug('Parameter: ' + str(parameters))
        if parameters == '':
            response = eval(command)
        else:
            response = eval(command + '(*parameters)')
        import sys
        imp.reload(sys)
        print(type(response))
        GeppettoJupyterModelSync.events_controller.triggerEvent(
            "receive_python_message", {'id': identifier, 'response': response.decode("utf-8") if isinstance(response, bytes) else response})
    except:
        response = netpyne_geppetto.getJSONError("Error while executing command "+command,traceback.format_exc())
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
                                                                    'metadata': metadata,
                                                                    'requirement': 'from netpyne_ui.netpyne_geppetto import *',
                                                                    'isDocker': os.path.isfile('/.dockerenv'),
                                                                    'currentFolder': os.getcwd()})
