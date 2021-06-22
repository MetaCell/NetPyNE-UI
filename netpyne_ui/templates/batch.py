import json
import os
import sys

from neuron import h
from netpyne import specs
from netpyne.batch import Batch

os.chdir(os.path.dirname(__file__))

with open("batchConfig.json", "r") as f:
    batch_config = json.load(f)
    print(batch_config)

# Map params to netpyne format
params = specs.ODict()
grouped_params = []
for param in batch_config["params"]:
    params[param["mapsTo"]] = param['values']
    if param["inGroup"]:
        grouped_params.append(param["mapsTo"])

with open("netParams.json", "r") as f:
    net_params = json.load(f)
    net_params = specs.NetParams(net_params['net']['params'])

with open("simConfig.json", "r") as f:
    sim_config = json.load(f)
    sim_config = specs.SimConfig(sim_config['simConfig'])

batch = Batch(
    cfg=sim_config,
    netParams=net_params,
    params=params,
    groupedParams=grouped_params,
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

cores = run_cfg.get("cores", None)
cores = int(cores) if cores else None

if run_cfg:
    batch.runCfg = {
        'type': run_cfg.get("type", 'mpi_bulletin'),
        'script': run_cfg.get("script", 'run.py'),
        'skip': run_cfg.get("skip", True),
        'cores': cores
    }

batch.run()

if run_cfg['type'] == 'mpi_bulletin':
    pc = h.ParallelContext()
    pc.done()

    # Update simulation status
    batch_config['state'] = 'SIMULATED'
    with open("batchConfig.json", "w") as f:
        json.dump(batch_config, f, default=str, sort_keys=True, indent=4)

    sys.exit(0)
