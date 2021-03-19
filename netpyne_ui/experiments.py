import dataclasses

from netpyne_ui import model


def get_experiments():
    return [dataclasses.asdict(e) for e in model.experiments]


def add_experiment(name):
    if get_experiment(name):
        return {"message": "Experiment already exists"}

    experiment = model.Experiment(name=name, state="DESIGN")
    model.experiments.append(experiment)


def get_experiment(name):
    exp = next((e for e in model.experiments if e.name == name), None)
    return dataclasses.asdict(exp) if exp else None


def remove_experiment(name):
    experiment = next((e for e in model.experiments if e.name == name), None)
    if experiment:
        model.experiments.remove(experiment)


getExperiments = get_experiments
getExperiment = get_experiment
addExperiment = add_experiment
removeExperiment = remove_experiment
