import logging
from netpyne import specs
import json
from neuron_ui import neuron_utils
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
    
netParams = specs.NetParams()
simConfig = specs.SimConfig() 

neuron_utils.createProject(name='SampleProject')

GeppettoJupyterModelSync.current_model.original_model = json.dumps({'netParams': netParams.__dict__, 'simConfig': simConfig.__dict__})

logging.debug(GeppettoJupyterModelSync.current_model.original_model)