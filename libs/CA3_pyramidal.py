from neuron import h
import utils

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G


class CA3_pyramidal:

    def loadModel(self):
        G.createProject(name='CA3 Pyramidal Neuron')

        h.load_file("geo-cell1zr.hoc")

        G.createGeometryVariables(utils.extractMorphology())

    #def analysis(self):
        # plot voltage vs time
        #G.plotVariable('Plot', ['SimpleCell.v_vec_dend', 'SimpleCell.v_vec_soma'])
