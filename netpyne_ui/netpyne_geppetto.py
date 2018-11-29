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
from jupyter_geppetto import jupyter_geppetto, synchronization, utils
import imp
from contextlib import redirect_stdout, redirect_stderr


class NetPyNEGeppetto():

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

        self.netParams = specs.NetParams()
        self.simConfig = specs.SimConfig()
        synchronization.startSynchronization(self.__dict__)
        logging.debug("Initializing the original model")

        jupyter_geppetto.context = {'netpyne_geppetto': self}

    def getData(self):
        return {"metadata": metadata,
                "netParams": self.netParams.todict(),
                "simConfig": self.simConfig.todict(),
                "isDocker": os.path.isfile('/.dockerenv'),
                "currentFolder": os.getcwd()
        }

    def instantiateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not 'usePrevInst' in args or not args['usePrevInst']:
                    netpyne_model = self.instantiateNetPyNEModel()
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
                
                return json.loads(GeppettoModelSerializer().serialize(self.geppetto_model))
        except:
            return utils.getJSONError("Error while instantiating the NetPyNE model", sys.exc_info())
        
    def simulateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if args['parallelSimulation']: # TODO mpi is not finding  libmpi.dylib.. set LD_LIBRARY_PATH to openmpi bin folder, but nothing
                    logging.debug('Running parallel simulation')
                    if not 'usePrevInst' in args or not args['usePrevInst']:
                        self.netParams.save("netParams.json")
                        self.simConfig.saveJson = True
                        self.simConfig.save("simParams.json")
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
                    if cp.returncode!=0: return utils.getJSONError("Error while simulating the NetPyNE model", cp.stderr.decode())
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
                    
                return json.loads(GeppettoModelSerializer().serialize(self.geppetto_model))
        except:
            return utils.getJSONError("Error while simulating the NetPyNE model", sys.exc_info())

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
            return utils.getJSONError("Error while loading data", 'You have to select at least one option') 

        try:
            owd = os.getcwd()
            self.compileModMechFiles(args['compileMod'], args['modFolder'])
        except:
            return utils.getJSONError("Error while importing/compiling mods", sys.exc_info())
        finally:
            os.chdir(owd)
        
        try: 
            with redirect_stdout(sys.__stdout__):
                sim.initialize()
                wake_up_geppetto = False  
                if all([args[option] for option in ['loadNetParams', 'loadSimCfg', 'loadSimData', 'loadNet']]):
                    wake_up_geppetto = True
                    if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                    sim.initialize()
                    sim.loadAll(args['jsonModelFolder'])
                    self.netParams = sim.net.params
                    self.simConfig = sim.cfg
                    remove(self.netParams.todict())
                    remove(self.simConfig.todict())
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
                        self.simConfig = sim.cfg
                        remove(self.simConfig.todict())
                        
                    if args['loadNetParams']:
                        if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                        sim.loadNetParams(args['jsonModelFolder'])
                        self.netParams = sim.net.params
                        remove(self.netParams.todict())
                    
                if wake_up_geppetto:
                    section = list(sim.net.cells[0].secs.keys())[0]
                    if not 'pt3d' in list(sim.net.cells[0].secs[section].geom.keys()):
                        sim.net.defineCellShapes()
                        sim.gatherData()
                        sim.loadSimData(args['jsonModelFolder'])
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)

                    return json.loads(GeppettoModelSerializer().serialize(self.geppetto_model))
                else:
                    return utils.getJSONReply()
        except:
            return utils.getJSONError("Error while loading the NetPyNE model", sys.exc_info())
        
    def importModel(self, modelParameters):
        try:
            # Get Current dir
            owd = os.getcwd()
            
            self.compileModMechFiles(modelParameters['compileMod'], modelParameters['modFolder'])
            
            with redirect_stdout(sys.__stdout__):
                # NetParams
                netParamsPath = str(modelParameters["netParamsPath"])
                sys.path.append(netParamsPath)
                os.chdir(netParamsPath)
                # Import Module 
                netParamsModuleName = importlib.import_module(str(modelParameters["netParamsModuleName"]))
                # Import Model attributes
                self.netParams = getattr(netParamsModuleName, str(modelParameters["netParamsVariable"]))
                
                for key, value in self.netParams.cellParams.items():
                    if hasattr(value, 'todict'):
                        self.netParams.cellParams[key] = value.todict()
                
                # SimConfig
                simConfigPath = str(modelParameters["simConfigPath"])
                sys.path.append(simConfigPath)
                os.chdir(simConfigPath)
                # Import Module 
                simConfigModuleName = importlib.import_module(str(modelParameters["simConfigModuleName"]))
                # Import Model attributes
                self.simConfig = getattr(simConfigModuleName, str(modelParameters["simConfigVariable"]))

            return utils.getJSONReply()
        except:
            return utils.getJSONError("Error while importing the NetPyNE model", sys.exc_info())
        finally:
            os.chdir(owd)

    def importCellTemplate(self, modelParameters):
        try:
            with redirect_stdout(sys.__stdout__):
                rule = modelParameters["label"]
                # Get Current dir
                owd = os.getcwd()

                conds = {} if rule not in self.netParams.cellParams else self.netParams.cellParams[rule]['conds']

                self.compileModMechFiles(modelParameters["compileMod"], modelParameters["modFolder"])

                del modelParameters["modFolder"]
                del modelParameters["compileMod"]
                # import cell template
                self.netParams.importCellParams(**modelParameters, conds=conds)
                
                # convert fron netpyne.specs.dict to dict
                self.netParams.cellParams[rule] = self.netParams.cellParams[rule].todict()

                return utils.getJSONReply()
        except:
            return utils.getJSONError("Error while importing the NetPyNE cell template", sys.exc_info())
        finally:
            os.chdir(owd)
        
    def exportModel(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not args['netCells']:
                    sim.initialize(netParams = self.netParams, simConfig = self.simConfig)    
                sim.cfg.filename = args['fileName']
                include = [el for el in specs.SimConfig().saveDataInclude if el in args.keys() and args[el]]
                if args['netCells']: include += ['netPops']
                sim.cfg.saveJson = True
                sim.saveData(include)
                sim.cfg.saveJson = False
            return utils.getJSONReply()
        except:
            return utils.getJSONError("Error while exporting the NetPyNE model", sys.exc_info())
    
    def exportNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.exportNeuroML2(modelParams['fileName'], specs.SimConfig())
            return utils.getJSONReply()
        except:
            return utils.getJSONError("Error while exporting the NetPyNE model", sys.exc_info())
    
    def importNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.initialize()
                sim.importNeuroML2(modelParams['neuroMLFolder'], simConfig=specs.SimConfig(), simulate=False, analyze=False)
                self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
            return json.loads(GeppettoModelSerializer().serialize(self.geppetto_model))

        except:
            return utils.getJSONError("Error while exporting the NetPyNE model", sys.exc_info())

    def deleteModel(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):       
                self.netParams = specs.NetParams()
                self.simConfig = specs.SimConfig()
                self.netParams.todict()
                self.netParams.todict()
                if self.doIhaveInstOrSimData()['haveInstance']: sim.clearAll()
                self.geppetto_model = None
            return utils.getJSONReply()

        except:
            return utils.getJSONError("Error while exporting the NetPyNE model", sys.exc_info())
        
    def instantiateNetPyNEModel(self):
        with redirect_stdout(sys.__stdout__):
            saveData = sim.allSimData if hasattr(sim, 'allSimData') and 'spkt' in sim.allSimData.keys() and len(sim.allSimData['spkt'])>0 else False
            sim.create(self.netParams, self.simConfig)
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
        command =  'sim.rename(self.'+path+',"'+oldValue+'","'+newValue+'")'
        logging.debug('renaming '+command)
        eval(command)

        for model, synched_component in list(jupyter_geppetto.synched_models.items()):
            if model != '' and oldValue in model and path in model: # 
                jupyter_geppetto.synched_models.pop(model)
                newModel = re.sub("(['])(?:(?=(\\?))\2.)*?\1", lambda x:x.group(0).replace(oldValue,newValue, 1), model)
                logging.debug("Rename funct - Model is "+model+" newModel is "+newModel)
                jupyter_geppetto.synched_models[newModel]=synched_component
        with redirect_stdout(sys.__stdout__):
            if "popParams" in path:
                self.propagate_field_rename("pop", newValue, oldValue)
            elif "stimSourceParams" in path:
                self.propagate_field_rename("source", newValue, oldValue)
            elif "synMechParams" in path:
                self.propagate_field_rename("synMech", newValue, oldValue)
        
        return 1

    def getPlotSettings(self, plot):
        if self.simConfig.analysis and plot in self.simConfig.analysis:
            return self.simConfig.analysis[plot]
        return {}

    def getDirList(self, dir=None, onlyDirs = False, filterFiles=False):
        # Get Current dir
        if dir == None or dir == '':
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
        try:
            with redirect_stdout(sys.__stdout__):  
                args = self.getPlotSettings(plotName)
                if LFPflavour:
                    args['plots'] = [LFPflavour]
                figData = getattr(analysis, plotName)(showFig=False, **args)
                
                if isinstance(figData, tuple):
                    fig = figData[0]
                    if fig==-1:
                        return fig
                    elif isinstance(fig, list):
                        return [ui.getSVG(fig[0])]
                    elif isinstance(fig, dict):
                        svgs = []
                        for key, value in fig.items():
                            svgs.append(ui.getSVG(value))
                        return svgs
                    else:
                        return [ui.getSVG(fig)]
                else:
                    return figData
        except Exception as e:
            # TODO: Extract these two lines as a function and call it in every catch clause
            err = "There was an exception in %s():"%(function.__name__)
            logging.exception(("%s \n %s \n%s"%(err,e,sys.exc_info())))

    def getAvailablePops(self):
        return list(self.netParams.popParams.keys())

    def getAvailableCellModels(self):
        cellModels = set([])
        for p in self.netParams.popParams:
            if 'cellModel' in self.netParams.popParams[p]:
                cm = self.netParams.popParams[p]['cellModel']
                if cm not in cellModels:
                    cellModels.add(cm)
        return list(cellModels)
    
    def getAvailableCellTypes(self):
        cellTypes = set([])
        for p in self.netParams.popParams:
            if 'cellType' in self.netParams.popParams[p]:
                ct = self.netParams.popParams[p]['cellType']
                if ct not in cellTypes:
                    cellTypes.add(ct)
        return list(cellTypes)
    
    def getAvailableSections(self):
        sections = {}
        for cellRule in self.netParams.cellParams:
            sections[cellRule] = list(self.netParams.cellParams[cellRule]['secs'].keys())
        return sections
        
    def getAvailableStimSources(self):
        return list(self.netParams.stimSourceParams.keys())
    
    def getAvailableSynMech(self):
        return list(self.netParams.synMechParams.keys())
    
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

        return [plot for plot in plots if plot not in list(self.simConfig.analysis.keys())]

    def getInclude(self, model):
        with redirect_stdout(sys.__stdout__):
            if model in list(netpyne_geppetto.simConfig.analysis.keys()):
                if 'include' in list(netpyne_geppetto.simConfig.analysis[model].keys()):
                    return netpyne_geppetto.simConfig.analysis[model]['include']
                else:
                    return False
            else:
                return False

    def getGIDs(self):
        # pop sizes and gids returned in a dict
        out = {}
        with redirect_stdout(sys.__stdout__):
            for key in self.netParams.popParams.keys():
                if 'numCells' in self.netParams.popParams[key]:
                    out[key] = self.netParams.popParams[key]['numCells']
                else:
                    out[key] = 0

            out['gids'] = int(np.sum([v for k, v in list(out.items())]))

        return out
        
    def deleteParam(self, model, label):
        try:
            if isinstance(model, list): # just for cellParams
                if len(model)==1:
                    self.netParams.cellParams[model[0]]["secs"].pop(label)
                elif len(model)==2:
                    self.netParams.cellParams[model[0]]["secs"][model[1]]["mechs"].pop(label)
                else:
                    pass
            else:
                getattr(self.netParams, model).pop(label)
                if "popParams" in model:
                    self.propagate_field_rename("pop", None, label)
                elif "stimSourceParams" in model:
                    self.propagate_field_rename("source", None, label)
                elif "synMechParams" in model:
                    self.propagate_field_rename("synMech", None, label)
            return True
        except:
            return False

    def validateFunction(self, functionString):
        return validateFunction(functionString, self.netParams.__dict__)

    def exportHLS(self, args):
        def convert2bool(string):
            return string.replace('true', 'True').replace('false', 'False').replace('null', 'False')
            
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
                for attr, value in list(self.netParams.__dict__.items()):
                    if attr not in params:
                        if value!=getattr(specs.NetParams(), attr):
                            script.write('netParams.' + attr + ' = ')
                            script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                        
                script.write(header('network attributes'))
                for param in params:
                    for key, value in list(getattr(self.netParams, param).items()):
                        script.write("netParams." + param + "['" + key + "'] = ")
                        script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                
                script.write(header('network configuration'))
                for attr, value in list(self.simConfig.__dict__.items()):
                    if value!=getattr(specs.SimConfig(), attr):
                        script.write('simConfig.' + attr + ' = ')
                        script.write(convert2bool(json.dumps(value, indent=4))+'\n')
                
                script.write(header('create simulate analyze  network'))
                script.write('# sim.createSimulateAnalyze(netParams=netParams, simConfig=simConfig)\n')
                
                script.write(header('end script', spacer='='))
            
            return utils.getJSONReply()
        
        except:
            return utils.getJSONError("Error while importing the NetPyNE model", sys.exc_info())
            

    def propagate(self, model, label, cond, new, old):
        with redirect_stdout(sys.__stdout__):
            if model == 'analysis':
                analysis = getattr(self.simConfig, model)
                for plot in analysis.keys():
                    if cond in analysis[plot].keys():
                        for index, item in enumerate(analysis[plot][cond]):
                            if isinstance(item, str):
                                if item == old:
                                    if new == None:
                                        analysis[plot][cond].remove(item)
                                        break
                                    else:
                                        analysis[plot][cond][index] = new
                            else:
                                if isinstance(item[0], str):
                                    if item[0] == old:
                                        if new == None:
                                            analysis[plot][cond].pop(index)
                                            break
                                        else:
                                            analysis[plot][cond][index] = [new, item[1]]
            else:
                obj = getattr(self.netParams, model)
                for key in obj.keys():
                    if label in list(obj[key][cond].keys()):
                        if isinstance(obj[key][cond][label], str):
                            if old==obj[key][cond][label]:
                                if new=='' or new==None: 
                                    obj[key].pop(label) 
                                else: 
                                    obj[key][cond][label] = new
                        elif isinstance(obj[key][cond][label], list):
                            if old in obj[key][cond][label]:
                                if new=='' or new==None:
                                    obj[key][cond][label] = [ value for value in obj[key][cond][label] if value!=old]
                                else:
                                    obj[key][cond][label] = [ value if value!=old else new for value in obj[key][cond][label] ]
                            if len(obj[key][cond][label])==0:
                                obj[key][cond].pop(label)
                        else:
                            pass

    def propagate_field_rename(self, label, new, old):
        def unique(label=label, old=old):
            classes = []
            for p in self.netParams.popParams:
                if label in self.netParams.popParams[p]:
                    classes.append(self.netParams.popParams[p][label])
            if classes.count(old)>1:
                return False
            else:
                return True

        if label=='source':
            self.propagate_stim_source_rename(new, old)
            return True
        elif label=='synMech':
            self.propagate_syn_mech_rename(new, old)
            return True
        else:
            if unique():    
                for (model, cond) in [['cellParams','conds'], ['connParams', 'preConds'], ['connParams', 'postConds'], ['stimTargetParams', 'conds'], ['analysis', 'include'] ]: 
                    self.propagate(model, label, cond, new, old)
                return True
            else:
                return False

    def propagate_section_rename(self, new, old):
        for label in self.netParams.cellParams:
            if 'secs' in self.netParams.cellParams[label]:
                for sec in self.netParams.cellParams[label]['secs']:
                    if 'topol' in self.netParams.cellParams[label]['secs'][sec]:
                        if 'parentSec' in self.netParams.cellParams[label]['secs'][sec]['topol']:
                            if self.netParams.cellParams[label]['secs'][sec]['topol']['parentSec'] == old:
                                if new == None:
                                    self.netParams.cellParams[label]['secs'][sec]['topol'].pop('parentSec')
                                else:
                                    self.netParams.cellParams[label]['secs'][sec]['topol']['parentSec'] = new

    def propagate_stim_source_rename(self, new, old):
        for label in self.netParams.stimTargetParams:
            if old==self.netParams.stimTargetParams[label]['source']:
                if new==None:
                    self.netParams.stimTargetParams[label].pop('source')
                else:
                    self.netParams.stimTargetParams[label]['source'] = new
    
    def propagate_syn_mech_rename(self, new, old):
        for label in self.netParams.stimTargetParams:
            if 'source' in self.netParams.stimTargetParams[label]:
                if self.netParams.stimTargetParams[label]['source'] in self.netParams.stimSourceParams:
                    if 'type' in self.netParams.stimSourceParams[self.netParams.stimTargetParams[label]['source']]:
                        if self.netParams.stimSourceParams[self.netParams.stimTargetParams[label]['source']]['type']=='NetStim':        
                            if old==self.netParams.stimTargetParams[label]['synMech']:
                                if new==None:
                                    self.netParams.stimTargetParams[label].pop('synMech')
                                else:
                                    self.netParams.stimTargetParams[label]['synMech'] = new


logging.info("Initialising NetPyNE UI")
netpyne_geppetto = NetPyNEGeppetto()
logging.info("NetPyNE UI initialised")