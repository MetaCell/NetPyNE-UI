import os
import json
import neuron
import sys

from netpyne import sim

os.chdir(os.path.dirname(__file__))


def update_state(experiment, state):
    with open("experiment.json", "w") as f:
        experiment["state"] = state
        json.dump(experiment, f, default=str, sort_keys=True, indent=4)


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
    update_state(exp, "SIMULATING")

try:
    run_sim()
    update_state(exp, "SIMULATED")

except Exception as e:
    print("Experiment failed ...")
    print(e)

    update_state(exp, "ERRROR")
    sys.exit(1)
