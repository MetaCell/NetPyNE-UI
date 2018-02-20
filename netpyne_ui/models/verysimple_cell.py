from __future__ import print_function
from neuron import h
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils

from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G

class VerySimpleCell:

    def __init__(self):
        print("loading very simple cell")
        neuron_utils.createProject(name = 'Very Simple Cell')

        print('Loading Model...')
        self.soma = h.Section(name='soma')
        self.soma.insert('pas')
        self.asyn = h.AlphaSynapse(self.soma(0.5))
        self.asyn.onset = 20
        self.asyn.gmax = 1
        self.v_vec = h.Vector()             # Membrane potential vector
        self.t_vec = h.Vector()             # Time stamp vector
        self.v_vec.record(self.soma(0.5)._ref_v)
        neuron_utils.createStateVariable(id='v_vec', name='v_vec',
                        units='ms', python_variable={"record_variable": self.v_vec,
                                                    "segment": self.soma(0.5)})

        self.t_vec.record(h._ref_t)
        neuron_utils.createStateVariable(id='time', name='time',
                              units='ms', python_variable={"record_variable": self.t_vec,
                                                           "segment": None})

        
        h.tstop = 80.0

        neuron_geometries_utils.extractGeometries()

    def analysis(self):
        self.plotWidget =G.plotVariable('Plot', ['VerySimpleCell.v_vec'])

    def analysis_matplotlib(self):
        from matplotlib import pyplot
        pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
        pyplot.plot(self.t_vec, self.v_vec)
        pyplot.xlabel('time (ms)')
        pyplot.ylabel('mV')
        pyplot.show()