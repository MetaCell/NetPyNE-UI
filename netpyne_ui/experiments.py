import dataclasses
from typing import List
from dacite import from_dict
from netpyne_ui import model


class ExperimentsError(Exception):
    pass


def get_experiments() -> List[dict]:
    return [dataclasses.asdict(e) for e in model.experiments]


def add_experiment(experiment: dict):
    exp = from_dict(model.Experiment, experiment)
    if _get_by_name(exp.name):
        raise ExperimentsError(f"Experiment {exp.name} already exists")

    model.experiments.append(exp)


def get_experiment(name: str) -> dict:
    exp = _get_by_name(name)
    return dataclasses.asdict(exp) if exp else None


def remove_experiment(name: str):
    experiment = _get_by_name(name)
    if experiment:
        model.experiments.remove(experiment)


def edit_experiment(name, experiment) -> dict:
    exp = _get_by_name(name)
    if exp.state != model.ExperimentState.DESIGN:
        raise ExperimentsError(f"Can only edit experiment in f{model.ExperimentState.DESIGN} state")
    if not exp:
        raise ExperimentsError(f"Experiment with name {name} does not exist")

    updated_exp = from_dict(model.Experiment, experiment)
    model.experiments.remove(exp)
    model.experiments.append(updated_exp)
    return dataclasses.asdict(updated_exp)


def _get_by_name(name: str) -> model.Experiment:
    experiment = next((e for e in model.experiments if e.name == name), None)
    return experiment
