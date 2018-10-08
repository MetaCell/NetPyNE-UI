"""
netpyne_geppetto_init.py
Initialise NetPyNE Geppetto, this class contains methods to connect NetPyNE with the Geppetto based UI
"""
import logging

logging.info("NetPyNE UI is being initialised")
from netpyne_ui import netpyne_geppetto
netpyne_geppetto = netpyne_geppetto.NetPyNEGeppetto()
logging.info("NetPyNE Geppetto object was created")