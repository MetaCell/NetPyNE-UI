"""
netpyne_geppetto.py

Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import copy
import dataclasses
import importlib
import json
import logging
import os
import re
import sys
from shutil import copyfile, move

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
from netpyne_ui import utils as netpyne_ui_utils
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

    def getData(self):
        return {
            "metadata": metadata,
            "netParams": self.netParams.todict(),
            "simConfig": self.simConfig.todict(),
            "isDocker": os.path.isfile('/.dockerenv'),
            "currentFolder": os.getcwd(),
            "tuts": self.find_tutorials()
        }

    def getModelAsJson(self):
        # TODO: netpyne should offer a method asJSON (#240)
        #  that returns the JSON model without dumping to to disk.
        obj = netpyne_utils.replaceFuncObj(self.netParams.__dict__)
        obj = netpyne_utils.replaceDictODict(obj)
        return obj

    def cloneExperiment(self, payload: dict):
        """ Loads experiment from disk and replaces experiment in design with it.

        1. Replaces current experiment in design with copy of stored experiment.
        2. Replace current model specification with spec of stored experiment.

        :param payload: { name: str, replaceModelSpec: bool, replaceExperiment: bool }
        """
        name = payload.get('name')

        # Creates new Experiment in design based on `name` experiment.
        if payload.get('replaceExperiment', True):
            experiments.replace_current_with(name)

        # Replaces model specification
        if payload.get('replaceModelSpec', True):
            path = os.path.join(constants.EXPERIMENTS_FOLDER_PATH, name)
            if self.doIhaveInstOrSimData()['haveInstance']:
                sim.clearAll()

            sim.initialize()
            sim.loadNetParams(os.path.join(path, experiments.NET_PARAMS_FILE))
            sim.loadSimCfg(os.path.join(path, experiments.SIM_CONFIG_FILE))
            self.netParams = sim.net.params
            self.simConfig = sim.cfg
            netpyne_ui_utils.remove(self.simConfig.todict())
            netpyne_ui_utils.remove(self.netParams.todict())

    def viewExperimentResult(self, payload: dict):
        """ Loads the output file of a simulated experiment trial.

        :param payload: {name: str, trial: str, onlyModelSpecification: bool}
        :return: geppetto model
        """
        name = payload.get("name", None)
        trial = payload.get("trial", None)
        only_model_spec = payload.get("onlyModelSpecification", False)

        file = experiments.get_trial_output_path(name, trial)
        if file is None or not os.path.exists(file):
            return utils.getJSONError(f"Couldn't find output file {file}", "")

        if self.doIhaveInstOrSimData()['haveInstance']:
            sim.clearAll()

        sim.initialize()

        if only_model_spec:
            # Load only model specification
            sim.loadNetParams(file)
            sim.loadSimCfg(file)
            self.netParams = sim.net.params
            self.simConfig = sim.cfg
            netpyne_ui_utils.remove(self.simConfig.todict())
            netpyne_ui_utils.remove(self.netParams.todict())
            return
        else:
            # Load the complete simulation
            sim.loadAll(file)
            self._create3D_shapes(file)
            self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
            return json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))

    def stopExperiment(self, experiment_name):
        # TODO: check in simulation pool if experiment is running
        # TODO: once stopped, update experiment status to ERROR (?), also on file system
        simulations.local.stop()
        return {
            "message": f"Stopped simulation of {experiment_name}"
        }

    def find_tutorials(self):
        only_files = [f for f in os.listdir(constants.NETPYNE_WORKDIR_PATH) if
                      os.path.isfile(os.path.join(constants.NETPYNE_WORKDIR_PATH, f))]

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

    def simulate_experiment_trials(self, experiment: model.Experiment):
        if simulations.local.is_running():
            return utils.getJSONError("Simulation is already running", "")
        try:
            experiment.state = model.ExperimentState.SIMULATING
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
                  f"Results will be stored in your workspace at ./{os.path.join(constants.EXPERIMENTS_FOLDER, experiment.name)}"

        return utils.getJSONError(message, "")

    def simulate_single_model(self, experiment: model.Experiment = None, use_prev_inst: bool = False):
        if self.run_config.asynchronous or self.run_config.parallel:
            # Run in different process
            if simulations.local.is_running():
                return utils.getJSONError("Simulation is already running", "")

            experiment.state = model.ExperimentState.SIMULATING
            working_directory = self._prepare_simulation_files(experiment, use_prev_inst)
            simulations.run(
                parallel=self.run_config.parallel,
                cores=self.run_config.cores,
                asynchronous=self.run_config.asynchronous,
                method=simulations.MPI_BULLETIN,
                working_directory=working_directory,
            )

            if self.run_config.asynchronous:
                message = "Experiment started in background! " \
                  f"Results will be stored in your workspace at ./{os.path.join(constants.EXPERIMENTS_FOLDER, experiment.name)}"
                return utils.getJSONError(message, "")
            else:
                sim.load(f'{constants.MODEL_OUTPUT_FILENAME}.json')
                self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
                response = json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
                return response

        else:
            # Run in same process
            if not use_prev_inst:
                logging.debug('Instantiating single thread simulation')
                netpyne_model = self.instantiateNetPyNEModel()

                self.geppetto_model = self.model_interpreter.getGeppettoModel(netpyne_model)
            simulations.run()

            if self.geppetto_model:
                response = json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
                return response

    def simulateNetPyNEModelInGeppetto(self, args):
        """ Starts simulation of the currently loaded NetPyNe model.

        * runConfiguration is used to determine asynch/synch & other parameters.
        * complete flag in args decides if we simulate single model as Experiment or complete Experiment.
        * if Experiment in design does not exist, we create a new one & start single sim.
        * All Simulations run in different process.

        :param args: { allTrials: bool, usePrevInst: bool }
        :return: geppetto model.
        """
        allTrials = args.get('allTrials', True)
        use_prev_inst = args.get('usePrevInst', False)

        try:
            experiment = experiments.get_current()
            if experiment:
                # TODO: remove once run config can be configured
                self.run_config.asynchronous = True
                self.run_config.parallel = True

                if allTrials:
                    return self.simulate_experiment_trials(experiment)
                else:
                    return self.simulate_single_model(experiment, use_prev_inst)
            else:
                # TODO: is synch by default, remove once it can be configured
                self.run_config.asynchronous = False
                self.run_config.parallel = False
                return self.simulate_single_model(use_prev_inst=use_prev_inst)

        except Exception:
            message = "Error while simulating the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def _prepare_simulation_files(self, experiment: model.Experiment = None, use_prev_inst: bool = False) -> str:
        exp = copy.deepcopy(experiment)
        # Remove parameter & trials for single run
        exp.params = []
        exp.trials = []

        save_folder_path = os.path.join(constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, exp.name)
        try:
            os.makedirs(save_folder_path)
        except OSError:
            raise

        if use_prev_inst:
            sim.cfg.saveJson = True
            oldName = sim.cfg.filename
            sim.cfg.filename = constants.MODEL_OUTPUT_FILENAME

            # workaround for issue with empty LFP dict when calling saveData()
            if 'LFP' in sim.allSimData:
                del sim.allSimData['LFP']

            # TODO: store in experiments folder!
            sim.saveData()
            sim.cfg.filename = oldName
            template_name = constants.TEMPLATE_FILENAME_SINGLE_RUN_INSTANTIATED
        else:
            # Create netParams and SimConfig
            self.netParams.save(os.path.join(save_folder_path, experiments.NET_PARAMS_FILE))
            self.simConfig.saveJson = True
            self.simConfig.filename = 'model_output'
            self.simConfig.save(os.path.join(save_folder_path, experiments.SIM_CONFIG_FILE))

            template_name = constants.TEMPLATE_FILENAME_SINGLE_RUN

        # Create Experiment Config
        config_dict = dataclasses.asdict(exp)
        config_dict["runCfg"] = dataclasses.asdict(self.run_config)
        experiment_config = os.path.join(save_folder_path, experiments.EXPERIMENT_FILE)
        json.dump(config_dict, open(experiment_config, 'w'), default=str, sort_keys=True, indent=4)

        # Copy Template
        template = os.path.join(os.path.dirname(__file__), "templates", template_name)
        copyfile(template, os.path.join(save_folder_path, constants.SIMULATION_SCRIPT_NAME))

        return save_folder_path

    def _prepare_batch_files(self, experiment: model.Experiment) -> str:
        # param path must be split: [ {'label': ['synMechParams', 'AMPA', 'gmax']} ]
        # TODO: how do we handle array index? ['array', '[0]'] or ['array', '0']?
        exp =  copy.deepcopy(experiment)
        exp.params = [p for p in exp.params if p.mapsTo != '']

        for param in exp.params:
            if param.type == "range":
                param.values = list(np.arange(param.min, param.max, param.step))
            elif param.type == "list":
                # TODO: need to enforce correct type for each parameter
                #   e.g. numCells with 10.0 fails because it requires int not float
                param.values = [int(e) for e in param.values]

        self.netParams.mapping = {p.mapsTo: p.mapsTo.split('.') for p in exp.params}
        self.simConfig.saveJson = True

        config_dict = dataclasses.asdict(exp)
        config_dict["runCfg"] = dataclasses.asdict(self.run_config)

        save_folder_path = os.path.join(constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, exp.name)
        try:
            os.makedirs(save_folder_path)
        except OSError:
            raise

        sim_config_path = os.path.join(os.path.dirname(__file__), "templates", "simConfig.json")
        net_params_path = os.path.join(os.path.dirname(__file__), "templates", "netParams.json")
        self.simConfig.save(sim_config_path)
        self.netParams.save(net_params_path)

        experiment_json = os.path.join(save_folder_path, experiments.EXPERIMENT_FILE)
        json.dump(config_dict, open(experiment_json, 'w'), default=str, sort_keys=True, indent=4)

        move(sim_config_path, os.path.join(save_folder_path, 'simConfig.json'))
        move(net_params_path, os.path.join(save_folder_path, 'netParams.json'))

        template_single_run = os.path.join(os.path.dirname(__file__), "templates", 'batch_run_single.py')
        template_batch = os.path.join(os.path.dirname(__file__), "templates", 'batch.py')
        copyfile(template_single_run, os.path.join(save_folder_path, 'run.py'))
        copyfile(template_batch, os.path.join(save_folder_path, constants.SIMULATION_SCRIPT_NAME))

        return save_folder_path

    def loadModel(self, args):
        """ Imports a model stored as file in json format.

        :param args:
        :return:
        """
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
                    netpyne_ui_utils.remove(self.netParams.todict())
                    netpyne_ui_utils.remove(self.simConfig.todict())
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
                        netpyne_ui_utils.remove(self.simConfig.todict())

                    if args['loadNetParams']:
                        if self.doIhaveInstOrSimData()['haveInstance']:
                            sim.clearAll()
                        sim.loadNetParams(args['jsonModelFolder'])
                        self.netParams = sim.net.params
                        netpyne_ui_utils.remove(self.netParams.todict())

                if wake_up_geppetto:
                    self._create3D_shapes(args['jsonModelFolder'])

                    # TODO: Fix me - gatherData will remove allSimData!
                    sim.gatherData()

                    self.geppetto_model = self.model_interpreter.getGeppettoModel(sim)
                    return json.loads(GeppettoModelSerializer.serialize(self.geppetto_model))
                else:
                    return utils.getJSONReply()
        except Exception:
            message = "Error while loading the NetPyNE model"
            logging.exception(message)
            return utils.getJSONError(message, sys.exc_info())

    def _create3D_shapes(self, json_path: str):
        """ Creates cellShapes for 3D viewer.

        Performed as final step after `json_path` was loaded.
        """
        if len(sim.net.cells) > 0:
            section = list(sim.net.cells[0].secs.keys())[0]
            if 'pt3d' not in list(sim.net.cells[0].secs[section].geom.keys()):
                sim.net.defineCellShapes()
                sim.gatherData()
                # Load again because gatherData removed simData
                sim.loadSimData(json_path)

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
            sim.clearAll()
        except:
            logging.exception("Failed to clear simulation")

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
                        def conns_length(cell) -> int:
                            if type(cell) is dict:
                                return len(cell.get('conns', []))
                            else:
                                return len(getattr(cell, 'conns', []))

                        # To prevent unresponsive kernel, we don't show conns if they become too many
                        num_conn = sum([conns_length(cell) for cell in sim.net.allCells])
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
