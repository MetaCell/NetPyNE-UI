import random

from dataclasses import dataclass
from dataclasses import field
from datetime import datetime


def register(metadata, net_params):
    # TODO: this needs to be moved into the metadata.py of netpyne repository.
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierX'] = {
        "label": "Cells visualization spacing multiplier X",
        "help": "Multiplier for spacing in X axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierY'] = {
        "label": "Cells visualization spacing multiplier Y",
        "help": "Multiplier for spacing in Y axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierZ'] = {
        "label": "Cells visualization spacing multiplier Z",
        "help": "Multiplier for spacing in Z axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }

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

    net_params.cellsVisualizationSpacingMultiplierX = 1
    net_params.cellsVisualizationSpacingMultiplierY = 1
    net_params.cellsVisualizationSpacingMultiplierZ = 1


@dataclass
class ExplorationParameter:
    """ Parameter with possible values that will be explored in netpyne.batch. """

    # Set in cfg.py to cfg.label = <defaultValue of netParams field>
    label: str
    # Path to target parameter in netParams dict
    mapsTo: str
    # Type can be either list or range
    type: str
    # List of values of different type
    values: list = None

    # Range fields
    min: float = None
    max: float = None
    step: float = None


@dataclass
class Trial:
    # [{ "paramX": 0.2, "paramY": "0.4"}]
    params: list


@dataclass
class Experiment:
    # DESIGN, INSTANTIATING, INSTANTIATED, SIMULATING, SIMULATED
    state: str
    # Name is the unique identifier
    name: str
    params: [ExplorationParameter] = field(default_factory=list)
    # Generated based on params
    trials: [Trial] = field(default_factory=list)

    # Enabled is depreated, will be removed
    enabled: bool = False
    method: str = "grid"

    # Overwrites simConfig parameters
    initConfig: dict = field(default_factory=dict)

    # Part of initCfg?
    seed: int = None

    saveFolder: str = "experiment_1"

    # SIMULATED or INSTANTIATED date
    timestamp: datetime = None

    # Folder in workspace, empty in DESIGN
    folder: str = None


@dataclass
class RunConfig:
    """ Run config for either single or batch simulation."""
    parallel: bool = False
    asynchronous: bool = False
    cores: int = 1
    remote: str = "local"
    # or mpi_direct (doesn't support waiting for processes to finish)
    type: str = 'mpi_bulletin'


experiments = [
    Experiment(
        name="EI Populations",
        state="DESIGN",
        params=[
            ExplorationParameter(
                label="weight",
                # TODO: Fix json parsing issue
                # mapsTo="netParams.connParams['E->E']['weight']",
                mapsTo="",
                type="list",
                values=[1, 2, 3, 4]
            ),
            ExplorationParameter(
                label="probability",
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
        name="My instantiated model",
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
]
