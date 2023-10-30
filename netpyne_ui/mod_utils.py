import logging
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


def loadModMechFiles(compileMod, modFolder, forceRecompile=False):
    # Create Symbolic link

        try:

            owd = os.getcwd()
            if compileMod:
                
                compiledModPath = os.path.join(str(modFolder), "x86_64")

                if os.path.exists(compiledModPath) and forceRecompile:
                        logging.info("Forcing mod files to recompile in %s" % modFolder)
                        shutil.rmtree(compiledModPath)

                if not os.path.exists(compiledModPath):
                    logging.info("Compiling mod files in %s" % modFolder)
                    os.chdir(modFolder)
                    subprocess.call(["nrnivmodl"])
                    os.chdir('..')

            try:
                neuron.load_mechanisms(str(modFolder))
            except:
                logging.exception("Error loading mechanisms")
                if not forceRecompile:
                    logging.info("Trying to recompile mod files")
                    loadModMechFiles(True, modFolder, forceRecompile=True)
                raise
        finally:
            os.chdir(owd)
