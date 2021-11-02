import logging
import subprocess
import os
import multiprocessing
import platform

from netpyne import sim
from netpyne_ui import constants

# Available netpyne.batch.Batch methods.
MPI_DIRECT = "mpi_direct"
MPI_BULLETIN = "mpi_bulletin"

system = platform.system()
if system == "Darwin":
    import sys

    # nrniv needs NRN_PYLIB to be set to python executable path (MacOS, Python 3.7.6)
    os.environ["NRN_PYLIB"] = sys.executable


class SimulationError(Exception):
    """ Base Simulation Exception """


class InvalidConfigError(Exception):
    """ Thrown if invalid number of CPUs were specified. """


class LocalSimulationPool:
    """ Pool that manages simulation running on the same machine as Netpyne-UI. """

    cpus = multiprocessing.cpu_count()

    def __init__(self):
        # We allow to run only one asynchronous simulation at a time on the same instance.
        self.subprocess = None

    def run(self, parallel, cores, method="", batch=False, asynchronous=False, working_directory=None):
        if int(cores) > self.cpus:
            raise InvalidConfigError(
                f"Specified {cores} cores, but only {self.cpus} are available")

        logging.info(f"Scheduling simulation on {cores} cores ...")

        if batch or asynchronous or parallel:
            if method == MPI_DIRECT:
                self._run_in_subprocess(
                    _python_command(working_directory), asynchronous=asynchronous, working_directory=working_directory
                )
            elif method == MPI_BULLETIN:
                if parallel:
                    self._run_in_subprocess(
                        _bulletin_board_cmd(cores, working_directory), asynchronous=asynchronous, working_directory=working_directory
                    )
                else:
                    self._run_in_subprocess(
                        _python_command(working_directory), asynchronous=asynchronous, working_directory=working_directory
                    )
            else:
                raise InvalidConfigError(f"Unsupported method {method}")
        else:
            return self._run_in_same_process()

    def is_running(self):
        return self.subprocess and self.subprocess.poll() is None

    def list(self):
        if not self.subprocess:
            return "no_simulation"

        ret_code = self.subprocess.poll()
        if ret_code is None:
            return "running"

        status = "completed" if ret_code == 0 else "failed"
        return [{"status": status}]

    def stop(self):
        if self.is_running():
            self.subprocess.kill()

    def _run_in_same_process(self):
        logging.debug('Running single core simulation')

        sim.setupRecording()
        sim.simulate()
        sim.saveData()

    def _run_in_subprocess(self, cmds, asynchronous=False, working_directory: str = None):
        if self.is_running():
            logging.info("Another simulation is still running")
            return False

        if working_directory:
            with open(os.path.join(working_directory, 'sim.log'), 'w') as f:
                self.subprocess = subprocess.Popen(cmds, stdout=f, stderr=f)
        else:
            self.subprocess = subprocess.Popen(cmds)

        if not asynchronous:
            # blocking wait
            return_code = self.subprocess.wait()
            if return_code == 0:
                logging.info("Simulation finished with success")
            else:
                logging.error("Simulation run failed")


def _bulletin_board_cmd(cores, working_directory=None):
    """ Creates command to run batch or single simulations in parallel.

    Uses mpiexec that implements the OpenMPI protocol to schedule simulations.
    Uses the master/worker pattern.
    """
    return ["mpiexec", "-n", str(cores), "--use-hwthread-cpus", "nrniv", "-python", "-mpi", _script_path(working_directory)]


def _script_path(working_directory=None):
    return os.path.join(working_directory,
                        constants.SIMULATION_SCRIPT_NAME) if working_directory else f"./{constants.SIMULATION_SCRIPT_NAME}"


def _python_command(working_directory=None):
    return ["python", _script_path(working_directory)]


def run(platform="local", parallel=False, cores=1, method="", batch=False, asynchronous=False, working_directory=None):
    if platform == "local":
        local.run(
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


local = LocalSimulationPool()
