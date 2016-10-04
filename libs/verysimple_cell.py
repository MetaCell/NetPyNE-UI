from neuron import h

class VerySimpleCell:
    
    def loadModel(self):
        print('Loading Model...')
        self.soma = h.Section(name='soma')
        self.soma.insert('pas')
        self.asyn = h.AlphaSynapse(self.soma(0.5))
        self.asyn.onset = 20
        self.asyn.gmax = 1
        self.v_vec = h.Vector()             # Membrane potential vector
        self.t_vec = h.Vector()             # Time stamp vector
        self.v_vec.record(self.soma(0.5)._ref_v)
        self.t_vec.record(h._ref_t)
        h.tstop = 80.0

    def analysis(self):
        from matplotlib import pyplot
        pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
        pyplot.plot(self.t_vec, self.v_vec)
        pyplot.xlabel('time (ms)')
        pyplot.ylabel('mV')
        pyplot.show()