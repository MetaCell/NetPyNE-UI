import logging
from jupyter_geppetto.webapi import RouteManager

from netpyne_ui import api

RouteManager.add_controller(api.NetPyNEController)