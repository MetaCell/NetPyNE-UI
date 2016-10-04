from neuron import h

class SimpleCell:
    
    def loadModel(self):
        print('Loading Model...')
        self.soma = h.Section(name='soma')
        self.dend = h.Section(name='dend')
        self.dend.connect(self.soma(1))

        # Surface area of cylinder is 2*pi*r*h (sealed ends are implicit).
        self.soma.L = self.soma.diam = 12.6157 # Makes a soma of 500 microns squared.
        self.dend.L = 200 # microns
        self.dend.diam = 1 # microns

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
        self.syn = h.AlphaSynapse(self.dend(1.0))
        self.syn.e = 0  # equilibrium potential in mV
        self.syn.onset = 20  # turn on after this time in ms
        self.syn.gmax = 0.05  # set conductance in uS
        self.syn.tau = 0.1 # set time constant 

        # record soma voltage and time
        self.t_vec = h.Vector()
        self.v_vec_soma = h.Vector()
        self.v_vec_dend = h.Vector()
        self.v_vec_soma.record(self.soma(1.0)._ref_v) # change recoding pos
        self.v_vec_dend.record(self.dend(1.0)._ref_v)
        self.t_vec.record(h._ref_t)

        print(self.t_vec.to_python())
        # run simulation
        h.tstop = 60 # ms
        #h.run()  
        #print(self.t_vec.to_python())

    def analysis(self):
        from matplotlib import pyplot
        
        #plot voltage vs time
        pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
        pyplot.plot(self.t_vec, self.v_vec_soma, label='soma')
        pyplot.plot(self.t_vec, self.v_vec_dend, 'r', label='dend')
        pyplot.xlabel('time (ms)')
        pyplot.ylabel('mV')
        pyplot.legend()
        pyplot.show()    

        



