import unittest
import netpyne
netpyne.__gui__ = False
from netpyne import specs, sim
from neuron_ui.netpyne_model_interpreter import NetPyNEModelInterpreter

class TestNetPyNEModelInterpreter(unittest.TestCase):

    def test_getGeppettoModel(self):
        print "------------------------------------"
        print "Testing creation of a Geppetto Model"
        print "------------------------------------"
        modelInterpreter = NetPyNEModelInterpreter()
        netPyNEModel=self.createNetPyNETestModel()
        geppettoModel=modelInterpreter.getGeppettoModel(netPyNEModel)
        print "------------------------------------"
        print "A Geppetto model was created:"
        print "------------------------------------"
        print geppettoModel

    def createNetPyNETestModel(self):
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
        simConfig.createNEURONObj = 1  # create HOC objects when instantiating network
        simConfig.createPyStruct = 1  # create Python structure (simulator-independent) when instantiating network
        simConfig.verbose = False  # show detailed messages 
        return self.instantiateNetPyNEModel(netParams,simConfig)

    def instantiateNetPyNEModel(self, netParams, simConfig):
        print "------------------------------------"
        print 'Instantiating NetPyNE model'
        print "------------------------------------"
        sim.create(netParams, simConfig, True)
        sim.gatherData()
        return sim

if __name__ == '__main__':

    unittest.main()