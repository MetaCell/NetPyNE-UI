import pickle

try:
    from __main__ import cfg  # import SimConfig object with params from parent module
except:
    from cfg import cfg  # if no simConfig in parent module, import directly from tut8_cfg module

with open("netParams.pkl", "rb") as f:
    netParams = pickle.load(f)

    if getattr(cfg, "mapping", None):
        print(cfg.mapping)

        for param in cfg.mapping:
            # Value of current combination is stored in __main__.cfg
            value = getattr(cfg, param["label"])

            # Update value in netParams
            exec(f"{param['mapsTo']} = {value}")
