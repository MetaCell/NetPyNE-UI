import logging
import importlib
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

class SampleModels:
    def __init__(self):
        logging.debug('Initializing Samples panel')
        self.items = []
        self.items.append(G.addButton('Very simple cell', self.loadModule,  extraData = {'module': 'verysimple_cell', 'model':'VerySimpleCell'}))    
        self.items.append(G.addButton('Simple cell', self.loadModule,  extraData = {'module': 'simple_cell', 'model':'SimpleCell'}))
        self.items.append(G.addButton('Simple network', self.loadModule,  extraData = {'module': 'simple_network', 'model':'SimpleNetwork'}))
        self.items.append(G.addButton('CA3 Pyramidal', self.loadModule,  extraData = {'module': 'CA3_pyramidal', 'model':'CA3_pyramidal'}))
        self.items.append(G.addButton('Ball and stick', self.loadModule,  extraData = {'module': 'ball_and_stick', 'model':'BallAndStick'}))

        self.loadModelPanel = G.addPanel('Load Models', items = self.items, widget_id = 'loadModelPanel', positionX =90, positionY=10)
        self.loadModelPanel.display() 

    def loadModule(self, triggeredComponent, args):
        try:
            logging.debug('Loading model ' + triggeredComponent.extraData['module'])
            #FIXME: Check if it works in python 2
            module = importlib.import_module("models." + triggeredComponent.extraData['module'])
            GeppettoJupyterModelSync.current_python_model = getattr(module, triggeredComponent.extraData['model'])()

        except Exception as e:
            logging.error("Unexpected error loading model")
            logging.error(str(e))
            raise
