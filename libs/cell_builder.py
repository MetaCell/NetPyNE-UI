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
        section_diam_panel = neuron_utils.add_text_field_with_label('Section Diam', None)
        section_length_panel = neuron_utils.add_text_field_with_label('Section Length', None)

        segment_diam_panel = neuron_utils.add_text_field_with_label(
            'Segment Diam', None)

        # Get textfields from panels
        self.section_diam = section_diam_panel.items[1]
        self.section_length = section_length_panel.items[1]
        self.segment_diam = segment_diam_panel.items[1]
        self.save_button = neuron_utils.add_button('Save', self.modify_segment)

        self.cellBuilderPanel = neuron_utils.add_panel('Cell Builder', items=[
            segment_diam_panel, section_diam_panel, section_length_panel, self.save_button], widget_id='cellBuilderPanel', positionX=600, positionY=10)
        self.cellBuilderPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.cellBuilderPanel.display()

    def updateValues(self, dataId, geometry_identifier, point):
        try:
            logging.debug('Updating values for Cell Builder')

            for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
                if geometry.id == geometry_identifier:
                    logging.debug('Loading values for geometry ' +
                                  str(geometry_identifier))

                    # Update segment and geometry
                    distance_to_selection_normalised = neuron_utils.calculate_normalised_distance_to_selection(
                        geometry, point)
                    self.segment = geometry.python_variable[
                        "section"](distance_to_selection_normalised)
                    self.geometry = geometry

                    # Update values
                    self.segment_diam.sync_value =  str(
                        self.segment.diam)
                    self.section_diam.sync_value = str(
                        geometry.python_variable["section"].diam)
                    self.section_length.sync_value = str(
                        geometry.python_variable["section"].L)

                    return True
            return False
        except Exception as exception:
            logging.exception(
                "Unexpected error executing callback for component:")
            raise

    def modify_segment(self, triggeredComponent, args):
        logging.debug('Modifying segment')
        self.geometry.python_variable[
            "section"].diam = float(self.section_diam.sync_value)
        self.geometry.python_variable[
            "section"].L = float(self.section_length.sync_value)
        self.segment = float(self.segment_diam.sync_value)

        # Recreating Scene
        neuron_utils.extractGeometries()
