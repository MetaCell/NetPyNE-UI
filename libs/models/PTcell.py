import logging
from neuron import h

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
import neuron_utils

class PTcell:

    def __init__(self):
        logging.debug('Loading PTcell')

        G.createProject(name='PTcell Neuron')
        h.load_file("models/PTcell.hoc")
        a = h.PTcell()

        neuron_utils.extractGeometries()

        logging.debug('PTcell loaded')

