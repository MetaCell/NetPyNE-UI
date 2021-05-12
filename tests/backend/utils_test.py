import os

from netpyne_ui.netpyne_geppetto import NETPYNE_WORKDIR_PATH
from netpyne_ui import mod_utils
HERE = os.path.dirname(os.path.abspath(__file__))

def test_compile_mod():
    mod_utils.compileModMechFiles(True, NETPYNE_WORKDIR_PATH)
