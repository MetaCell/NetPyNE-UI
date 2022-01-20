import copy
import dataclasses
import datetime
import json
import logging
import shutil
import pathlib
import os

import numpy as np
from typing import List
from dacite import from_dict
from netpyne.batch import Batch

from netpyne_ui import utils
from netpyne_ui import constants
from netpyne_ui import model

SIM_CONFIG_FILE = "simConfig.json"
NET_PARAMS_FILE = "netParams.json"
EXPERIMENT_FILE = "experiment.json"

# Id for the base model trial created for an Experiment without parameters.
BASE_TRIAL_ID = "model_output"


class ExperimentsError(Exception):
    """ Base Exception for any specific Experiment errors. """
    pass


def get_experiments() -> List[dict]:
    """Returns the current list of experiments.

    Scans the experiments folder to read experiments from disk and includes experiment in design.
    """
    # Only update Experiments stored on filesystem
    stored_experiments = _scan_experiments_directory()
    model.experiments = [
        e for e in model.experiments if e.state in model.ExperimentState.DESIGN
    ]
    model.experiments.extend(stored_experiments)

    return [dataclasses.asdict(e) for e in model.experiments]


def add_experiment(experiment: dict):
    exp = from_dict(model.Experiment, experiment)
    exp.trials = _create_trials(exp)

    if exp.state == model.ExperimentState.DESIGN:
        # Only one exp in design can exist
        [model.experiments.remove(e) for e in get_by_states(model.ExperimentState.DESIGN)]

    _add_experiment(exp)


def get_experiment(name: str) -> dict:
    exp = _get_by_name(name)
    return dataclasses.asdict(exp) if exp else None


def remove_experiment(name: str):
    experiment = _get_by_name(name)
    if experiment:
        _delete_experiment_folder(experiment)
        model.experiments.remove(experiment)


def edit_experiment(name: str, experiment: dict):
    exp = _get_by_name(name)
    if not exp:
        raise ExperimentsError(f"Experiment with name {name} does not exist")

    if exp.state != model.ExperimentState.DESIGN:
        raise ExperimentsError(
            f"Can only edit experiment in f{model.ExperimentState.DESIGN} state"
        )

    updated_exp = from_dict(model.Experiment, experiment)
    updated_exp.trials = _create_trials(updated_exp)
    model.experiments.remove(exp)
    _add_experiment(updated_exp)


def replace_current_with(name: str):
    """Replaces the experiment in design with a new experiment based on experiment with `name`.

    :param name: name of experiment to be cloned.
    :raises ExperimentsError: thrown if Experiment with `name` doesn't exist.
    """
    exp = _get_by_name(name)
    if not exp:
        raise ExperimentsError(f"Experiment with name {name} does not exist")

    next_name = utils.get_next_file_name(constants.EXPERIMENTS_FOLDER_PATH, name)
    new_exp = model.Experiment(
        name=next_name,
        state=model.ExperimentState.DESIGN,
        params=exp.params,
        seed=exp.seed,
        initConfig=exp.initConfig,
        method=exp.method,
    )

    current = get_current()
    if current:
        remove_experiment(current.name)

    new_exp.trials = _create_trials(new_exp)
    _add_experiment(new_exp)
    return


def get_current() -> model.Experiment:
    return next(
        (exp for exp in model.experiments if exp.state == model.ExperimentState.DESIGN),
        None,
    )


def get_by_states(states: List[model.ExperimentState]) -> List[model.Experiment]:
    return [e for e in model.experiments if e.state in states]


def any_in_state(states: List[model.ExperimentState]) -> model.Experiment:
    return any(get_by_states(states))


def set_to_error(experiment: model.Experiment):
    """Sets the state of `experiment` to ERROR. """
    path = os.path.join(
        constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, experiment.name
    )

    try:
        with open(os.path.join(path, EXPERIMENT_FILE), "r") as f:
            experiment_config = json.load(f)

        with open(os.path.join(path, EXPERIMENT_FILE), "w") as f:
            experiment_config["state"] = model.ExperimentState.ERROR
            json.dump(experiment_config, f, default=str, sort_keys=True, indent=4)

    except IOError:
        raise ExperimentsError(f"Could not find {EXPERIMENT_FILE}")


def get_model_specification(name: str, trial: str) -> dict:
    """Returns JSON representation of the netParams & simConfig of the requested trial.

    :param name: the experiment name.
    :param trial: the trial identifier.
    :return: dict
    """
    path = get_trial_output_path(name, trial, fallback=True)
    if path is None or not os.path.exists(path):
        raise ExperimentsError(f"Condition file {path} not found")

    with open(path, "r") as f:
        trial_output = json.load(f)
        model_spec = {}

        if "simConfig" in trial_output:
            model_spec["simConfig"] = trial_output["simConfig"]

        try:
            params = trial_output["net"]["params"]
        except KeyError:
            logging.error(f"net params is not present in {path}")
        else:
            model_spec["net"] = {"params": params}

        return model_spec


