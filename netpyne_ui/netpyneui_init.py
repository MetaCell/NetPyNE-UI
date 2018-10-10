"""
netpyneui_init.py
Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import logging

logging.info("Initialising NetPyNE UI")
from netpyne_ui import netpyne_geppetto
netpyne_geppetto = netpyne_geppetto.NetPyNEGeppetto()
logging.info("NetPyNE UI initialised")