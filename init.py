from netpyne import sim
netParams = sim.loadNetParams("./netParams.json", None, False)
simConfig = sim.loadSimCfg("./simParams.json", None, False)

sim.createSimulateAnalyze(netParams, simConfig)



