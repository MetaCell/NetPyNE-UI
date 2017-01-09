import logging
import importlib
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

from neuron import h

class SampleModels:
    def __init__(self):
        logging.debug('Initializing Samples panel')
        self.items = []
        self.items.append(neuron_utils.add_button('Very simple cell', self.loadModule, extraData = {'module': 'verysimple_cell', 'model':'VerySimpleCell'}))    
        self.items.append(neuron_utils.add_button('Simple cell', self.loadModule, extraData = {'module': 'simple_cell', 'model':'SimpleCell'}))
        self.items.append(neuron_utils.add_button('Simple network', self.loadModule, extraData = {'module': 'simple_network', 'model':'SimpleNetwork'}))
        self.items.append(neuron_utils.add_button('CA3 Pyramidal', self.loadModule, extraData = {'module': 'CA3_pyramidal', 'model':'CA3_pyramidal'}))
        self.items.append(neuron_utils.add_button('Ball and stick', self.loadModule, extraData = {'module': 'ball_and_stick', 'model':'BallAndStick'}))

        self.loadModelPanel = neuron_utils.add_panel('Load Models', items = self.items, widget_id = 'loadModelPanel', positionX =90, positionY=10)
        self.loadModelPanel.display() 

    def loadModule(self, triggeredComponent, args):
        try:
            #FIXME: Not working when moving from CA3 Pyramidal to simple cell
            h('forall delete_section()')

            logging.debug('Loading model ' + triggeredComponent.extraData['module'])
            #FIXME: Check if it works in python 2
            module = importlib.import_module("models." + triggeredComponent.extraData['module'])
            GeppettoJupyterModelSync.current_python_model = getattr(module, triggeredComponent.extraData['model'])()

        except Exception as e:
            logging.exception("Unexpected error loading model")
            raise
