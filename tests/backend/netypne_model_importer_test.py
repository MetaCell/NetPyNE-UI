import unittest
import os
import sys
import logging
import json, urllib.request

import netpyne

from netpyne import specs, sim
from netpyne_ui.netpyne_model_interpreter import NetPyNEModelInterpreter
import neuron
import subprocess

from netpyne_ui.netpyne_geppetto import NETPYNE_WORKDIR_PATH
from netpyne_ui.netpyne_geppetto import NetPyNEGeppetto

netpyne.__gui__ = False
sys.path.insert(0, NETPYNE_WORKDIR_PATH)

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

    def test_dict_import_1(self):
        assert 0
        print("------------------------------------")
        print("Dictionary transform importModel:")
        print("------------------------------------")
        
        # response = urllib.request.urlopen("https://www.opensourcebrain.org/projects/netpyneshowcase/repository/revisions/test_py36/raw/NetPyNE/UI/HHCellNetwork.txt.json")        
        netpyne_info = {} #json.loads(response.read())

        # print(type(netpyne_info['net']['params']))

        path = next(filter(lambda p: os.path.join('tests', 'backend') in p, sys.path), None)

        netpyne_info['compileMod'] = False
        netpyne_info['loadMod'] = False
        netpyne_info['modFolder'] = "mod"
        netpyne_info['netParamsPath'] = os.path.join(path, 'models')
        netpyne_info['netParamsModuleName'] = "gui_import_dict"
        netpyne_info['netParamsVariable'] = "netParams"
        netpyne_info['simConfigPath'] = os.path.join(path, 'models')
        netpyne_info['simConfigModuleName'] = "gui_import_dict"
        netpyne_info['simConfigVariable'] = "simConfig"

        netpyne = NetPyNEGeppetto()
        netpyne.importModel(netpyne_info)

    def test_netpyne_exported_model_1(self):
      print("------------------------------------")
      print("Netpyne export model")
      print("------------------------------------")

      params = {}

      HERE = os.path.dirname(os.path.realpath(__file__))
      ROOT = os.path.dirname(HERE)

      params["areModFieldsRequired"] = False
      params["compileMod"] = False
      params["exploreOnlyDirs"] = False
      params["explorerDialogOpen"] = False
      params["explorerParameter"] = ""
      params["freezeInstance"] = True
      params["freezeSimulation"] = True
      params["jsonModelFolder"] = ROOT + "/workspace/HHCellNetwork.txt_data.json"
      params["jsonPath"] = ""
      params["loadNet"] = True
      params["loadNetParams"] = True
      params["loadSimCfg"] = True
      params["loadSimData"] = True
      params["modFolder"] = ""
      params["modPath"] = ""
      params["tab"] = "simulate"

      netpyne = NetPyNEGeppetto()

      netpyne.loadModel(params)
      netpyne.instantiateNetPyNEModel()

      return False

if __name__ == '__main__':
    try:
        unittest.main()
    except SystemExit as inst:
        if inst.args[0]:  # raised by sys.exit(True) when tests failed
            raise
