import dataclasses
import json

from typing import List
from dacite import from_dict
from os import listdir
from os.path import isdir, join

from netpyne_ui import constants
from netpyne_ui import model


class ExperimentsError(Exception):
    pass


def get_experiments() -> List[dict]:
    # Only update Experiments stored on filesystem
    stored_experiments = _scan()
    model.experiments = [
        e for e in model.experiments if
        e.state in (model.ExperimentState.DESIGN, model.ExperimentState.ERROR)
    ]
    model.experiments.extend(stored_experiments)

    return [dataclasses.asdict(e) for e in model.experiments]


def add_experiment(experiment: dict):
    exp = from_dict(model.Experiment, experiment)
    _add_experiment(exp)


def get_experiment(name: str) -> dict:
    exp = _get_by_name(name)
    return dataclasses.asdict(exp) if exp else None


def remove_experiment(name: str):
    experiment = _get_by_name(name)
    if experiment:
        model.experiments.remove(experiment)


def edit_experiment(name: str, experiment: dict):
    exp = _get_by_name(name)
    if exp.state != model.ExperimentState.DESIGN:
        raise ExperimentsError(f"Can only edit experiment in f{model.ExperimentState.DESIGN} state")
    if not exp:
        raise ExperimentsError(f"Experiment with name {name} does not exist")

    updated_exp = from_dict(model.Experiment, experiment)
    model.experiments.remove(exp)
    _add_experiment(updated_exp)


def get_current() -> model.Experiment:
    return next(
        (exp for exp in model.experiments if exp.state == model.ExperimentState.DESIGN),
        None
    )


def _add_experiment(experiment: model.Experiment):
    if _get_by_name(experiment.name):
        raise ExperimentsError(f"Experiment {experiment.name} already exists")

    model.experiments.append(experiment)


def _get_by_name(name: str) -> model.Experiment:
    experiment = next((e for e in model.experiments if e.name == name), None)
    return experiment


def _scan() -> [model.Experiment]:
    dirs = list([
        f for f in listdir(join(constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER))
        if isdir(join(constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, f))
    ])

    experiments = [_parse_experiment(directory) for directory in dirs]
    return experiments


def _parse_experiment(directory) -> model.Experiment:
    """ Finds and parses Experiments stored in `directory` on the disk.

    We expect the following files to be present:
        * batchConfig.json (Experiment model and run config)
        * netParams.json
        * simConfig.json
        * json file for each trial in case of batch
        * output files for each trial (if available)

    """
    path = join(constants.NETPYNE_WORKDIR_PATH, constants.EXPERIMENTS_FOLDER, directory)

    # TODO: implement error handling

    with open(join(path, 'batchConfig.json'), 'r') as f:
        batch_config = json.load(f)

    with open(join(path, 'netParams.json'), 'r') as f:
        net_params = json.load(f)

    with open(join(path, 'simConfig.json'), 'r') as f:
        sim_config = json.load(f)

    run_cfg = batch_config['runCfg']
    del batch_config['runCfg']

    # TODO: Fix timestamp parsing
    del batch_config['timestamp']

    experiment = from_dict(model.Experiment, batch_config)

    # TODO: how do we determine the simulation status?
    experiment.state = model.ExperimentState.SIMULATED
    return experiment
