from neuron import h
import GeppettoNeuronUtils

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G

class BallAndStick:  # Inherits from Cell

    """Two-section cell: A soma with active channels and
    a dendrite with passive properties."""

    def __init__(self):
        G.createProject(name='Ball And Stick')
        self.x, self.y, self.z = 0, 0, 0
        self.synlist = []  # NEW CONSTRUCT IN THIS WORKSHEET
        self.create_sections()
        self.build_topology()
        self.build_subsets()
        self.define_geometry()
        self.define_biophysics()
        self.create_synapses()

        G.createGeometryVariables(GeppettoNeuronUtils.extractMorphology())

    def build_subsets(self):
        """Build subset lists. This defines 'all', but subclasses may
        want to define others. If overridden, call super() to include 'all'."""
        self.all = h.SectionList()
        self.all.wholetree(sec=self.soma)

    def create_sections(self):
        """Create the sections of the cell."""
        self.soma = h.Section(name='soma', cell=self)
        self.dend = h.Section(name='dend', cell=self)
    #

    def build_topology(self):
        """Connect the sections of the cell to build a tree."""
        self.dend.connect(self.soma(1))
    #

    def define_geometry(self):
        """Set the 3D geometry of the cell."""
        self.soma.L = self.soma.diam = 12.6157  # microns
        self.dend.L = 200                      # microns
        self.dend.diam = 1                     # microns
        self.dend.nseg = 5
        self.shape_3D()
    #

    def define_biophysics(self):
        """Assign the membrane properties across the cell."""
        for sec in self.all:  # 'all' exists in parent object.
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
    #

    def shape_3D(self):
        """
        Set the default shape of the cell in 3D coordinates.
        Set soma(0) to the origin (0,0,0) and dend extending along
        the X-axis.
        """
        len1 = self.soma.L
        h.pt3dclear(sec=self.soma)
        h.pt3dadd(0, 0, 0, self.soma.diam, sec=self.soma)
        h.pt3dadd(len1, 0, 0, self.soma.diam, sec=self.soma)
        len2 = self.dend.L
        h.pt3dclear(sec=self.dend)
        h.pt3dadd(len1, 0, 0, self.dend.diam, sec=self.dend)
        h.pt3dadd(len1 + len2, 0, 0, self.dend.diam, sec=self.dend)
    #
    #### build_subsets, rotateZ, and set_location are gone. ####
    #
    #### NEW STUFF ####
    #

    def create_synapses(self):
        """Add an exponentially decaying synapse in the middle
        of the dendrite. Set its tau to 2ms, and append this
        synapse to the synlist of the cell."""
        syn = h.ExpSyn(self.dend(0.5))
        syn.tau = 2
        self.synlist.append(syn)  # synlist is defined in Cell
