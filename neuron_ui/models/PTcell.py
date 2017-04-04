import logging
from neuron import h
import pkg_resources

from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils

class PTcell:

    def __init__(self):
        logging.debug('Loading PTcell')

        neuron_utils.createProject(name='PTcell Neuron')

        resource_package = "neuron_ui"
        resource_path = '/'.join(('models', 'PTcell.hoc'))
        filepath = pkg_resources.resource_filename(resource_package, resource_path)

        h.load_file(filepath)
        self.PTCell = h.PTcell()

        self.t_vec = h.Vector()
        self.t_vec.record(h._ref_t)
        neuron_utils.createStateVariable(id='time', name='time',
                              units='ms', python_variable={"record_variable": self.t_vec,
                                                           "segment": None})

        neuron_geometries_utils.extractGeometries()

        logging.debug('PTcell loaded')

