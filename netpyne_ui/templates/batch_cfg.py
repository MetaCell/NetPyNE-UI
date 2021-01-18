import pickle

with open("cfg.pkl", "rb") as f:
    simConfig = pickle.load(f)
    cfg = simConfig

    # Generate for each simulation a json output file
    # TODO: Maybe add as flag to BatchConfiguration & enable by default?
    cfg.saveJson = True
