import logging
import sys
import os

from jupyter_geppetto.webapi import RouteManager
from netpyne_ui import api
from netpyne_ui.constants import HERE
import sentry_sdk

sentry_sdk.init(
    "https://d8bf7e40eec34cb9891f6dd8207b5e83@sentry.metacell.us/6"
)

HEAD_MODEL_FILE = os.getenv("NP_LFPYKIT_HEAD_FILE", "sa_nyhead.mat")

def init_eeg():
    import sys
    from netpyne_ui.constants import HERE
    # FIXES library asking for input to download
    sys.stdin = open(os.path.join(HERE, "resources/stdin.txt"),'r') 
    from lfpykit.eegmegcalc import NYHeadModel
    try:
        NYHeadModel(HEAD_MODEL_FILE) # Downloads the model if does not exist
    except:
        logging.error("Error initializing the EEG head model", exc_info=True)

if not os.path.exists(HEAD_MODEL_FILE):
    from multiprocessing import Process
    thread = Process(target = init_eeg)
    thread.start()

RouteManager.add_controller(api.NetPyNEController)


