import random

from dataclasses import dataclass
from dataclasses import field
from datetime import datetime
from typing import List, Optional


def register(metadata):
    metadata['batch_config'] = {
        "label": "Batch configuration",
        "help": "",
        "suggestions": "",
        "hintText": "",
        'children': {
            'enabled': {
                "label": "Run as batch",
                "help": "Activates batch",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'name': {
                "label": "Name of the batch",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'saveFolder': {
                "label": "Save folder",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'seed': {
                "label": "Seed",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "int"
            },
            'method': {
                "label": "Exploration method",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            }
        }
    }

    metadata["run_config"] = {
        "label": "Run configuration",
        "help": "",
        "suggestions": "",
        "hintText": "",
        'children': {
            'parallel': {
                "label": "Parallel",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'asynchronous': {
                "label": "Run in background",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'type': {
                "label": "Execution type",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'cores': {
                "label": "Number of cores",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "int"
            }
        }
    }


class ExperimentState:
    DESIGN = "DESIGN"
    SIMULATING = "SIMULATING"
    INSTANTIATING = "INSTANTIATING"
    SIMULATED = "SIMULATED"
    INSTANTIATED = "INSTANTIATED"
    ERROR = "ERROR"


@dataclass
class ExplorationParameter:
    """ Parameter with possible values that will be explored in netpyne.batch. """

    # Path to target parameter in netParams dict
    mapsTo: str
    # Type can be either 'list' or 'range'
    type: str
    # List of values of different type
    values: Optional[List] = None
    # Range fields
    min: Optional[float] = None
    max: Optional[float] = None
    step: Optional[float] = None
    # If True, parameter is added to grouped parameters
    inGroup: bool = False
    # Set in cfg.py to cfg.label = <defaultValue of netParams field>
    label: str = ""


@dataclass
class Trial:
    # [{ "paramX": 0.2, "paramY": "0.4"}]
    params: list = field(default_factory=list)


@dataclass
class Experiment:
    # Name is the unique identifier
    name: str
    # DESIGN, INSTANTIATING, INSTANTIATED, SIMULATING, SIMULATED
    state: str = ExperimentState.DESIGN
    # Exploration parameter config
    params: List[ExplorationParameter] = field(default_factory=list)
    # Generated based on params
    trials: List[Trial] = field(default_factory=list)
    # SIMULATED or INSTANTIATED date
    timestamp: datetime = field(default_factory=datetime.today)

    # Overwrites simConfig parameters
    initConfig: dict = field(default_factory=dict)
    method: str = "grid"
    # Part of initCfg?
    seed: Optional[int] = None

    # Folder in workspace, empty in DESIGN
    folder: Optional[str] = None


@dataclass
class RunConfig:
    """ Run config for either single or batch simulation."""
    parallel: bool = False
    asynchronous: bool = False
    cores: int = 1
    remote: str = "local"
    # or mpi_direct (doesn't support waiting for processes to finish)
    type: str = 'mpi_bulletin'


# Dummy data for frontend.
experiments = [
    Experiment(
        name="EI-Populations",
        state="DESIGN",
        params=[
            ExplorationParameter(
                label="cellParams.pyr.secs.soma.geom.L",
                # TODO: Fix json parsing issue
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4]
            ),
            ExplorationParameter(
                label="stimTargetParams.IClamp1->cell0.sec",
                # mapsTo="netParams.connParams['E->E']['probability']",
                mapsTo="",
                type="range",
                min=0.3,
                max=1.0,
                step=0.2
            )
        ],
        trials=[
            Trial(params=[{"weight": i, "probability": random.random()}]) for i in range(0, 1000)
        ]
    ),
    Experiment(
        name="MyExperiment",
        state="SIMULATED",
        params=[
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4]
            ),
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['probability']",
                mapsTo="",
                type="range",
                min=0.3,
                max=1.0,
                step=0.2
            ),
        ],
        trials=[
            Trial(params=[{"weight": 1, "probability": 0.3}]),
            Trial(params=[{"weight": 2, "probability": 0.4}]),
            Trial(params=[{"weight": 3, "probability": 0.5}]),
            Trial(params=[{"weight": 4, "probability": 0.6}]),
            Trial(params=[{"weight": 5, "probability": 0.7}]),
            Trial(params=[{"weight": 6, "probability": 0.8}]),
        ]
    ),
    Experiment(
        name="Long running experiment",
        state="SIMULATING",
        params=[
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4, 5, 6, 7, 8, 9]
            ),
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['probability']",
                mapsTo="",
                type="range",
                min=0.5,
                max=10.0,
                step=0.2
            )
        ]
    ),
    Experiment(
        name="Failing model",
        state="ERROR",
        params=[
            ExplorationParameter(
                label="weight",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4]
            ),
        ]
    ),
    Experiment(
        name="My instantiated model with a longer name than usual",
        state="INSTANTIATED",
        params=[
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4, 5, 6, 7, 8, 9]
            ),
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['probability']",
                mapsTo="",
                type="range",
                min=0.5,
                max=10.0,
                step=0.2
            )
        ]
    ),
    Experiment(
        name="Instantiating model",
        state="INSTANTIATING",
        params=[
            ExplorationParameter(
                label="weight",
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4, 5, 6, 7, 8, 9]
            ),
        ]
    ),
]
