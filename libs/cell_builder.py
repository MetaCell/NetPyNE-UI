"""
cell_builder.py
Neuron Cell Builder
"""
import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


class CellBuilder:

    def __init__(self):
        logging.warning('Initializing Cell Builder')

        self.geometry = None
        self.radiusTextField = G.addTextField('Radius', None)
        self.lengthTextField = G.addTextField('Length', None)
        self.save_button = G.addButton('Save', self.modify_segment)

        self.cellBuilderPanel = G.addPanel('Cell Builder', items=[
            self.radiusTextField, self.lengthTextField, self.save_button], widget_id='cellBuilderPanel', positionX=600, positionY=10)
        self.cellBuilderPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.cellBuilderPanel.display()

    def updateValues(self, dataId, groupNameIdentifier):
        logging.warning('Loading values for geometry ' +
                        str(groupNameIdentifier))
        for geometry in GeppettoJupyterModelSync.current_model.geometries:
            if geometry.id == groupNameIdentifier:
                self.geometry = geometry
                self.segment = list(self.geometry.python_variable["section"].allseg())[self.geometry.python_variable["segment"]]
                logging.warning('Bottom Radius ' + str(self.geometry.bottomRadius))
                self.radiusTextField.sync_value = str(self.geometry.bottomRadius)
                logging.warning('Distal X' + str(self.geometry.distalX))
                self.lengthTextField.sync_value = str(self.geometry.distalX)
                return True
        return False

    def modify_segment(self, triggeredComponent, args):
        logging.warning('Modifying segment')
        G.popupVariable('Segment modified', ['Modify segment: ' + str(self.geometry.python_variable["segment"]) + ' at section ' + self.geometry.python_variable["section"].name()])
