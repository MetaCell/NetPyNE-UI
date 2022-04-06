import os
import json
import neuron
import sys
import tempfile

from neuron import h
from netpyne import sim

os.chdir(os.path.dirname(__file__))


def update_state(experiment, state):
    experiment["state"] = state

    with tempfile.NamedTemporaryFile('w', dir=os.path.dirname("experiment.json"), delete=False) as tf:
        json.dump(experiment, tf, default=str, sort_keys=True, indent=4)
        tempname = tf.name
        
    os.rename(tempname, "./experiment.json")


def run_sim():
    # Folder that contains x86_64 folder
    NETPYNE_WORKDIR_PATH = "../../../"
    neuron.load_mechanisms(NETPYNE_WORKDIR_PATH)

    netParams = sim.loadNetParams("./netParams.json", None, False)
    simConfig = sim.loadSimCfg("./simConfig.json", None, False)

    sim.createSimulate(netParams, simConfig)
    sim.saveData()


with open("./experiment.json", "r") as f:
    exp = json.load(f)
    if exp['runCfg']['type'] == 'mpi_bulletin' and exp['runCfg']['cores'] > 1:
        pc = h.ParallelContext()
        if pc.id() == 0:
            update_state(exp, "SIMULATING")
    else:
        update_state(exp, "SIMULATING")

try:
    run_sim()
    update_state(exp, "SIMULATED")
    sys.exit(0)

except Exception as e:
    print("Experiment failed ...")
    print(e)

    update_state(exp, "ERRROR")
    sys.exit(1)
