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

    # Modification of metadata to enable validation of experiment parameters.
    metadata['netParams']['children']['popParams']['container'] = True
    metadata['netParams']['children']['cellParams']['container'] = True
    metadata['netParams']['children']['cellParams']['children']['conds']['container'] = True
    metadata['netParams']['children']['cellParams']['children']['secs']['container'] = True
    metadata['netParams']['children']['synMechParams']['container'] = True
    metadata['netParams']['children']['connParams']['container'] = True
    metadata['netParams']['children']['stimSourceParams']['container'] = True
    metadata['netParams']['children']['stimTargetParams']['container'] = True

class ExperimentState:
    DESIGN = "DESIGN"
    PENDING = "PENDING"
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
    # Display name.
    name: str = ''
    # Unique id to find trial on disk.
    # Concatenated str of indices e.g. "0_1_1" with 3 parameters.
    id: str = ''
    # [{ "paramX": 0.2, "paramY": "0.4"}]
    params: list = field(default_factory=list)
    indices: list = field(default_factory=list)
    

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
    asynchronous: bool = True
    cores: int = 1
    resource: str = "local"
    # or mpi_direct (doesn't support waiting for processes to finish)
    type: str = 'mpi_bulletin'


experiments = []
