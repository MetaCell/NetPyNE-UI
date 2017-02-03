import logging
import importlib
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from singleton import Singleton

@Singleton
class NeuronMenu:
    def __init__(self):
        logging.debug('Initializing Neuron Menu')
        self.items = []
        self.items.append(neuron_utils.add_button('Run Control', self.show_run_control))
        self.items.append(neuron_utils.add_button('Point Process', self.show_point_process))
        # self.items.append(neuron_utils.add_button('Analysis', self.run_analysis))
        self.items.append(neuron_utils.add_button('Cell Builder', self.show_cell_builder))
        self.items.append(neuron_utils.add_button('Space Plot', self.show_space_plot))

        self.neuronMenuPanel = neuron_utils.add_panel('NEURON', items = self.items, widget_id = 'neuronMenuPanel', position_x =108, position_y=9, width = 570, height = 80)
        self.neuronMenuPanel.setDirection('row')
        self.neuronMenuPanel.on_close(self.close)
        self.neuronMenuPanel.display()

    def close(self, component, args):
        # Close Jupyter object
        self.neuronMenuPanel.close()
        del self.neuronMenuPanel

        # Destroy this class
        NeuronMenu.delete()
        # del RunControl._instance

    def shake_panel(self):
        self.neuronMenuPanel.shake()

    def show_point_process(self, triggeredComponent, args):
        from point_process import PointProcess
        PointProcess.Instance()

    def show_space_plot(self, triggeredComponent, args):
        from space_plot import SpacePlot
        SpacePlot.Instance()

    def show_cell_builder(self, triggeredComponent, args):
        from cell_builder import CellBuilder
        CellBuilder.Instance()

    def show_run_control(self, triggeredComponent, args):
        from run_control import RunControl
        RunControl.Instance()



    # def loadModule(self, triggeredComponent, args):
    #     try:
    #         logging.debug('Loading panel ' + triggeredComponent.extraData['module'])
    #         module = importlib.import_module(triggeredComponent.extraData['module'])
    #         getattr(module, triggeredComponent.extraData['model'])()

    #     except Exception as e:
    #         logging.exception("Unexpected error initialising panel")
    #         raise

    # def run_analysis(self, triggeredComponent, args):
    #     logging.debug('Running analysis for current model')
    #     if GeppettoJupyterModelSync.current_python_model:
    #         GeppettoJupyterModelSync.current_python_model.analysis()
