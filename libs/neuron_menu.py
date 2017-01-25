import logging
import importlib
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

class NeuronMenu:
    def __init__(self):
        logging.debug('Initializing Neuron Menu')
        self.items = []
        self.items.append(neuron_utils.add_button('Run Control', self.loadModule, extraData = {'module': 'run_control', 'model':'RunControl'}))
        self.items.append(neuron_utils.add_button('Point Process', self.loadModule, extraData = {'module': 'point_process', 'model':'PointProcess'}))
        self.items.append(neuron_utils.add_button('Analysis', self.run_analysis))
        self.items.append(neuron_utils.add_button('Cell Builder', self.loadModule, extraData = {'module': 'cell_builder', 'model':'CellBuilder'}))
        self.items.append(neuron_utils.add_button('Space Plot', self.loadModule, extraData = {'module': 'space_plot', 'model':'SpacePlot'}))

        self.neuronMenuPanel = neuron_utils.add_panel('Neuron', items = self.items, widget_id = 'neuronMenuPanel', position_x =90, position_y=40, width = 900, height = 90)
        self.neuronMenuPanel.setDirection('row')
        self.neuronMenuPanel.display() 

    def loadModule(self, triggeredComponent, args):
        try:
            logging.debug('Loading panel ' + triggeredComponent.extraData['module'])
            #FIXME: Check if it works in python 2
            module = importlib.import_module(triggeredComponent.extraData['module'])
            getattr(module, triggeredComponent.extraData['model'])()

        except Exception as e:
            logging.exception("Unexpected error initialising panel")
            raise

    def run_analysis(self, triggeredComponent, args):
        logging.debug('Running analysis for current model')
        if GeppettoJupyterModelSync.current_python_model:
            GeppettoJupyterModelSync.current_python_model.analysis()
