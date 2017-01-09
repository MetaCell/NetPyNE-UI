"""
cell_builder.py
Neuron Cell Builder
"""
import logging
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


class CellBuilder:

    def __init__(self):
        logging.debug('Initializing Cell Builder')

        self.geometry = None
        self.segment = None
        self.radiusTextField = neuron_utils.add_text_field('Radius', None)
        self.lengthTextField = neuron_utils.add_text_field('Length', None)
        self.save_button = neuron_utils.add_button('Save', self.modify_segment)

        self.cellBuilderPanel = neuron_utils.add_panel('Cell Builder', items=[
            self.radiusTextField, self.lengthTextField, self.save_button], widget_id='cellBuilderPanel', positionX=600, positionY=10)
        self.cellBuilderPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.cellBuilderPanel.display()

    def updateValues(self, dataId, groupNameIdentifier):
        logging.debug('Updating values for Cell Builder')

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == groupNameIdentifier:
                logging.debug('Loading values for geometry ' +
                              str(groupNameIdentifier))

                #Update values   
                self.radiusTextField.sync_value = str(geometry.bottomRadius)
                self.lengthTextField.sync_value = str(geometry.distalX)

                #Update segment and geometry
                #self.segment = list(geometry.python_variable["section"].allseg())[geometry.python_variable["segment"]]
                self.segment = geometry.python_variable[
                    "section"](geometry.python_variable["segment"])
                self.geometry = geometry
                
                return True
        return False

    def modify_segment(self, triggeredComponent, args):
        logging.debug('Modifying segment')
        G.popupVariable('Segment modified', ['Modify segment: ' + str(self.geometry.python_variable[
                        "segment"]) + ' at section position ' + self.geometry.python_variable["section"].name()])
