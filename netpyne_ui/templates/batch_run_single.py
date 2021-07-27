import neuron
import json
from netpyne import sim


def update_state(experiment, state):
    with open("experiment.json", "w") as f:
        experiment["state"] = state
        json.dump(experiment, f, default=str, sort_keys=True, indent=4)


def run():
    # Folder that contains x86_64 folder
    NETPYNE_WORKDIR_PATH = "../../../"
    neuron.load_mechanisms(NETPYNE_WORKDIR_PATH)

    # read cfg and netParams from command line arguments if available; otherwise use default
    simConfig, netParams = sim.readCmdLineArgs(
        simConfigDefault="cfg.py", netParamsDefault="netParams.py"
    )

    # Create network and run simulation
    sim.createSimulate(netParams=netParams, simConfig=simConfig)
    sim.saveData()


try:
    run()
except Exception as e:
    print("Trial failed ...")
    print(e)

    with open("experiment.json", "r") as f:
        exp = json.load(f)
        update_state(exp, "ERROR")
