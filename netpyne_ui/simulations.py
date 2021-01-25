import logging
import subprocess
import os
import sys
import multiprocessing

from netpyne import sim
from netpyne_ui import constants

MPI_DIRECT = "mpi_direct"
MPI_BULLETIN = "mpi_bulletin"

# TODO: need to understand when to set NRN_PYLIB
#   it's required for pure Python installation, but breaks when using Conda
if "CONDA_VERSION" not in os.environ:
    # nrniv needs NRN_PYLIB to be set to python executable path (MacOS, Python 3.7.6)
    os.environ["NRN_PYLIB"] = sys.executable


class SimulationError(Exception):
    """ Base Simulation Exception """


class InvalidConfigError(Exception):
    """ Thrown if invalid number of CPUs were specified. """


class LocalSimulationPool:
    cpus = multiprocessing.cpu_count()

    def __init__(self):
        # We allow to run only one asynchronous simulation at a time on the same instance.
        self.subprocess = None

    def run(self, parallel, cores, method="", batch=False, asynchronous=False, working_directory=None):
        if int(cores) > self.cpus:
            raise InvalidConfigError(f"Specified {cores} cores, but only {self.cpus} are available")

        if batch:
            if method == MPI_DIRECT:
                self._run_in_subprocess(_python_command(working_directory), asynchronous=asynchronous)

            elif method == MPI_BULLETIN:
                if parallel:
                    cmd = _bulletin_board_cmd(cores, working_directory)
                    self._run_in_subprocess(cmd, asynchronous=asynchronous)
                else:
                    self._run_in_subprocess(_python_command(working_directory), asynchronous=asynchronous)
            else:
                return
        else:
            if asynchronous or parallel:
                logging.info(f"Running single simulation on {cores} cores ...")
                cmd = _bulletin_board_cmd(cores, working_directory)
                return self._run_in_subprocess(cmd, asynchronous=asynchronous)
            else:
                return self._run_in_same_process()

    def is_running(self):
        return self.subprocess and self.subprocess.poll() is None

    def status(self):
        if not self.subprocess:
            return "no_simulation"

        ret_code = self.subprocess.poll()
        if ret_code is None:
            return "running"

        return "completed" if ret_code == 0 else "failed"

    def stop(self):
        if self.is_running():
            self.subprocess.kill()

    def _run_in_same_process(self):
        logging.debug('Running single core simulation')

        sim.setupRecording()
        sim.simulate()
        sim.saveData()

    def _run_in_subprocess(self, cmds, asynchronous=False):
        if self.is_running():
            logging.info("Another simulation is still running")
            return False

        self.subprocess = subprocess.Popen(cmds)

        if not asynchronous:
            # blocking wait
            return_code = self.subprocess.wait()
            if return_code == 0:
                logging.info("Simulation finished with success")
            else:
                logging.error("Simulation run failed")


local_simulation_pool = LocalSimulationPool()


def _bulletin_board_cmd(cores, working_directory=None):
    return ["mpiexec", "-n", str(cores), "nrniv", "-python", "-mpi", _script_path(working_directory)]


def _script_path(working_directory=None):
    return os.path.join(working_directory,
                        constants.SIMULATION_SCRIPT_NAME) if working_directory else f"./{constants.SIMULATION_SCRIPT_NAME}"


def _python_command(working_directory=None):
    return ["python", _script_path(working_directory)]


def run(local=True, parallel=False, cores=1, method="", batch=False, asynchronous=False, working_directory=None):
    if local:
        local_simulation_pool.run(
            parallel=parallel,
            cores=cores,
            method=method,
            batch=batch,
            asynchronous=asynchronous,
            working_directory=working_directory
        )
    else:
        # remote simulations in future versions
        pass
