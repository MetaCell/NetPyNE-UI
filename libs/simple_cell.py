from neuron import h

print('Loading Model...')
soma = h.Section(name='soma')
dend = h.Section(name='dend')
dend.connect(soma(1))

# Surface area of cylinder is 2*pi*r*h (sealed ends are implicit).
soma.L = soma.diam = 12.6157 # Makes a soma of 500 microns squared.
dend.L = 200 # microns
dend.diam = 1 # microns

for sec in h.allsec():
    sec.Ra = 100   # Axial resistance in Ohm * cm
    sec.cm = 1     # Membrane capacitance in micro Farads / cm^2

# Insert active Hodgkin-Huxley current in the soma
soma.insert('hh')
soma.gnabar_hh = 0.12  # Sodium conductance in S/cm2
soma.gkbar_hh = 0.036  # Potassium conductance in S/cm2
soma.gl_hh = 0.0003    # Leak conductance in S/cm2
soma.el_hh = -54.3     # Reversal potential in mV

# Insert passive current in the dendrite
dend.insert('pas')
dend.g_pas = 0.001  # Passive conductance in S/cm2
dend.e_pas = -65    # Leak reversal potential mV
dend.nseg = 10

# add synapse (custom channel)
syn = h.AlphaSynapse(dend(1.0))
syn.e = 0  # equilibrium potential in mV
syn.onset = 20  # turn on after this time in ms
syn.gmax = 0.05  # set conductance in uS
syn.tau = 0.1 # set time constant 

# record soma voltage and time
t_vec = h.Vector()
v_vec_soma = h.Vector()
v_vec_dend = h.Vector()
v_vec_soma.record(soma(1.0)._ref_v) # change recoding pos
v_vec_dend.record(dend(1.0)._ref_v)
t_vec.record(h._ref_t)

# run simulation
h.tstop = 60 # ms
#h.run()  

def analysis():
    from matplotlib import pyplot

    # plot voltage vs time
    pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
    pyplot.plot(t_vec, v_vec_soma, label='soma')
    pyplot.plot(t_vec, v_vec_dend, 'r', label='dend')
    pyplot.xlabel('time (ms)')
    pyplot.ylabel('mV')
    pyplot.legend()
    pyplot.show()       

        



