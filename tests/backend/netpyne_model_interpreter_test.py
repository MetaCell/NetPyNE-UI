import unittest
import os
import sys
import logging

import netpyne

from netpyne import specs, sim
from netpyne_ui.netpyne_model_interpreter import NetPyNEModelInterpreter
import neuron
import subprocess

from netpyne_ui.netpyne_geppetto import NETPYNE_WORKDIR_PATH

netpyne.__gui__ = False
sys.path.insert(0, NETPYNE_WORKDIR_PATH)

import sentry_sdk
sentry_sdk.init()


class TestNetPyNEModelInterpreter(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        HERE = os.path.dirname(os.path.realpath(__file__))
        ROOT = os.path.dirname(HERE)
        cls.path = NETPYNE_WORKDIR_PATH
        modelpath = os.path.join(NETPYNE_WORKDIR_PATH, 'mod')
        subprocess.call(["rm", "-r", os.path.join(modelpath, "x86_64")])
        owd = os.getcwd()
        os.chdir(modelpath)
        p = subprocess.check_output(["nrnivmodl"])
        os.chdir(owd)
        try:
            neuron.load_mechanisms(modelpath)
        except:
            logging.error("Error loading mechanisms", exc_info=True)

    def getGeppettoModel(self, netParams, simConfig):
        sim.create(netParams, simConfig, True)
        sim.gatherData()

        modelInterpreter = NetPyNEModelInterpreter()
        geppettoModel = modelInterpreter.getGeppettoModel(sim)
        sim.analyze()

    def test_getGeppettoModelSimpleNetwork(self):
        # object of class NetParams to store the network parameters
        netParams = specs.NetParams()
        # object of class SimConfig to store the simulation configuration
        simConfig = specs.SimConfig()
        # add dict with params for this pop
        netParams.popParams['PYR'] = {
            'cellModel': 'HH', 'cellType': 'PYR', 'numCells': 20}
        cellRule = {'conds': {'cellModel': 'HH', 'cellType': 'PYR'},
                    'secs': {}}  # cell rule dict
        # soma params dict
        cellRule['secs']['soma'] = {'geom': {}, 'mechs': {}}
        cellRule['secs']['soma']['geom'] = {
            'diam': 18.8, 'L': 18.8, 'Ra': 123.0}  # soma geometry
        cellRule['secs']['soma']['mechs']['hh'] = {
            'gnabar': 0.12, 'gkbar': 0.036, 'gl': 0.003, 'el': -70}  # soma hh mechanism
        cellRule['secs']['soma']['vinit'] = -71
        # add dict to list of cell params
        netParams.cellParams['PYR'] = cellRule
        netParams.synMechParams['AMPA'] = {
            'mod': 'Exp2Syn', 'tau1': 0.1, 'tau2': 1.0, 'e': 0}
        netParams.stimSourceParams['bkg'] = {
            'type': 'NetStim', 'rate': 10, 'noise': 0.5, 'start': 1}
        netParams.stimTargetParams['bkg->PYR1'] = {'source': 'bkg', 'conds': {
            'pop': 'PYR'}, 'weight': 0.1, 'delay': 'uniform(1,5)'}
        netParams.connParams['PYR->PYR'] = {
            'preConds': {'pop': 'PYR'}, 'postConds': {'pop': 'PYR'},
            'weight': 0.002,  # weight of each connection
            # delay min=0.2, mean=13.0, var = 1.4
            'delay': '0.2+normal(13.0,1.4)',
            'threshold': 10,  # threshold
            'convergence': 'uniform(1,15)'}  # convergence (num presyn targeting postsyn) is uniformly distributed between 1 and 15

        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut1(self):
        print("------------------------------------")
        print("Tutorial 1 Instantiation:")
        print("------------------------------------")
        from gui_tut1 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut2(self):
        print("------------------------------------")
        print("Tutorial 2 Instantiation:")
        print("------------------------------------")
        from gui_tut2 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut3(self):
        print("------------------------------------")
        print("Tutorial 3 Instantiation:")
        print("------------------------------------")
        from gui_tut3 import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut4(self):
        print("------------------------------------")
        print("Tutorial 3 ip3high Instantiation:")
        print("------------------------------------")

        from gui_tut3_ip3high import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut5(self):
        print("------------------------------------")
        print("Tutorial 3 norxd Instantiation:")
        print("------------------------------------")
        from gui_tut3_norxd import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    @unittest.skip("Neuron restart kernel issue")
    def test_tut6(self):
        print("------------------------------------")
        print("Tutorial 3 osc Instantiation:")
        print("------------------------------------")
        from gui_tut_osc import netParams, simConfig
        self.getGeppettoModel(netParams, simConfig)

    def test_Hnn(self):
        print("------------------------------------")
        print("HNN Instantiation:")
        print("------------------------------------")

        from hnn_simple import netParams, cfg
        self.getGeppettoModel(netParams, cfg)


if __name__ == '__main__':
    try:
        unittest.main()
    except SystemExit as inst:
        if inst.args[0]:  # raised by sys.exit(True) when tests failed
            raise
