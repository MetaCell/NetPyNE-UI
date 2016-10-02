from neuron import h
h.load_file('stdrun.hoc')

print('Loading Model...')
soma = h.Section(name='soma')
soma.insert('pas')
asyn = h.AlphaSynapse(soma(0.5))
asyn.onset = 20
asyn.gmax = 1
v_vec = h.Vector()             # Membrane potential vector
t_vec = h.Vector()             # Time stamp vector
v_vec.record(soma(0.5)._ref_v)
t_vec.record(h._ref_t)
h.tstop = 80.0

def analysis():
    from matplotlib import pyplot
    pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
    pyplot.plot(t_vec, v_vec)
    pyplot.xlabel('time (ms)')
    pyplot.ylabel('mV')
    pyplot.show()