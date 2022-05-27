from jupyter_geppetto.webapi import RouteManager
from netpyne_ui import api
import sentry_sdk

sentry_sdk.init(
    "https://d8bf7e40eec34cb9891f6dd8207b5e83@sentry.metacell.us/6"
)

RouteManager.add_controller(api.NetPyNEController)
