"""
netpyne_geppetto.py

Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import dataclasses
import importlib
import json
import logging
import os
import pickle
import re
import sys
from shutil import copyfile, move

import matplotlib.pyplot as plt
import neuron
import numpy as np
from netpyne import specs, sim, analysis
from netpyne.conversion.neuronPyHoc import mechVarList
from netpyne.metadata import metadata
from netpyne.specs.utils import validateFunction
from netpyne.sim import utils as netpyne_utils

from netpyne_ui import experiments
from netpyne_ui import constants
from netpyne_ui import model
from netpyne_ui import simulations
from netpyne_ui.netpyne_model_interpreter import NetPyNEModelInterpreter
from netpyne_ui.simulations import InvalidConfigError
from pygeppetto.model.model_serializer import GeppettoModelSerializer
from pygeppetto import ui
from jupyter_geppetto import jupyter_geppetto, synchronization, utils
from contextlib import redirect_stdout
from netpyne_ui.constants import NETPYNE_WORKDIR_PATH, NUM_CONN_LIMIT
from netpyne_ui.mod_utils import compileModMechFiles

os.chdir(constants.NETPYNE_WORKDIR_PATH)

neuron.nrn_dll_loaded.append(os.path.join(NETPYNE_WORKDIR_PATH, 'mod'))  # Avoids to load workspace modfiles twice


class NetPyNEGeppetto:

    def __init__(self):
        self.model_interpreter = NetPyNEModelInterpreter()

        # Geppetto model of a created network
        self.geppetto_model = None

        self.netParams = specs.NetParams()
        self.simConfig = specs.SimConfig()
        self.run_config = model.RunConfig()

        self.experiments = experiments

        model.register(metadata)

        synchronization.startSynchronization(self.__dict__)
        logging.debug("Initializing the original model")

        jupyter_geppetto.context = {'netpyne_geppetto': self}

    def getModelAsJson(self):
        # TODO: netpyne should offer a method asJSON (based on saveJSON)
        #  that returns the JSON model without dumping to to disk.
        obj = netpyne_utils.replaceFuncObj(self.netParams.__dict__)
        obj = netpyne_utils.replaceDictODict(obj)
        return obj

    def getData(self):
        return {
            "metadata": metadata,
            "netParams": self.netParams.todict(),
            "simConfig": self.simConfig.todict(),
            "isDocker": os.path.isfile('/.dockerenv'),
            "currentFolder": os.getcwd(),
            "tuts": self.find_tutorials()
        }

    def getSimulations(self):
        return simulations.local.list()

    def stop(self):
        simulations.local.stop()
        return "stopped simulation"

    def find_tutorials(self):
        from os import listdir
        from os.path import isfile, join
        only_files = [f for f in listdir(constants.NETPYNE_WORKDIR_PATH) if
                      isfile(join(constants.NETPYNE_WORKDIR_PATH, f))]

        def _filter(_file):
            return '.py' in _file and 'tut' in _file and 'gui' in _file

        return list(filter(_filter, only_files))

    def instantiateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not args.get("usePrevInst", False):
                    netpyne_model = self.instantiateNetPyNEModel()
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)

                return json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
        except Exception:
            message = "Error while instantiating the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def simulateNetPyNEModelInGeppetto(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if args.get("complete", None):
                    if simulations.local.is_running():
                        return utils.getJSONError("Simulation is already running", "")

                    try:
                        # TODO: Use the selected experiment
                        experiment = model.Experiment(name="Test")
                        working_directory = self._prepare_batch_files(experiment)
                    except OSError:
                        return utils.getJSONError("The specified folder already exists", "")

                    try:
                        simulations.run(
                            platform="local",
                            parallel=self.run_config.parallel,
                            cores=self.run_config.cores,
                            method=self.run_config.type,
                            batch=True,
                            asynchronous=self.run_config.asynchronous,
                            working_directory=working_directory
                        )
                    except InvalidConfigError as e:
                        return utils.getJSONError(str(e), "")

                    message = "Experiment started in background! " \
                              f"Results will be stored in your workspace at ./{self.batch_config.name}"

                    return utils.getJSONError(message, "")
                else:
                    if self.run_config.asynchronous or self.run_config.parallel:
                        if simulations.local.is_running():
                            return utils.getJSONError("Simulation is already running", "")

                        self._prepare_simulation_files(args)
                        simulations.run(
                            parallel=self.run_config.parallel,
                            cores=self.run_config.cores,
                            asynchronous=self.run_config.asynchronous
                        )

                        if not self.run_config.asynchronous:
                            sim.load(f'{constants.MODEL_OUTPUT_FILENAME}.json')
                            self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)

                    else:
                        if not args.get('usePrevInst', False):
                            logging.debug('Instantiating single thread simulation')
                            netpyne_model = self.instantiateNetPyNEModel()

                            self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
                        simulations.run()

                if self.geppetto_model:
                    response = json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
                    return response

        except Exception:
            message = "Error while simulating the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def _prepare_simulation_files(self, args):
        if args.get('usePrevInst', False):
            sim.cfg.saveJson = True
            oldName = sim.cfg.filename
            sim.cfg.filename = constants.MODEL_OUTPUT_FILENAME

            # workaround for issue with empty LFP dict when calling saveData()
            if 'LFP' in sim.allSimData:
                del sim.allSimData['LFP']

            sim.saveData()
            sim.cfg.filename = oldName
            template_name = "run_instantiated_net.py"
        else:
            # Saved in netpyne_workspace
            self.netParams.save("netParams.json")
            self.simConfig.saveJson = True
            self.simConfig.save("simParams.json")
            template_name = "run.py"

        template = os.path.join(os.path.dirname(__file__), "templates", template_name)
        copyfile(template, f'./{constants.SIMULATION_SCRIPT_NAME}')

    def _prepare_batch_files(self, experiment):
        self.simConfig.mapping = [dataclasses.asdict(p) for p in experiment.params]

        for param in experiment.params:
            if param.type == "range":
                param.values = list(np.arange(param.min, param.max, param.step))

        config_dict = dataclasses.asdict(experiment)
        config_dict["runCfg"] = dataclasses.asdict(self.run_config)

        save_folder_path = os.path.join(constants.BATCHES_FOLDER, experiment.name)
        try:
            os.makedirs(save_folder_path)
        except OSError:
            raise

        os.path.join(os.path.dirname(__file__), "templates", "batchConfig.json")

        # Configuration of batch.py in json format
        batch_config_json = os.path.join(os.path.dirname(__file__), "templates", "batchConfig.json")
        json.dump(config_dict, open(batch_config_json, 'w'))
        move(batch_config_json, os.path.join(save_folder_path, 'batchConfig.json'))

        # Pickle files of netParams and cfg dicts
        net_params_pkl = os.path.join(os.path.dirname(__file__), "templates", 'netParams.pkl')
        cfg_pkl = os.path.join(os.path.dirname(__file__), "templates", 'cfg.pkl')
        pickle.dump(self.netParams, open(net_params_pkl, "wb"))
        pickle.dump(self.simConfig, open(cfg_pkl, "wb"))
        move(net_params_pkl, os.path.join(save_folder_path, 'netParams.pkl'))
        move(cfg_pkl, os.path.join(save_folder_path, 'cfg.pkl'))

        # Python template files
        template_single_run = os.path.join(os.path.dirname(__file__), "templates", 'batch_run_single.py')
        template_batch = os.path.join(os.path.dirname(__file__), "templates", 'batch.py')
        cfg = os.path.join(os.path.dirname(__file__), "templates", 'batch_cfg.py')
        net_params = os.path.join(os.path.dirname(__file__), "templates", 'batch_netParams.py')

        copyfile(template_single_run, os.path.join(save_folder_path, 'run.py'))
        copyfile(template_batch, os.path.join(save_folder_path, constants.SIMULATION_SCRIPT_NAME))
        copyfile(cfg, os.path.join(save_folder_path, 'cfg.py'))
        copyfile(net_params, os.path.join(save_folder_path, 'netParams.py'))

        return save_folder_path

    def loadModel(self, args):
        """ Imports a model stored as file in json format.

        :param args:
        :return:
        """

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
            compileModMechFiles(args['compileMod'], args['modFolder'])
        except Exception:
            message = "Error while importing/compiling mods"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())
        finally:
            os.chdir(owd)

        try:
            with redirect_stdout(sys.__stdout__):
                sim.initialize()
                wake_up_geppetto = False
                if all([args[option] for option in ['loadNetParams', 'loadSimCfg', 'loadSimData', 'loadNet']]):
                    wake_up_geppetto = True
                    if self.doIhaveInstOrSimData()['haveInstance']:
                        sim.clearAll()
                    sim.initialize()
                    sim.loadAll(args['jsonModelFolder'])
                    self.netParams = sim.net.params
                    self.simConfig = sim.cfg
                    remove(self.netParams.todict())
                    remove(self.simConfig.todict())
                else:
                    if args['loadNet']:
                        wake_up_geppetto = True
                        if self.doIhaveInstOrSimData()['haveInstance']:
                            sim.clearAll()
                        sim.initialize()
                        sim.loadNet(args['jsonModelFolder'])

                    # TODO (https://github.com/Neurosim-lab/netpyne/issues/360)
                    if args['loadSimData']:
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
                        if self.doIhaveInstOrSimData()['haveInstance']:
                            sim.clearAll()
                        sim.loadNetParams(args['jsonModelFolder'])
                        self.netParams = sim.net.params
                        remove(self.netParams.todict())

                if wake_up_geppetto:
                    if len(sim.net.cells) > 0:
                        section = list(sim.net.cells[0].secs.keys())[0]
                        if 'pt3d' not in list(sim.net.cells[0].secs[section].geom.keys()):
                            sim.net.defineCellShapes()
                            sim.gatherData()
                            sim.loadSimData(args['jsonModelFolder'])

                    sim.gatherData()
                    self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
                    return json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
                else:
                    return utils.getJSONReply()
        except Exception:
            message = "Error while loading the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def importModel(self, modelParameters):
        """ Imports a model stored in form of Python files.

        :param modelParameters:
        :return:
        """
        if self.doIhaveInstOrSimData()['haveInstance']:
            # TODO: this must be integrated into the general lifecycle of "model change -> simulate"
            #   Shouldn't be specific to Import
            sim.clearAll()

        try:
            # Get Current dir
            owd = os.getcwd()

            compileModMechFiles(modelParameters['compileMod'], modelParameters['modFolder'])

            with redirect_stdout(sys.__stdout__):
                # NetParams
                net_params_path = str(modelParameters["netParamsPath"])
                sys.path.append(net_params_path)
                os.chdir(net_params_path)
                # Import Module
                net_params_module_name = importlib.import_module(str(modelParameters["netParamsModuleName"]))
                # Import Model attributes
                self.netParams = getattr(net_params_module_name, str(modelParameters["netParamsVariable"]))

                for key, value in self.netParams.cellParams.items():
                    if hasattr(value, 'todict'):
                        self.netParams.cellParams[key] = value.todict()

                # SimConfig
                sim_config_path = str(modelParameters["simConfigPath"])
                sys.path.append(sim_config_path)
                os.chdir(sim_config_path)
                # Import Module
                sim_config_module_name = importlib.import_module(str(modelParameters["simConfigModuleName"]))
                # Import Model attributes
                self.simConfig = getattr(sim_config_module_name, str(modelParameters["simConfigVariable"]))

                # TODO: when should sim.initialize be called?
                #   Only on import or better before every simulation or network instantiation?
                sim.initialize()
            return utils.getJSONReply()
        except Exception:
            message = "Error while importing the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())
        finally:
            os.chdir(owd)

    def importCellTemplate(self, modelParameters):
        try:
            with redirect_stdout(sys.__stdout__):
                rule = modelParameters["label"]
                # Get Current dir
                owd = os.getcwd()

                conds = {} if rule not in self.netParams.cellParams else self.netParams.cellParams[rule]['conds']

                compileModMechFiles(modelParameters["compileMod"], modelParameters["modFolder"])

                del modelParameters["modFolder"]
                del modelParameters["compileMod"]
                # import cell template
                self.netParams.importCellParams(**modelParameters, conds=conds)

                # convert fron netpyne.specs.dict to dict
                self.netParams.cellParams[rule] = self.netParams.cellParams[rule].todict()

                return utils.getJSONReply()
        except Exception:
            message = "Error while importing the NetPyNE cell template"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())
        finally:
            os.chdir(owd)

    def exportModel(self, args):
        try:
            with redirect_stdout(sys.__stdout__):
                if not args['netCells']:
                    sim.initialize(netParams=self.netParams, simConfig=self.simConfig)
                sim.cfg.filename = args['fileName']
                include = [el for el in specs.SimConfig().saveDataInclude if el in args.keys() and args[el]]
                if args['netCells']: include += ['netPops']
                sim.cfg.saveJson = True
                sim.saveData(include)
                sim.cfg.saveJson = False

                with open(f"{sim.cfg.filename}.json") as json_file:
                    data = json.load(json_file)
                    return data

        except Exception:
            message = "Error while exporting the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def exportNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.exportNeuroML2(modelParams['fileName'], specs.SimConfig())
            return utils.getJSONReply()
        except Exception:
            message = "Error while exporting the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def importNeuroML(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                sim.initialize()
                sim.importNeuroML2(modelParams['neuroMLFolder'], simConfig=specs.SimConfig(), simulate=False,
                                   analyze=False)
                self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
            return json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))

        except Exception:
            message = "Error while exporting the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def deleteModel(self, modelParams):
        try:
            with redirect_stdout(sys.__stdout__):
                self.netParams = specs.NetParams()
                self.simConfig = specs.SimConfig()
                sim.initialize(specs.NetParams(), specs.SimConfig())
                self.geppetto_model = None
        except Exception:
            message = "Error while exporting the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

        try:
            # This function fails is some keys don't exists
            # sim.clearAll()
            # TODO: as part of #264 we should remove the method and use clearAll intstead
            self.clearSim()
        except Exception:
            logging.exception("Error while clearing simulation")

        return utils.getJSONReply()

    def instantiateNetPyNEModel(self):
        with redirect_stdout(sys.__stdout__):
            saveData = sim.allSimData if hasattr(sim, 'allSimData') and 'spkt' in sim.allSimData.keys() and len(
                sim.allSimData['spkt']) > 0 else False

            sim.create(self.netParams, self.simConfig)
            sim.net.defineCellShapes()  # creates 3d pt for cells with stylized geometries
            sim.gatherData(gatherLFP=False)

            if saveData:
                sim.allSimData = saveData  # preserve data from previous simulation

        return sim

    def doIhaveInstOrSimData(self):
        """ Telling if we have an instance or simulated data.

        return [bool, bool]
        """
        with redirect_stdout(sys.__stdout__):
            out = [False, False]
            if hasattr(sim, 'net'):
                if hasattr(sim.net, 'cells') and hasattr(sim.net, 'pops'):
                    if len(sim.net.cells) > 0 and len(sim.net.pops.keys()) > 0:
                        out[0] = True
            if hasattr(sim, 'allSimData'):
                if 'spkt' in sim.allSimData.keys() and 'spkid' in sim.allSimData.keys():
                    if len(sim.allSimData['spkt']) > 0 and len(sim.allSimData['spkid']) > 0:
                        out[1] = True

        return {'haveInstance': out[0], 'haveSimData': out[1]}

    def rename(self, path, oldValue, newValue):
        command = 'sim.rename(self.' + path + ',"' + oldValue + '","' + newValue + '")'
        logging.debug('renaming ' + command)

        eval(command)

        for model, synched_component in list(jupyter_geppetto.synched_models.items()):
            if model != '' and oldValue in model and path in model:  #
                jupyter_geppetto.synched_models.pop(model)
                new_model = re.sub("(['])(?:(?=(\\?))\2.)*?\1",
                                   lambda x: x.group(0).replace(oldValue, newValue, 1),
                                   model)
                logging.debug("Rename funct - Model is " + model + " newModel is " + new_model)
                jupyter_geppetto.synched_models[new_model] = synched_component

        with redirect_stdout(sys.__stdout__):
            if "popParams" in path:
                self.propagate_field_rename("pop", newValue, oldValue)
            elif "stimSourceParams" in path:
                self.propagate_field_rename("source", newValue, oldValue)
            elif "synMechParams" in path:
                self.propagate_field_rename("synMech", newValue, oldValue)

        return 1

    def getPlotSettings(self, plot_name):
        if self.simConfig.analysis and plot_name in self.simConfig.analysis:
            return self.simConfig.analysis[plot_name]
        return {}

    def getDirList(self, dir=None, onlyDirs=False, filterFiles=False):
        # Get Current dir
        if dir is None or dir == '':
            dir = os.path.join(os.getcwd(), constants.NETPYNE_WORKDIR_PATH)
        dir_list = []
        file_list = []
        for f in sorted(os.listdir(str(dir)), key=str.lower):
            ff = os.path.join(dir, f)
            if os.path.isdir(ff):
                dir_list.append({'title': f, 'path': ff, 'load': False, 'children': [{'title': 'Loading...'}]})
            elif not onlyDirs:
                if not filterFiles or os.path.isfile(ff) and ff.endswith(filterFiles):
                    file_list.append({'title': f, 'path': ff})
        return dir_list + file_list

    def checkAvailablePlots(self):
        return analysis.checkAvailablePlots()

    def getPlot(self, plotName, LFPflavour, theme='gui'):
        try:
            with redirect_stdout(sys.__stdout__):
                args = self.getPlotSettings(plotName)
                if LFPflavour:
                    args['plots'] = [LFPflavour]

                args['showFig'] = False

                if plotName.startswith('iplot'):
                    # This arg brings dark theme. But some plots are broken by it
                    args['theme'] = theme

                    if plotName in ("iplotConn", "iplot2Dnet") and sim.net.allCells:
                        # To prevent unresponsive kernel, we don't show conns if they become too many
                        num_conn = sum([len(cell.conns) for cell in sim.net.allCells if cell.conns])
                        if num_conn > NUM_CONN_LIMIT:
                            args["showConns"] = False

                    html = getattr(analysis, plotName)(**args)
                    if not html or html == -1:
                        return ""

                    # some plots return "fig", some return "(fig, data)"
                    if plotName in ('iplotRaster', 'iplotRxDConcentration', 'iplot2Dnet'):
                        html = html[0]

                    return html

                else:
                    fig_data = getattr(analysis, plotName)(**args)
                    if isinstance(fig_data, tuple):
                        fig = fig_data[0]
                        if fig == -1:
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
                        return fig_data
        except Exception as e:
            err = "There was an exception in %s():" % (e.plotName)
            logging.exception(("%s \n %s \n%s" % (err, e, sys.exc_info())))

    def getAvailablePops(self):
        return list(self.netParams.popParams.keys())

    def getAvailableCellModels(self):
        cell_models = set([])
        for p in self.netParams.popParams:
            if 'cellModel' in self.netParams.popParams[p]:
                cm = self.netParams.popParams[p]['cellModel']
                if cm not in cell_models:
                    cell_models.add(cm)
        return list(cell_models)

    def getAvailableCellTypes(self):
        cell_types = set([])
        for p in self.netParams.cellParams:
            cell_types.add(p)
        return list(cell_types)

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
        plots = [
            "iplotRaster",
            "iplotSpikeHist",
            "plotSpikeStats",
            "iplotRatePSD",
            "iplotTraces",
            "iplotLFP",
            "plotShape",
            "plot2Dnet",
            "iplotConn",
            "granger"
        ]

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
            if isinstance(model, list):  # just for cellParams
                if len(model) == 1:
                    self.netParams.cellParams[model[0]]["secs"].pop(label)
                elif len(model) == 2:
                    self.netParams.cellParams[model[0]]["secs"][model[1]]["mechs"].pop(label)
                else:
                    pass
            else:
                # remove rule
                rule = getattr(self.netParams, model).pop(label)

                # side effect on other rules
                if "popParams" in model:
                    self.propagate_field_rename("pop", None, label)
                    self.propagate_field_rename("cellModel", None, rule['cellModel'])
                    self.propagate_field_rename("cellType", None, rule['cellType'])

                elif "stimSourceParams" in model:

                    self.propagate_field_rename("source", None, label)
                elif "synMechParams" in model:
                    self.propagate_field_rename("synMech", None, label)
            return True
        except Exception:
            logging.exception(f"Error while deleting parameter: {label}")
            return False

    def validateFunction(self, functionString):
        if isinstance(functionString, (float, int)):
            return True
        return validateFunction(functionString, self.netParams.__dict__)

    def exportHLS(self, args):
        def convert2bool(string):
            return string.replace('true', 'True').replace('false', 'False').replace('null', 'False')

        def header(title, spacer='-'):
            return '\n# ' + title.upper() + ' ' + spacer * (77 - len(title)) + '\n'

        try:
            params = ['popParams', 'cellParams', 'synMechParams']
            params += ['connParams', 'stimSourceParams', 'stimTargetParams']

            fname = args['fileName'] if args['fileName'][-3:] == '.py' else args['fileName'] + '.py'

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
                        if value != getattr(specs.NetParams(), attr):
                            script.write('netParams.' + attr + ' = ')
                            script.write(convert2bool(json.dumps(value, indent=4)) + '\n')

                script.write(header('network attributes'))
                for param in params:
                    for key, value in list(getattr(self.netParams, param).items()):
                        script.write("netParams." + param + "['" + key + "'] = ")
                        script.write(convert2bool(json.dumps(value, indent=4)) + '\n')

                script.write(header('network configuration'))
                for attr, value in list(self.simConfig.__dict__.items()):
                    if value != getattr(specs.SimConfig(), attr):
                        script.write('simConfig.' + attr + ' = ')
                        script.write(convert2bool(json.dumps(value, indent=4)) + '\n')

                script.write(header('create simulate analyze  network'))
                script.write('# sim.createSimulateAnalyze(netParams=netParams, simConfig=simConfig)\n')

                script.write(header('end script', spacer='='))

            with open(fname) as f:
                return f.read()

        except Exception:
            message = "Error while exporting NetPyNE model to python"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

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
                            if old == obj[key][cond][label]:
                                if new == '' or new == None:
                                    obj[key].pop(label)
                                else:
                                    obj[key][cond][label] = new
                        elif isinstance(obj[key][cond][label], list):
                            if old in obj[key][cond][label]:
                                if new == '' or new == None:
                                    obj[key][cond][label] = [value for value in obj[key][cond][label] if value != old]
                                else:
                                    obj[key][cond][label] = [value if value != old else new for value in
                                                             obj[key][cond][label]]
                            if len(obj[key][cond][label]) == 0:
                                obj[key][cond].pop(label)
                        else:
                            pass

    def propagate_field_rename(self, label, new, old):
        def unique(label=label, old=old):
            classes = []
            for p in self.netParams.popParams:
                if label in self.netParams.popParams[p]:
                    classes.append(self.netParams.popParams[p][label])
            if classes.count(old) > 0:
                return False
            else:
                return True

        if label == 'source':
            self.propagate_stim_source_rename(new, old)
            return True
        elif label == 'synMech':
            self.propagate_syn_mech_rename(new, old)
            return True
        else:
            if unique():
                for (model, cond) in [['cellParams', 'conds'], ['connParams', 'preConds'], ['connParams', 'postConds'],
                                      ['stimTargetParams', 'conds'], ['analysis', 'include']]:
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
            if old == self.netParams.stimTargetParams[label]['source']:
                if new == None:
                    self.netParams.stimTargetParams[label].pop('source')
                else:
                    self.netParams.stimTargetParams[label]['source'] = new

    def propagate_syn_mech_rename(self, new, old):
        for label in self.netParams.stimTargetParams:
            if 'source' in self.netParams.stimTargetParams[label]:
                if self.netParams.stimTargetParams[label]['source'] in self.netParams.stimSourceParams:
                    if 'type' in self.netParams.stimSourceParams[self.netParams.stimTargetParams[label]['source']]:
                        if self.netParams.stimSourceParams[self.netParams.stimTargetParams[label]['source']][
                            'type'] == 'NetStim':
                            if old == self.netParams.stimTargetParams[label]['synMech']:
                                if new is None:
                                    self.netParams.stimTargetParams[label].pop('synMech')
                                else:
                                    self.netParams.stimTargetParams[label]['synMech'] = new

    def clearSim(self):
        # clean up
        sim.pc.barrier()
        sim.pc.gid_clear()  # clear previous gid settings

        # clean cells and simData in all nodes
        sim.clearObj([cell.__dict__ if hasattr(cell, '__dict__') else cell for cell in sim.net.cells])
        if 'stims' in list(sim.simData.keys()):
            sim.clearObj([stim for stim in sim.simData['stims']])

        for key in list(sim.simData.keys()): del sim.simData[key]

        if hasattr(sim, 'net'):
            for c in sim.net.cells: del c
            for p in sim.net.pops: del p
            if hasattr(sim.net, 'params'):
                del sim.net.params

        # clean cells and simData gathered in master node
        if sim.rank == 0:
            if hasattr(sim.net, 'allCells'):
                sim.clearObj([cell.__dict__ if hasattr(cell, '__dict__') else cell for cell in sim.net.allCells])
            if hasattr(sim, 'allSimData'):
                if 'stims' in list(sim.allSimData.keys()):
                    sim.clearObj([stim for stim in sim.allSimData['stims']])
                for key in list(sim.allSimData.keys()): del sim.allSimData[key]
                del sim.allSimData

            import matplotlib
            matplotlib.pyplot.clf()
            matplotlib.pyplot.close('all')

        if hasattr(sim, 'net'):
            if hasattr(sim.net, 'allCells'):
                for c in sim.net.allCells: del c
                del sim.net.allCells
            if hasattr(sim.net, 'allPops'):
                for p in sim.net.allPops: del p

            del sim.net

        import gc
        gc.collect()

    def create_celltype_from_template(self, label="CellType", conds={}, cell_template_name="Blank"):
        try:
            with redirect_stdout(sys.__stdout__):
                self.netParams.addCellParamsTemplate(label=label, template=cell_template_name)
            return True
        except Exception:
            message = f"Error while creating cellType from template {cell_template_name}"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())


logging.info("Initialising NetPyNE UI")
netpyne_geppetto = NetPyNEGeppetto()
logging.info("NetPyNE UI initialised")
