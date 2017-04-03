import logging
import importlib
from neuron_ui import neuron_utils
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from neuron_ui.singleton import Singleton


@Singleton
class SampleModels:

    def __init__(self):
        logging.debug('Initializing Samples panel')
        self.items = []
        self.items.append(neuron_utils.add_button('Single compartment Hodgkin-Huxley',
                                                  self.loadModule, extraData={'module': 'verysimple_cell', 'model': 'VerySimpleCell'}))
        self.items.append(neuron_utils.add_button('Multi compartments Hodgkin-Huxley',
                                                  self.loadModule, extraData={'module': 'simple_cell', 'model': 'SimpleCell'}))
        #self.items.append(neuron_utils.add_button('Simple network', self.loadModule, extraData = {'module': 'simple_network', 'model':'SimpleNetwork'}))
        self.items.append(neuron_utils.add_button(
            'Ring network', self.loadModule, extraData={'module': 'ring', 'model': 'Ring'}))
        self.items.append(neuron_utils.add_button('CA3 Pyramidal', self.loadModule, extraData={
                          'module': 'CA3_pyramidal', 'model': 'CA3_pyramidal'}))
        self.items.append(neuron_utils.add_button(
            'PT Cell', self.loadModule, extraData={'module': 'PTcell', 'model': 'PTcell'}))

        self.loadModelPanel = neuron_utils.add_panel(
            'Sample NEURON Models', items=self.items, widget_id='loadModelPanel', position_x=108, position_y=125, width=287, properties={"closable":False})
        self.loadModelPanel.on_close(self.close)
        self.loadModelPanel.display()

    def close(self, component, args):
        # Close Jupyter object
        self.loadModelPanel.close()
        del self.loadModelPanel

        # Destroy this class
        SampleModels.delete()
        # del RunControl._instance

    def shake_panel(self):
        self.loadModelPanel.shake()

    def loadModule(self, triggeredComponent, args):
        try:
            logging.debug(GeppettoJupyterModelSync.current_python_model)

            if (GeppettoJupyterModelSync.current_python_model is None):
                logging.debug('Loading model ' +
                              triggeredComponent.extraData['module'])
                module = importlib.import_module(
                    "neuron_ui.models." + triggeredComponent.extraData['module'])
                GeppettoJupyterModelSync.current_python_model = getattr(
                    module, triggeredComponent.extraData['model'])()
            else:
                # If there is a model loaded -> Restart kernel server (from js)
                # and load a new model
                GeppettoJupyterModelSync.current_model.reload(
                    triggeredComponent.extraData['module'], triggeredComponent.extraData['model'])

            # Failed attempt to reload the model from python
            # import IPython
            # ipython = IPython.get_ipython()
            # ipython.magic()

        except Exception as e:
            logging.exception("Unexpected error loading model")
            raise
