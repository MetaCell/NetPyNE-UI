import logging
from neuron import h
import pkg_resources

from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils

class CA3_pyramidal:

    def __init__(self):
        logging.debug('Loading CA3 Pyramidal')

        neuron_utils.createProject(name='CA3 Pyramidal Neuron')

        resource_package = "neuron_ui"
        resource_path = '/'.join(('models', 'geo-cell1zr.hoc'))
        filepath = pkg_resources.resource_filename(resource_package, resource_path)

        h.load_file(filepath)

        neuron_geometries_utils.extractGeometries()

        logging.debug('CA3 Pyramidal loaded')

    #def analysis(self):
        # plot voltage vs time
        #G.plotVariable('Plot', ['SimpleCell.v_vec_dend', 'SimpleCell.v_vec_soma'])