def get_trial_output_path(
    experiment_name: str, trial: str, fallback: bool = False
) -> pathlib.PosixPath:
    path = os.path.join(constants.EXPERIMENTS_FOLDER_PATH, experiment_name)
    trial_path = next(pathlib.Path(path).glob(f"*{trial}_data.json"), None)

    if trial_path is None and fallback:
        trial_path = next(pathlib.Path(path).glob(f"*{trial}_cfg.json"), None)

    return trial_path


def _add_experiment(experiment: model.Experiment):
    if _get_by_name(experiment.name):
        raise ExperimentsError(f"Experiment {experiment.name} already exists")

    model.experiments.append(experiment)


def _get_by_name(name: str) -> model.Experiment:
    experiment = next((e for e in model.experiments if e.name == name), None)
    return experiment


def _scan_experiments_directory() -> List[model.Experiment]:
    if not pathlib.Path(constants.EXPERIMENTS_FOLDER_PATH).exists():
        return []

    dirs = list(
        [
            f
            for f in os.listdir(constants.EXPERIMENTS_FOLDER_PATH)
            if os.path.isdir(os.path.join(constants.EXPERIMENTS_FOLDER_PATH, f))
        ]
    )

    experiments = []
    for directory in dirs:
        try:
            experiment = _parse_experiment(directory)
        except ExperimentsError:
            logging.exception(f"Failed to parse experiment {directory}")
        else:
            experiments.append(experiment)

    return experiments


def _parse_experiment(directory: str) -> model.Experiment:
    """Finds and parses Experiments stored in `directory` on the disk.

    We expect the following files to be present:
        * experiment.json (Experiment model and run config)
        * netParams.json
        * simConfig.json
        * json file for each trial in case of batch
        * data files for each trial (if available)

    :raises ExperimentsError
    """
    path = os.path.join(
        constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, directory
    )

    try:
        with open(os.path.join(path, EXPERIMENT_FILE), "r") as f:
            experiment_config = json.load(f)
    except IOError:
        raise ExperimentsError(f"Could not find {EXPERIMENT_FILE}")

    del experiment_config["runCfg"]

    # Convert timestamp to datetime
    experiment_config["timestamp"] = datetime.datetime.fromisoformat(
        experiment_config["timestamp"]
    )

    experiment = from_dict(model.Experiment, experiment_config)
    experiment.folder = directory
    experiment.trials = _create_trials(experiment)
    return experiment


def _delete_experiment_folder(experiment: model.Experiment):
    """Recursively deletes the associated `experiment` folder."""

    def onerror(func, path, exc_info):
        # TODO: error handling
        pass

    if experiment.folder:
        path = os.path.join(
            constants.NETPYNE_WORKDIR_PATH,
            constants.EXPERIMENTS_FOLDER,
            experiment.folder,
        )
        shutil.rmtree(path, onerror=onerror)


def _create_base_model_trial() -> model.Trial:
    return model.Trial(name="Condition 1", id=BASE_TRIAL_ID)


def _create_trials(experiment: model.Experiment) -> List[model.Trial]:
    """Gerates based on `experiment.params` all possible trial combinations.

    :param experiment: given experiment.
    :return: list of generated trials.
    """
    params = copy.deepcopy(experiment.params)
    params = process_params(params)

    if len(experiment.params) < 1:
        # No params defined -> one trial representing base model
        return [_create_base_model_trial()]

    params_dict = {}
    grouped_params = []
    for p in params:
        params_dict[p.mapsTo] = p.values
        if p.inGroup:
            grouped_params.append(p.mapsTo)

    # Initialize Batch so that we can call getParamCombinations()
    batch = Batch(params=params_dict, groupedParams=grouped_params)
    batch.method = "grid"
    batch.saveFolder = ""
    batch.batchLabel = ""

    # { indices, values, labels, filenames}
    combinations = batch.getParamCombinations()
    if not combinations["labels"]:
        return [_create_base_model_trial()]

    trials = []
    for combIdx, paramValues in enumerate(combinations["values"]):
        # index of paramValues := index of labels list
        # value of paramValues := parameter value
        params = [{combinations["labels"][idx]: v for idx, v in enumerate(paramValues)}]

        filename = combinations["filenames"][combIdx][1:]
        indices = combinations["indices"][combIdx]
        name = f"Condition {combIdx + 1}"

        trials.append(
            model.Trial(name=name, params=params, indices=indices, id=filename)
        )

    return trials


def process_params(params: List[model.ExplorationParameter]) -> List[model.ExplorationParameter]:
    """Cleaning, filtering and converting of experiment `params`.

    :param params: given parameters.
    :raises ExperimentsError: thrown for invalid parameter configuration.
    :return: processed list of params.
    """
    params = [p for p in params if p.mapsTo != '']

    for param in params:
        if param.type == "range":
            if param.step > 0:
                # Final values must be either of type int or float depending on the range parameters.
                convert_type = int if all(type(t) == int for t in [param.min, param.max, param.step]) else float
                param.values = [convert_type(e) for e in list(np.arange(param.min, param.max, param.step))]
            else:
                raise ExperimentsError("Invalid step value, must be greater than 0")

        elif param.type == "list":
            # nothing to do here
            pass

    params = [p for p in params if p.values is not None and len(p.values) > 0]
    return params
