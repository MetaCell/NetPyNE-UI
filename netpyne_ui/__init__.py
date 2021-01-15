import logging
import sys

from jupyter_geppetto.webapi import RouteManager
from netpyne_ui import api

RouteManager.add_controller(api.NetPyNEController)

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

logging.info("Merry Christmas")
logger = logging.getLogger(__name__)
stream_handler = logging.StreamHandler(stream=sys.stdout)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(message)s')
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)
logger.info("netpyne-ui logger set up")
