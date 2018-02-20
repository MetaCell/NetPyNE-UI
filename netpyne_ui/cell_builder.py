"""
cell_builder.py
Neuron Cell Builder
"""
import logging
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils
from neuron_ui.singleton import Singleton
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync

@Singleton
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
            segment_diam_panel, section_diam_panel, section_length_panel, self.save_button], widget_id='cellBuilderPanel', position_x=955, position_y=374, width = 340, height = 190)
        self.cellBuilderPanel.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.cellBuilderPanel.on_close(self.close)    
        self.cellBuilderPanel.display()
    
    def close(self, component, args):
        self.cellBuilderPanel.unregister_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)

        # Close Jupyter object
        self.cellBuilderPanel.close()
        del self.cellBuilderPanel

        # Destroy this class
        CellBuilder.delete()
        # del RunControl._instance

    def shake_panel(self):
        self.cellBuilderPanel.shake()

    def updateValues(self, dataId, geometry_identifier, point):
        try:
            logging.debug('Updating values for Cell Builder')

            for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
                if geometry.id == geometry_identifier:
                    logging.debug('Loading values for geometry ' +
                                  str(geometry_identifier))
                    GeppettoJupyterModelSync.current_model.highlight_visual_group_element(geometry.python_variable["section"].name())

                    # Update segment and geometry
                    distance_to_selection, section_length = neuron_geometries_utils.calculate_distance_to_selection(
                        geometry, point)
                    distance_to_selection_normalised = distance_to_selection/section_length
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
        neuron_geometries_utils.extractGeometries(reload=True)
