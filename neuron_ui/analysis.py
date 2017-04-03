import logging
from neuron_ui import neuron_utils
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync


class Analysis:

    def __init__(self):
        logging.debug('Initializing Analysis panel')
        self.analysis_button = neuron_utils.add_button(
            'Plot', self.run_analysis)
        self.analysis_panel = neuron_utils.add_panel('Analysis', items=[
                                                     self.analysis_button], widget_id='analysisPanel', position_x=90, position_y=250)
        self.analysis_panel.display()

    def run_analysis(self, triggeredComponent, args):
        logging.debug('Running analysis for current model')
        if GeppettoJupyterModelSync.current_python_model:
            GeppettoJupyterModelSync.current_python_model.analysis()
