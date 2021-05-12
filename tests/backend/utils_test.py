import os

from netpyne_ui import mod_utils
HERE = os.path.dirname(os.path.abspath(__file__))

def test_compile_mod():
    mod_utils.compileModMechFiles(True, os.path.join(HERE, 'mod'))
    mod_utils.compileModMechFiles(True, os.path.join(HERE, 'mod'))  # Will be ignored by neuron thanks to neuron.nrn_dll_loaded

    # mod_utils.compileModMechFiles(True, os.path.join(HERE, './mod')) # this is enough to fool Neuron