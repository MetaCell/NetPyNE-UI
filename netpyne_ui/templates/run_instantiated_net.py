import neuron

from netpyne import sim

# Folder that contains x86_64 folder
NETPYNE_WORKDIR_PATH = '../../../'
neuron.load_mechanisms(NETPYNE_WORKDIR_PATH)

sim.load("./model_output.json")
sim.createSimulate()
sim.saveData()