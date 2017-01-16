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
        radius_panel = neuron_utils.add_text_field_with_label('Radius', None)
        length_panel = neuron_utils.add_text_field_with_label('Length', None)

        # Get textfields from panels
        self.radius = radius_panel.items[1]
        self.length = length_panel.items[1]
        self.save_button = neuron_utils.add_button('Save', self.modify_segment)

        self.cellBuilderPanel = neuron_utils.add_panel('Cell Builder', items=[
            radius_panel, length_panel, self.save_button], widget_id='cellBuilderPanel', positionX=600, positionY=10)
        self.cellBuilderPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.cellBuilderPanel.display()

    def updateValues(self, dataId, groupNameIdentifier):
        try:
            logging.debug('Updating values for Cell Builder')

            for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
                if geometry.id == groupNameIdentifier:
                    logging.debug('Loading values for geometry ' +
                                  str(groupNameIdentifier))

                    # Update values
                    self.radius.sync_value = str(
                        geometry.python_variable["section"].diam)
                    self.length.sync_value = str(
                        geometry.python_variable["section"].L)

                    # Update segment and geometry
                    self.segment = geometry.python_variable[
                        "section"](geometry.python_variable["segment"])
                    self.geometry = geometry

                    return True
            return False
        except Exception as exception:
            logging.exception(
                "Unexpected error executing callback for component:")
            raise

    def modify_segment(self, triggeredComponent, args):
        logging.debug('Modifying segment')
        self.geometry.python_variable[
            "section"].diam = float(self.radius.sync_value)
        self.geometry.python_variable[
            "section"].L = float(self.length.sync_value)

        # Recreating Scene
        neuron_utils.extractGeometries()
