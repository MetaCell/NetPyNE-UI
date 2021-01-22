import json
import os

from netpyne import specs
from netpyne.batch import Batch

os.chdir(os.path.dirname(__file__))

with open("batchConfig.json", "r") as f:
    batch_config = json.load(f)
    print(batch_config)

# Map params to netpyne format
params = specs.ODict()
for param in batch_config["params"]:
    params[param["label"]] = param['values']

batch = Batch(
    cfgFile="cfg.py",
    netParamsFile="netParams.py",
    params=params,
    seed=batch_config.get("seed", None)
)

# Label will be subfolder of saveFolder
batch.batchLabel = batch_config.get("name", "batch_template_run")

# Have to overwrite the saveFolder, default goes to root folder which is not always allowed by OS
batch.saveFolder = os.getcwd()

# For now, we only support grid|list
batch.method = batch_config.get("method", "grid")

# for now, we only support mpi_direct or bulletinboard
# * mpi_direct can be started by running batch.py
# * mpi_bulletin requires to run "mpiexec -n 4 nrniv -mpi batch.py", otherwise runs in single core
run_cfg = batch_config.get("runCfg", None)
if run_cfg:
    batch.runCfg = {
        'type': run_cfg.get("type", 'mpi_bulletin'),
        'script': run_cfg.get("script", 'run.py'),
        'skip': run_cfg.get("skip", True),
        'cores': run_cfg.get("cores", None)
    }

batch.run()
