from neuron import h
from .ball_and_stick import BallAndStick
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from math import pi, cos, sin
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils
import logging
# from neuronpy.util import spiketrain

class Ring:
    """A network of *N* ball-and-stick cells where cell n makes an
    excitatory synapse onto cell n + 1 and the last, Nth cell in the
    network projects to the first cell.
    """
    def __init__(self, N=5, stim_w=0.004, stim_number=1,
            syn_w=0.01, syn_delay=5):
        """
        :param N: Number of cells.
        :param stim_w: Weight of the stimulus
        :param stim_number: Number of spikes in the stimulus
        :param syn_w: Synaptic weight
        :param syn_delay: Delay of the synapse
        """
        neuron_utils.createProject(name='Ring')

        self._N = N              # Total number of cells in the net
        self.cells = []          # Cells in the net
        self.nclist = []         # NetCon list
        self.stim = None         # Stimulator
        self.stim_w = stim_w     # Weight of stim
        self.stim_number = stim_number  # Number of stim spikes
        self.syn_w = syn_w       # Synaptic weight
        self.syn_delay = syn_delay  # Synaptic delay
        self.t_vec = h.Vector()   # Spike time of all cells
        self.id_vec = h.Vector()  # Ids of spike times
        self.set_numcells(N)  # Actually build the net.

        self.time_vec = h.Vector()        # Time stamp vector
        self.time_vec.record(h._ref_t)
        neuron_utils.createStateVariable(id='time', name='time',
                              units='ms', python_variable={"record_variable": self.time_vec,
                                                           "segment": None})


        for i in range(N):
            self.set_recording_vectors(i)

        h.tstop = 50
        neuron_geometries_utils.extractGeometries()
    #
    def set_numcells(self, N, radius=50):
        """Create, layout, and connect N cells."""
        self._N = N
        self.create_cells(N)
        self.connect_cells()
        self.connect_stim()
    #
    def create_cells(self, N):
        """Create and layout N cells in the network."""
        self.cells = []
        r = 50 # Radius of cell locations from origin (0,0,0) in microns
        N = self._N
        for i in range(N):
            cell = BallAndStick()
            # When cells are created, the soma location is at (0,0,0) and
            # the dendrite extends along the X-axis.
            # First, at the origin, rotate about Z.
            cell.rotateZ(i * 2 * pi / N)
            # Then reposition
            x_loc = cos(i * 2 * pi / N) * r
            y_loc = sin(i * 2 * pi / N) * r
            cell.set_position(x_loc, y_loc, 0)
            self.cells.append(cell)
    #
    def connect_cells(self):
        """Connect cell n to cell n + 1."""
        self.nclist = []
        N = self._N
        for i in range(N):
            src = self.cells[i]
            tgt_syn = self.cells[(i+1)%N].synlist[0]
            nc = src.connect2target(tgt_syn)
            nc.weight[0] = self.syn_w
            nc.delay = self.syn_delay

            nc.record(self.t_vec, self.id_vec, i)
            self.nclist.append(nc)
    #
    def connect_stim(self):
        """Connect a spiking generator to the first cell to get
        the network going."""
        self.stim = h.NetStim()
        self.stim.number = self.stim_number
        self.stim.start = 9
        self.ncstim = h.NetCon(self.stim, self.cells[0].synlist[0])
        self.ncstim.delay = 1
        self.ncstim.weight[0] = self.stim_w # NetCon weight is a vector.

    def set_recording_vectors(self, i):
        """Set soma, dendrite, and time recording vectors on the cell.

        :param cell: Cell to record from.
        :return: the soma, dendrite, and time vectors as a tuple.
        """
        #soma_v_vec = h.Vector()   # Membrane potential vector at soma
        setattr(self, 'soma_v_vec_' + str(i), h.Vector() )
        #dend_v_vec = h.Vector()   # Membrane potential vector at dendrite
        setattr(self, 'dend_v_vec_' + str(i), h.Vector() )
        
        getattr(self, 'soma_v_vec_' + str(i)).record(self.cells[i].soma(0.5)._ref_v)
        neuron_utils.createStateVariable(id='v_vec_soma_'  + str(i) , name='v_vec_soma_'  + str(i) ,
                          units='mV', python_variable={"record_variable": getattr(self, 'soma_v_vec_' + str(i)),
                                                           "segment": self.cells[i].soma(0.5)})

        getattr(self, 'dend_v_vec_' + str(i)).record(self.cells[i].dend(0.5)._ref_v)
        neuron_utils.createStateVariable(id='v_vec_dend_'  + str(i) , name='v_vec_dend_'  + str(i) ,
                          units='mV', python_variable={"record_variable": getattr(self, 'dend_v_vec_' + str(i)),
                                                           "segment": self.cells[i].dend(0.5)})


    def analysis(self):
        # plot voltage vs time
        self.plotWidget = G.plotVariable(
            'Plot', ['Ring.v_vec_dend_0', 'Ring.v_vec_soma_0'])



    #
    # def get_spikes(self):
    #     """Get the spikes as a list of lists."""
    #     return spiketrain.netconvecs_to_listoflists(self.t_vec, self.id_vec)
