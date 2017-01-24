import logging
from neuron import h
from IPython.core.debugger import Tracer
import neuron_utils

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


class SimpleCell:

    def __init__(self):
        G.createProject(name='Simple Cell')

        self.soma = h.Section(name='soma')
        self.dend = h.Section(name='dend')
        self.dend.connect(self.soma(1))

        # Surface area of cylinder is 2*pi*r*h (sealed ends are implicit).
        # Makes a soma of 500 microns squared.
        self.soma.L = self.soma.diam = 12.6157
        self.dend.L = 200  # microns
        self.dend.diam = 1  # microns

        for sec in h.allsec():
            sec.Ra = 100   # Axial resistance in Ohm * cm
            sec.cm = 1     # Membrane capacitance in micro Farads / cm^2

        # Insert active Hodgkin-Huxley current in the soma
        self.soma.insert('hh')
        self.soma.gnabar_hh = 0.12  # Sodium conductance in S/cm2
        self.soma.gkbar_hh = 0.036  # Potassium conductance in S/cm2
        self.soma.gl_hh = 0.0003    # Leak conductance in S/cm2
        self.soma.el_hh = -54.3     # Reversal potential in mV

        # Insert passive current in the dendrite
        self.dend.insert('pas')
        self.dend.g_pas = 0.001  # Passive conductance in S/cm2
        self.dend.e_pas = -65    # Leak reversal potential mV
        self.dend.nseg = 10

        # add synapse (custom channel)
        # self.syn = h.AlphaSynapse(self.dend(1.0))
        # self.syn.e = 0  # equilibrium potential in mV
        # self.syn.onset = 20  # turn on after this time in ms
        # self.syn.gmax = 0.05  # set conductance in uS
        # self.syn.tau = 0.1  # set time constant

        # self.stim = h.IClamp(self.dend(1.0))
        # self.stim.amp = 0.3  # input current in nA
        # self.stim.delay = 1  # turn on after this time in ms
        # self.stim.dur = 1  # duration of 1 ms

        # record soma voltage and time
        self.t_vec = h.Vector()
        self.t_vec.record(h._ref_t)
        G.createStateVariable(id='time', name='time',
                              units='ms', python_variable=self.t_vec)

        self.v_vec_soma = h.Vector()
        self.v_vec_soma.record(self.soma(1.0)._ref_v)  # change recoding pos
        # TODO How do we extract the units?
        G.createStateVariable(id='v_vec_soma', name='v_vec_soma',
                              units='mV', python_variable=self.v_vec_soma)
                              

        self.v_vec_dend = h.Vector()
        self.v_vec_dend.record(self.dend(1.0)._ref_v)
        # TODO How do we extract the units?
        G.createStateVariable(id='v_vec_dend', name='v_vec_dend',
                              units='mV', python_variable=self.v_vec_dend)

        # run simulation
        h.tstop = 60  # ms
        # h.run()

        neuron_utils.extractGeometries()

    def analysis(self):
        # plot voltage vs time
        self.plotWidget = G.plotVariable(
            'Plot', ['SimpleCell.v_vec_dend', 'SimpleCell.v_vec_soma'])

    def analysis_matplotlib(self):
        from matplotlib import pyplot
        pyplot.figure(figsize=(8, 4))  # Default figsize is (8,6)
        pyplot.plot(self.t_vec, self.v_vec_soma, label='soma')
        pyplot.plot(self.t_vec, self.v_vec_dend, 'r', label='dend')
        pyplot.xlabel('time (ms)')
        pyplot.ylabel('mV')
        pyplot.legend()
        pyplot.show()
