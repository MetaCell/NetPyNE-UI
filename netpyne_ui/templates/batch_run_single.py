import neuron
from netpyne import sim


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
