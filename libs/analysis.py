import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

class Analysis:
    def __init__(self):
        logging.warning('Initializing Analysis panle')
        self.analysis_button = G.addButton('Plot', self.run_analysis)
        self.analysis_panel = G.addPanel('Analysis', items = [self.analysis_button], widget_id = 'analysisPanel', positionX =90, positionY=250)
        self.analysis_panel.display()

    def run_analysis(self, triggeredComponent, args):
        logging.warning('Running analysis for current model')
        if GeppettoJupyterModelSync.current_python_model:
            GeppettoJupyterModelSync.current_python_model.analysis()
