import json

from netpyne import specs
from netpyne.batch import Batch

with open("batchConfig.json", "r") as f:
    batch_config = json.load(f)
    print(batch_config)

params = specs.ODict()
for param in batch_config["params"]:
    if param["type"] == "list":
        params[param["label"]] = param['values']
    else:
        print("Not supported yet...")

batch = Batch(
    cfgFile="cfg.py",
    netParamsFile="netParams.py",
    params=params,
    seed=None
)

# Label will be subfolder of saveFolder
batch.batchLabel = batch_config.get("name", "batch_template_run")

# Have to set the saveFolder, default goes to root folder which is not always allowed by OS
batch.saveFolder = batch_config.get("saveFolder", "./batch")

# For now, we only support grid|list
batch.method = batch_config.get("method", "grid")

# for now, we only support mpi_direct or bulletinboard
batch.runCfg = {
    'type': 'mpi_direct',
    'script': 'run.py',
    'skip': True
}

batch.run()
