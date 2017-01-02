from neuron import h

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
import neuron_utils

class CA3_pyramidal:

    def __init__(self):
        G.createProject(name='CA3 Pyramidal Neuron')
        h.load_file("models/geo-cell1zr.hoc")

        neuron_utils.extractGeometries()

    #def analysis(self):
        # plot voltage vs time
        #G.plotVariable('Plot', ['SimpleCell.v_vec_dend', 'SimpleCell.v_vec_soma'])
