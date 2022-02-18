import shutil
import subprocess
import os

import neuron
from neuron import h


def is_loaded_mechanisms():
    # copied from:
    # https://www.neuron.yale.edu/neuron/static/py_doc/modelspec/programmatic/mechtype.html
    mt = h.MechanismType(0)
    mname = h.ref('')
    mnames = list()
    for i in range(mt.count()):
        mt.select(i)
        mt.selected(mname)
        mnames.append(mname[0])

    # note this check only works for the original hnn model
    # need to generalize for any model

    if 'hh2' not in mnames:
        return False
    else:
        return True

loaded_mods = set()

def compileModMechFiles(compileMod, modFolder):
    # Create Symbolic link
    if compileMod and modFolder not in loaded_mods:
        modPath = os.path.join(str(modFolder), "x86_64")

        if os.path.exists(modPath):
            shutil.rmtree(modPath)

        os.chdir(modFolder)
        subprocess.call(["nrnivmodl"])
        os.chdir('..')

        try:
            neuron.load_mechanisms(str(modFolder))
        except:
            raise
    loaded_mods.add(modFolder)