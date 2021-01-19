import json
import logging
import pickle
import subprocess
import os
import sys
import numpy as np

from shutil import copyfile, move
from netpyne import sim

MPI_DIRECT = "mpi_direct"
MPI_BULLETIN = "mpi_bulletin"

# TODO: need to understand when to set NRN_PYLIB
#   it's required for pure Python installation, but breaks when using Conda
if "CONDA_VERSION" not in os.environ:
    # nrniv needs NRN_PYLIB to be set to python executable path (MacOS, Python 3.7.6)
    os.environ["NRN_PYLIB"] = sys.executable


class LocalSimulationPool:
    # We allow to run only one asynchronous simulation at a time on the same instance.
    subprocess = None

    def run(self, parallel, cores):
        if parallel:
            cmd = self._bulletin_board_cmd(cores)
            return self._run_in_subprocess(cmd)
        else:
            return self._run_in_same_process()

    def run_batch(self, sim_config, batch_config, run_config, net_params):
        """Runs the configured simulation as a batch of variations of this simulation.

        * Store netParams and cfg as pkl files
        * Prepare py templates for netParams.py, cfg.py, batch.py, run.py
        * Copy all to workspace
        * Submit batch simulation
        """
        self._prepare_batch_files(batch_config, net_params, run_config, sim_config)

        if run_config["type"] == MPI_DIRECT:
            self._run_in_subprocess(["python", "./init.py"], asynchronous=True)

        elif run_config["type"] == MPI_BULLETIN:
            self._run_in_subprocess(["python", "./init.py"], asynchronous=True)
            # cores = run_config.get("cores", None)
            # cmd = self._bulletin_board_cmd(cores)
            # self._run_in_subprocess(cmd, asynchronous=True)

    def is_running(self):
        if self.subprocess:
            # If subprocess didn't return a code, it's still running
            return self.subprocess.poll() is None
        else:
            # No subprocess present, so free to go
            return False

    def _bulletin_board_cmd(self, cores):
        return ["mpiexec", "-n", str(cores), "nrniv", "-python", "-mpi", "./init.py"]

    def _run_in_same_process(self):
        logging.debug('Running single core simulation')

        sim.setupRecording()
        sim.simulate()
        sim.saveData()

    def _run_in_subprocess(self, cmds, asynchronous=False):
        if asynchronous:
            # store reference in module variable
            self.subprocess = subprocess.Popen(cmds)
        else:
            if subprocess:
                cp = subprocess.run(cmds)
                if cp.returncode == 0:
                    logging.info("Batch finished with success")
                else:
                    logging.error("Batch run failed ...")

    def _prepare_batch_files(self, batch_config, net_params, run_config, sim_config):
        sim_config.mapping = batch_config["params"]

        for param in batch_config["params"]:
            if param["type"] == "range":
                param["values"] = list(np.arange(param["min"], param["max"], param["step"]))

        batch_config["runCfg"] = run_config

        # Configuration of batch.py in json format
        batch_config_json = os.path.join(os.path.dirname(__file__), "templates", "batchConfig.json")
        json.dump(batch_config, open(batch_config_json, 'w'))
        move(batch_config_json, './batchConfig.json')

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


local_simulation_pool = LocalSimulationPool()


def run(local=True, parallel=False, cores=None):
    if local:
        local_simulation_pool.run(parallel, cores)
    else:
        # remote simulations in future versions
        pass
