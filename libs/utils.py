from netpyne import utils
from neuron import h

def extractMorphology():
    secs, secLists, synMechs = utils.getCellParams(None)
    print(secs, secLists, synMechs)