import os
import json

from netpyne import sim

os.chdir(os.path.dirname(__file__))

with open("./experiment.json", "r") as f:
    exp = json.load(f)
    exp["state"] = "SIMULATED"

netParams = sim.loadNetParams("./netParams.json", None, False)
simConfig = sim.loadSimCfg("./simConfig.json", None, False)

sim.createSimulate(netParams, simConfig)

with open("./experiment.json", "w") as f:
    if exp:
        json.dump(exp, f, default=str, sort_keys=True, indent=4)
