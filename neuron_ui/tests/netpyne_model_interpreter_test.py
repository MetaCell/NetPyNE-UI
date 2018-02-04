import unittest
import netpyne
netpyne.__gui__ = False
from netpyne import specs, sim
import os
from neuron_ui.netpyne_model_interpreter import NetPyNEModelInterpreter
import neuron
import subprocess

class TestNetPyNEModelInterpreter(unittest.TestCase):

    def getGeppettoModel(self, netParams, simConfig):
        sim.create(netParams, simConfig, True)
        sim.gatherData()

        modelInterpreter = NetPyNEModelInterpreter()
        geppettoModel= modelInterpreter.getGeppettoModel(sim)
        sim.analyze()

    def updateGeppettoModel(self, netParams, simConfig):
        sim.create(netParams, simConfig, True)
        sim.gatherData()

        modelInterpreter = NetPyNEModelInterpreter()
        geppettoModel= modelInterpreter.getGeppettoModel(sim)

        sim.simulate()
        sim.analyze()

        modelInterpreter.updateGeppettoModel(sim, geppettoModel)

    def test_getGeppettoModelSimpleNetwork(self):
        netParams = specs.NetParams()   # object of class NetParams to store the network parameters
        simConfig = specs.SimConfig()   # object of class SimConfig to store the simulation configuration
        netParams.popParams['PYR'] = {'cellModel': 'HH', 'cellType': 'PYR', 'numCells': 20} # add dict with params for this pop 
        cellRule = {'conds': {'cellModel': 'HH', 'cellType': 'PYR'},  'secs': {}} 	# cell rule dict
        cellRule['secs']['soma'] = {'geom': {}, 'mechs': {}}  														# soma params dict
        cellRule['secs']['soma']['geom'] = {'diam': 18.8, 'L': 18.8, 'Ra': 123.0}  									# soma geometry
        cellRule['secs']['soma']['mechs']['hh'] = {'gnabar': 0.12, 'gkbar': 0.036, 'gl': 0.003, 'el': -70}  		# soma hh mechanism
        cellRule['secs']['soma']['vinit'] = -71
        netParams.cellParams['PYR'] = cellRule  												# add dict to list of cell params
        netParams.synMechParams['AMPA'] = {'mod': 'Exp2Syn', 'tau1': 0.1, 'tau2': 1.0, 'e': 0}
        netParams.stimSourceParams['bkg'] = {'type': 'NetStim', 'rate': 10, 'noise': 0.5, 'start': 1}
        netParams.stimTargetParams['bkg->PYR1'] = {'source': 'bkg', 'conds': {'pop': 'PYR'}, 'weight': 0.1, 'delay': 'uniform(1,5)'}
        netParams.connParams['PYR->PYR'] = {
            'preConds': {'pop': 'PYR'}, 'postConds': {'pop': 'PYR'},
            'weight': 0.002,                    # weight of each connection
            'delay': '0.2+normal(13.0,1.4)',     # delay min=0.2, mean=13.0, var = 1.4
            'threshold': 10,                    # threshold
            'convergence': 'uniform(1,15)'}    # convergence (num presyn targeting postsyn) is uniformly distributed between 1 and 15
        
        self.getGeppettoModel(netParams, simConfig)
    
    def test_tut1(self):
        print "------------------------------------"
        print "Tutorial 1 Instantiation:"
        print "------------------------------------"
        from neuron_ui.tests.tut1 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut1_simulation(self):
        print "------------------------------------"
        print "Tutorial 1 Simulation:"
        print "------------------------------------"
        from neuron_ui.tests.tut1 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)

    def test_tut2(self):
        print "------------------------------------"
        print "Tutorial 2 Instantiation:"
        print "------------------------------------"
        from neuron_ui.tests.tut2 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut2_simulation(self):
        print "------------------------------------"
        print "Tutorial 2 Simulation:"
        print "------------------------------------"
        from neuron_ui.tests.tut2 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)

    def test_tut3(self):
        print "------------------------------------"
        print "Tutorial 3 Instantiation:"
        print "------------------------------------"
        from neuron_ui.tests.tut3 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut3_simulation(self):
        print "------------------------------------"
        print "Tutorial 3 Simulation:"
        print "------------------------------------"
        from neuron_ui.tests.tut3 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)
        
    def test_tut4(self):
        print "------------------------------------"
        print "Tutorial 4 Instantiation:"
        print "------------------------------------"
        modelpath = os.path.join(os.path.dirname(__file__), 'tut4')
        subprocess.call(["rm", "-r", os.path.join(modelpath,"x86_64")])
        owd = os.getcwd()
        os.chdir(modelpath)
        p = subprocess.check_output(["nrnivmodl"])
        os.chdir(owd)   
        neuron.load_mechanisms(modelpath)

        from neuron_ui.tests.tut4.tut4 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut4_simulation(self):
        print "------------------------------------"
        print "Tutorial 4 Simulation:"
        print "------------------------------------"
        modelpath = os.path.join(os.path.dirname(__file__), 'tut4')
        subprocess.call(["rm", "-r", os.path.join(modelpath,"x86_64")])
        owd = os.getcwd()
        os.chdir(modelpath)
        p = subprocess.check_output(["nrnivmodl"])
        os.chdir(owd)   
        neuron.load_mechanisms(modelpath)

        from neuron_ui.tests.tut4.tut4 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)

    def test_tut5(self):
        print "------------------------------------"
        print "Tutorial 5 Instantiation:"
        print "------------------------------------"
        from neuron_ui.tests.tut5 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut5_simulation(self):
        print "------------------------------------"
        print "Tutorial 5 Simulation:"
        print "------------------------------------"
        from neuron_ui.tests.tut5 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)

    def test_tut6(self):
        print "------------------------------------"
        print "Tutorial 6 Instantiation:"
        print "------------------------------------"
        from neuron_ui.tests.tut6 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_tut6_simulation(self):
        print "------------------------------------"
        print "Tutorial 6 Simulation:"
        print "------------------------------------"
        from neuron_ui.tests.tut6 import netParams, simConfig
        self.updateGeppettoModel(netParams, simConfig)

if __name__ == '__main__':
    try:
        unittest.main()
    except SystemExit as inst:
        if inst.args[0]: # raised by sys.exit(True) when tests failed
            raise
