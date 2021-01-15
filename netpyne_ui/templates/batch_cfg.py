import pickle

with open("cfg.pkl", "rb") as f:
    simConfig = pickle.load(f)
    cfg = simConfig
