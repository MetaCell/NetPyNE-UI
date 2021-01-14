import logging
import subprocess
import os
import sys

from netpyne import sim


def run(parallel=False, cores=None):
    if parallel:
        return _run_with_mpi(cores)
    else:
        return _run_in_same_process()


def _run_with_mpi(cores):
    logging.debug('Running parallel simulation')

    # TODO: need to understand when to set NRN_PYLIB
    #   it's required for pure Python installation, but breaks when using Conda
    if "CONDA_VERSION" not in os.environ:
        # nrniv needs NRN_PYLIB to be set to python executable path (MacOS, Python 3.7.6)
        os.environ["NRN_PYLIB"] = sys.executable

    completed_process = subprocess.run(
        ["mpiexec", "-n", cores, "nrniv", "-python", "-mpi", "init.py"],
        capture_output=True
    )
    logging.info(completed_process.stdout.decode() + completed_process.stderr.decode())

    return None if completed_process == 0 else completed_process.stderr.decode()


def _run_in_same_process():
    logging.debug('Running single core simulation')

    sim.setupRecording()
    sim.simulate()
    sim.saveData()
