import json
import logging
import pickle
import subprocess
import os
import sys
import numpy as np

from shutil import copyfile, move
from netpyne import sim

# TODO: need to understand when to set NRN_PYLIB
#   it's required for pure Python installation, but breaks when using Conda
if "CONDA_VERSION" not in os.environ:
    # nrniv needs NRN_PYLIB to be set to python executable path (MacOS, Python 3.7.6)
    os.environ["NRN_PYLIB"] = sys.executable


def run(parallel=False, cores=None):
    if parallel:
        return _run_with_mpi_bulletin(cores)
    else:
        return _run_in_same_process()


def run_batch(sim_config, batch_config, run_config, net_params):
    """Runs the configured simulation as a batch of variations of this simulation.

        * Store netParams and cfg as pkl files
        * Prepare py templates for netParams.py, cfg.py, batch.py, run.py
        * Copy all to workspace
        * Submit batch simulation
        """
    sim_config.mapping = batch_config["params"]

    for param in batch_config["params"]:
        if param["type"] == "range":
            param["values"] = list(np.arange(param["min"], param["max"], param["step"]))

    batch_config["runCfg"] = run_config

    # Configuration of batch.py in json format
    batch_config = os.path.join(os.path.dirname(__file__), "templates", "batchConfig.json")
    json.dump(batch_config, open(batch_config, 'w'))
    move(batch_config, './batchConfig.json')

    # Pickle files of netParams and cfg dicts
    net_params_pkl = os.path.join(os.path.dirname(__file__), "templates", 'netParams.pkl')
    cfg_pkl = os.path.join(os.path.dirname(__file__), "templates", 'cfg.pkl')
    pickle.dump(net_params, open(net_params_pkl, "wb"))
    pickle.dump(sim_config, open(cfg_pkl, "wb"))
    move(net_params_pkl, './netParams.pkl')
    move(cfg_pkl, './cfg.pkl')

    # Python template files
    template_single_run = os.path.join(os.path.dirname(__file__), "templates", 'batch_run_single.py')
    template_batch = os.path.join(os.path.dirname(__file__), "templates", 'batch.py')
    cfg = os.path.join(os.path.dirname(__file__), "templates", 'batch_cfg.py')
    net_params = os.path.join(os.path.dirname(__file__), "templates", 'batch_netParams.py')
    copyfile(template_single_run, './run.py')
    copyfile(template_batch, './init.py')
    copyfile(cfg, './cfg.py')
    copyfile(net_params, './netParams.py')

    if run_config["type"] == "mpi_direct":
        _run_in_subprocess("init.py")
    elif run_config["type"] == "mpi_bulletin":
        _run_with_mpi_bulletin(run_config.get("cores", None))


def _run_in_same_process():
    logging.debug('Running single core simulation')

    sim.setupRecording()
    sim.simulate()
    sim.saveData()


def _run_in_subprocess(script, asynchronous=False):
    if asynchronous:
        subprocess.Popen(["python", "./" + script])
    else:
        cp = subprocess.run(["python", "./" + script])
        if cp.returncode == 0:
            logging.info("Batch finished with success")
        else:
            logging.error("Batch run failed ...")


def _run_with_mpi_bulletin(cores):
    logging.debug('Running parallel simulation')
    completed_process = subprocess.run(
        ["mpiexec", "-n", str(cores), "nrniv", "-python", "-mpi", "./init.py"],
        capture_output=True
    )
    return None if completed_process == 0 else completed_process.stderr.decode()
