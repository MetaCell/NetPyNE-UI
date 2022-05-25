import json
import os
import sys
import tempfile
import pathlib
import time

from neuron import h
from netpyne import specs
from netpyne.batch import Batch

CURRENT_DIR = "."
try:
    CURRENT_DIR = os.path.dirname(__file__)
except:
    pass

os.chdir(CURRENT_DIR)

def is_error():
    """Validates if Experiment failed or succeeded.

    Experiment is successful if there exists a data file for every trial (cfg file)
    """

    data_files = list(pathlib.Path(
        CURRENT_DIR).glob(f"*_data.json"))
    cfg_files = list(pathlib.Path(
        CURRENT_DIR).glob(f"*_cfg.json"))

    if len(data_files) != len(cfg_files):
        print(
            f"data files don't match with cfg files {len(data_files)} - {len(cfg_files)}")
        return True
        
    return False


def update_state(experiment, state):
    experiment["state"] = state

    with tempfile.NamedTemporaryFile('w', dir=os.path.dirname("experiment.json"), delete=False) as tf:
        json.dump(experiment, tf, default=str, sort_keys=True, indent=4)
        tempname = tf.name

    os.rename(tempname, "./experiment.json")


def run_batch(experiment):
    # Map params to netpyne format
    params = specs.ODict()
    grouped_params = []
    for param in experiment["params"]:
        params[param["mapsTo"]] = param["values"]
        if param["inGroup"]:
            grouped_params.append(param["mapsTo"])

    with open("netParams.json", "r") as f:
        net_params = json.load(f)
        net_params = specs.NetParams(net_params["net"]["params"])

    with open("simConfig.json", "r") as f:
        sim_config = json.load(f)
        sim_config = specs.SimConfig(sim_config["simConfig"])

    batch = Batch(
        cfg=sim_config,
        netParams=net_params,
        params=params,
        groupedParams=grouped_params,
        seed=experiment.get("seed", None),
    )

    # Label will be subfolder of saveFolder
    batch.batchLabel = experiment.get("name", "batch_template_run")

    # Have to overwrite the saveFolder, default goes to root folder which is not always allowed by OS
    batch.saveFolder = os.getcwd()

    # For now, we only support grid|list
    batch.method = experiment.get("method", "grid")

    # for now, we only support mpi_direct or bulletinboard
    # * mpi_direct can be started by running batch.py
    # * mpi_bulletin requires to run "mpiexec -n 4 nrniv -mpi batch.py", otherwise runs in single core
    run_cfg = experiment.get("runCfg", None)

    cores = run_cfg.get("cores", None)
    cores = int(cores) if cores else None

    if run_cfg:
        batch.runCfg = {
            "type": run_cfg.get("type", "mpi_bulletin"),
            "script": run_cfg.get("script", "run.py"),
            "skip": run_cfg.get("skip", True),
            "cores": cores,
        }

    batch.run()
    return batch


with open("experiment.json", "r") as f:
    experiment = json.load(f)
    if experiment['runCfg']['type'] == 'mpi_bulletin':
        pc = h.ParallelContext()
        if pc.id() == 0:
            update_state(experiment, "SIMULATING")
    else:
        update_state(experiment, "SIMULATING")

    try:
        batch = run_batch(experiment)
        if batch.runCfg["type"] == "mpi_bulletin":
            pc = h.ParallelContext()
            if pc.id() != 0:
                sys.exit(0)

        # wait for data file writing to complete ...
        # TODO: netpyne sim needs to wait until file exists before exiting!
        time.sleep(10)
        if is_error():
            update_state(experiment, "ERROR")
            sys.exit(1)
        else:
            update_state(experiment, "SIMULATED")

    except Exception as e:
        print("Experiment failed ...")
        print(e)
        update_state(experiment, "ERROR")
        sys.exit(1)
