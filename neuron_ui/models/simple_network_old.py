from neuron import h
from pylab import sin,cos,pi
#from matplotlib import pyplot
from neuron_ui import neuron_utils

from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G

class HHCell: 
    """Two-section cell: A soma with active channels and
    a dendrite with passive properties."""
    def __init__(self, cell_index):
        
        self.synlist = []
        self.nclist = []
        self.create_sections()
        self.build_topology()
        self.define_geometry()
        self.define_biophysics()
        self.cell_index = cell_index

    def create_sections(self):
        """Create the sections of the cell."""
        self.soma = h.Section(name='soma')
        self.dend = h.Section(name='dend')
    
    def build_topology(self):
        """Connect the sections of the cell"""
        self.dend.connect(self.soma(1))
    
    def define_geometry(self):
        """Set the 3D geometry of the cell."""
        self.soma.L = self.soma.diam = 12.6157 # microns
        self.dend.L = 200                      # microns
        self.dend.diam = 1                     # microns
        self.dend.nseg = 10
    
    def define_biophysics(self):
        """Assign the membrane properties across the cell."""
        for sec in [self.soma, self.dend]: # 
            sec.Ra = 100    # Axial resistance in Ohm * cm
            sec.cm = 1      # Membrane capacitance in micro Farads / cm^2
        
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

    def add_current_stim(self, delay):
        self.stim = h.IClamp(self.dend(1.0))
        self.stim.amp = 0.3  # input current in nA
        self.stim.delay = delay  # turn on after this time in ms
        self.stim.dur = 1  # duration of 1 ms
    
    def set_recording(self):
        """Set soma, dendrite, and time recording vectors on the cell. """
        self.soma_v_vec = h.Vector()   # Membrane potential vector at soma
        self.dend_v_vec = h.Vector()   # Membrane potential vector at dendrite
        self.t_vec = h.Vector()        # Time stamp vector
        self.soma_v_vec.record(self.soma(0.5)._ref_v)
        G.createStateVariable(id = 'soma_v_vec_' + str(self.cell_index), name = 'soma_v_vec for cell ' + str(self.cell_index), units = 'mV', python_variable = self.soma_v_vec)
        self.dend_v_vec.record(self.dend(0.5)._ref_v)
        G.createStateVariable(id = 'dend_v_vec_' + str(self.cell_index), name = 'dend_v_vec for cell ' + str(self.cell_index), units = 'mV', python_variable = self.dend_v_vec)
        self.t_vec.record(h._ref_t)
        G.createStateVariable(id = 'time', name = 'time', units = 'ms', python_variable = self.t_vec)

    def plot_voltage(self):
        """Plot the recorded traces"""
        #pyplot.figure(figsize=(8,4)) # Default figsize is (8,6)
        #pyplot.plot(self.t_vec, self.soma_v_vec, color='black', label='soma(0.5')
        #pyplot.plot(self.t_vec, self.dend_v_vec, color='red', label='dend(0.5)')
        #pyplot.legend()
        #pyplot.xlabel('time (ms)')
        #pyplot.ylabel('mV')
        #pyplot.ylim(-80,20)
        #pyplot.title('Cell voltage')
        #pyplot.show()

        G.plotVariable('Plot', ['SimpleNetwork.soma_v_vec_' + str(self.cell_index), 'SimpleNetwork.dend_v_vec_' + str(self.cell_index)])
        
    def create_synapse(self, loc=0.5, tau=2, e=0):
        syn = h.ExpSyn(self.dend(loc))
        syn.tau = tau
        syn.e = e
        self.synlist.append(syn)
    
    def connect2pre(self, preCell, synid=0, delay=2, weight=1):
        nc = h.NetCon(preCell.soma(0.5)._ref_v, self.synlist[synid], sec = preCell.soma)
        nc.delay = delay
        nc.weight[0] = weight
        self.nclist.append(nc)
    
    def set_position(self, x, y):
        self.x = x
        self.y = y
        

class Net:
    def __init__(self, numcells):
        neuron_utils.createProject(name = 'Simple Network')
        self.spkt = h.Vector()   # Spike time of all cells
        self.spkid = h.Vector()  # cell ids of spike times
        self.create_cells(numcells)  # call method to create cells
                
 
    def create_cells(self, numcells):
        """ Create cells in the network """
        self.cells = []
        r = numcells*10 # Radius of cell locations from origin (0,0) in microns
        for i in range(numcells):  # for each cell
            cell = HHCell(i)  # create cell object
            cell.set_recording()  # set up voltage recording
            cell.create_synapse(loc=0.5, tau=2, e=0)  # create synapse object            
            xpos = sin(i * 2 * pi / numcells) * r  # calculate x position
            ypos = cos(i * 2 * pi / numcells) * r  # calculate y position
            cell.set_position(xpos, ypos)  # set x,y position            
            nc = h.NetCon(cell.soma(0.5)._ref_v, None, sec=cell.soma)  # create netcon to record spikes from cell
            nc.record(self.spkt, self.spkid, i) 
            self.cells.append(cell)  # add cell to list of cells in network            
            print('Created cell ' + str(i))
            
            
    def connect_cells_ring(self, syn_weight, syn_delay):
        """ Connect cells in a ring """
        self.conns = []  # list to store ids of connected cells
        for ipost,postCell in enumerate(self.cells):  # for each postsyn cell
            ipre = (ipost-1)  # presyn cell will be prev cell
            if ipre == -1: ipre = len(self.cells)-1  # if prev=-1 start from end
            preCell = self.cells[ipre]  # get preCell object
            postCell.connect2pre(preCell, delay=syn_delay, weight=syn_weight) # connect to pre
            self.conns.append((ipre,ipost)) # keep track of connections created
            print('Created connection between cell ' + str(ipre) + ' and cell ' + str(ipost))


    def plot_net(self):
        """ Plot position of cells and conns """
        pyplot.figure(figsize=(6,6))
        posX = [cell.x for cell in self.cells]  # get all x positions
        posY = [cell.y for cell in self.cells]  # get all y positions
        pyplot.scatter(posX, posY, s=40) # plot cell soma positions
        for con in self.conns:  # plot connections between cells
            posXpre = self.cells[con[0]].x  
            posYpre = self.cells[con[0]].y
            posXpost = self.cells[con[1]].x
            posYpost = self.cells[con[1]].y            
            pyplot.plot([posXpre, posXpost], [posYpre, posYpost], c='red') # plot line from pre to post
        pyplot.show()


    def plot_raster(self, color='blue'):
        """ Plot raster with spikes of all cells """
        pyplot.figure()
        pyplot.scatter(self.spkt, self.spkid, marker= "|", s=100, c=color)
        pyplot.xlabel('time (ms)')
        pyplot.ylabel('cell id')
        pyplot.title('Network raster')
        pyplot.show()

class SimpleNetwork:
    def __init__(self):
        # Main code
        self.net = Net(numcells=10)  # create network 
        self.net.connect_cells_ring(syn_weight=0.1, syn_delay=1)  # connect cells in a ring 
        #self.net.plot_net()  # plot network cells positions
        self.net.cells[0].add_current_stim(delay=1)  # add stimulation to a cell

        h.tstop = 60 # set simulation duration
        #h.init()  # initialize sim
        #h.run()  # run simulation

        neuron_geometries_utils.extractGeometries()

    def analysis(self):
        #from matplotlib import pyplot

        self.net.cells[0].plot_voltage()  # plot voltage
        self.net.cells[4].plot_voltage()  # plot voltage

        # plot raster
        #self.net.plot_raster()

    #def analysis_matplotlib(self):
