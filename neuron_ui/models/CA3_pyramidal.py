import logging
from neuron import h

from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils

class CA3_pyramidal:

    def __init__(self):
        logging.debug('Loading CA3 Pyramidal')

        neuron_utils.createProject(name='CA3 Pyramidal Neuron')
        h.load_file("models/geo-cell1zr.hoc")
        neuron_geometries_utils.extractGeometries()

        logging.debug('CA3 Pyramidal loaded')

    #def analysis(self):
        # plot voltage vs time
        #G.plotVariable('Plot', ['SimpleCell.v_vec_dend', 'SimpleCell.v_vec_soma'])
