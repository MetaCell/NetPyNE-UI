import logging
import importlib
from . import neuron_utils
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from neuron_ui.singleton import Singleton
from neuron_ui.point_process import PointProcess
from neuron_ui.space_plot import SpacePlot
from neuron_ui.cell_builder import CellBuilder
from neuron_ui.run_control import RunControl


@Singleton
class NeuronMenu:

    def __init__(self):
        logging.debug('Initializing Neuron Menu')
        self.currentGUI = None
        self.items = []
        self.items.append(neuron_utils.add_button(
            'Run Control', self.show_run_control))
        self.items.append(neuron_utils.add_button(
            'Point Process', self.show_point_process))
        # self.items.append(neuron_utils.add_button('Analysis', self.run_analysis))
        self.items.append(neuron_utils.add_button(
            'Cell Builder', self.show_cell_builder))
        self.items.append(neuron_utils.add_button(
            'Space Plot', self.show_space_plot))

        self.neuronMenuPanel = neuron_utils.add_panel(
            'NEURON', items=self.items, widget_id='neuronMenuPanel', position_x=108, position_y=9, width=485, height=80, properties={"closable": False})
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
        if hasattr(CellBuilder, '_instance') and CellBuilder._instance is not None:
            CellBuilder._instance.close(None, None)
        if hasattr(SpacePlot, '_instance') and SpacePlot._instance is not None:
            SpacePlot._instance.close(None, None)
        self.currentGUI = PointProcess.Instance()
        self.neuronMenuPanel.widget_name = "NEURON | Select a point to inject a current clump"

    def show_space_plot(self, triggeredComponent, args):
        # if self.currentGUI is not None and not self.is_instance(SpacePlot):
        #     self.currentGUI.close(None,None)
        if hasattr(PointProcess, '_instance') and PointProcess._instance is not None:
            PointProcess._instance.close(None, None)
        if hasattr(CellBuilder, '_instance') and CellBuilder._instance is not None:
            CellBuilder._instance.close(None, None)
        self.currentGUI = SpacePlot.Instance()
        self.neuronMenuPanel.widget_name = "NEURON | Select a section to record the membrane potential"

    def show_cell_builder(self, triggeredComponent, args):

        if hasattr(PointProcess, '_instance') and PointProcess._instance is not None:
            PointProcess._instance.close(None, None)
        if hasattr(SpacePlot, '_instance') and SpacePlot._instance is not None:
            SpacePlot._instance.close(None, None)
        # if self.currentGUI is not None and not isinstance(self.currentGUI, CellBuilder):
        #     self.currentGUI.close(None,None)
            # self.currentGUI.destroy()
        self.currentGUI = CellBuilder.Instance()
        self.neuronMenuPanel.widget_name = "NEURON | Select a section to change its dimensions"

    def show_run_control(self, triggeredComponent, args):
        RunControl.Instance()
