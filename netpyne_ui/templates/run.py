import os
import json
import neuron

from netpyne import sim

os.chdir(os.path.dirname(__file__))

# Folder that contains x86_64 folder
NETPYNE_WORKDIR_PATH = '../../../'
neuron.load_mechanisms(NETPYNE_WORKDIR_PATH)

with open("./experiment.json", "r") as f:
    exp = json.load(f)

netParams = sim.loadNetParams("./netParams.json", None, False)
simConfig = sim.loadSimCfg("./simConfig.json", None, False)

sim.createSimulate(netParams, simConfig)
sim.saveData()
    
with open("./experiment.json", "w") as f:
    if exp:
        exp["state"] = "SIMULATED"
        json.dump(exp, f, default=str, sort_keys=True, indent=4)
