"""
point_process.py
Neuron Point Process
"""
import logging
from neuron_ui import neuron_utils
from neuron_ui import neuron_geometries_utils
from neuron_ui.singleton import Singleton
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync

from neuron import h


@Singleton
class PointProcess:

    def __init__(self):
        logging.debug('Initializing Point Process')

        # self.point_processes = None
        self.current_point_process = None

        drop_down_panel = neuron_utils.add_drop_down_with_label(
            'Current Clamps', [{'id': 'noSelection', 'value': 'No segment selected'}])
        delay_panel = neuron_utils.add_text_field_with_label('Delay', None)
        duration_panel = neuron_utils.add_text_field_with_label(
            'Duration', None)
        amplitude_panel = neuron_utils.add_text_field_with_label(
            'Amplitude', None)
        i_panel = neuron_utils.add_text_field_with_label(
            'i', None)
        self.drop_down = drop_down_panel.items[1]
        self.drop_down.on_change(self.update_drop_down_selection)
        self.delay = delay_panel.items[1]
        self.duration = duration_panel.items[1]
        self.amplitude = amplitude_panel.items[1]
        self.i = i_panel.items[1]
        self.save_button = neuron_utils.add_button(
            'Save', self.create_current_clamp)

        self.pointProcessPanel = neuron_utils.add_panel('Point Process', items=[
            drop_down_panel, delay_panel, duration_panel, amplitude_panel, i_panel, self.save_button], widget_id='pointProcessPanel', position_x=955, position_y=69, width=340, height=277)
        self.pointProcessPanel.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.pointProcessPanel.on_close(self.close)
        self.pointProcessPanel.display()

    def close(self, component, args):
        self.pointProcessPanel.unregister_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)

        # Close Jupyter object
        self.pointProcessPanel.close()
        del self.pointProcessPanel

        if GeppettoJupyterModelSync.current_model is not None:
            GeppettoJupyterModelSync.current_model.removeSphere()

        # Destroy this class
        PointProcess.delete()
        # del RunControl._instance

    def shake_panel(self):
        self.pointProcessPanel.shake()

    def update_drop_down_selection(self, triggered_component, args):
        logging.debug("Update drop drown")
        if args['data'] == 'new':
            self.init_panel_for_new_point_process()
        else:
            for point_process in self.segment.point_processes():
                if args['data'] == point_process.name():
                    self.init_panel_for_point_process(point_process)

    def updateValues(self, dataId, geometry_identifier, point):

        logging.debug('Updating values for Point Process')
        if geometry_identifier == "":
            GeppettoJupyterModelSync.current_model.removeSphere()
        else:
            for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:

                if geometry.id == geometry_identifier:
                    logging.debug('Loading values for geometry ' +
                                  str(geometry_identifier))
                    GeppettoJupyterModelSync.current_model.highlight_visual_group_element(
                        geometry.python_variable["section"].name())

                    # Calculate distance to selection
                    distance_to_selection, section_length = neuron_geometries_utils.calculate_distance_to_selection(
                        geometry, point)

                    # Normalise distance to selection
                    distance_to_selection_normalised = distance_to_selection / section_length
                    # Get Segment
                    self.segment = geometry.python_variable[
                        "section"](distance_to_selection_normalised)

                    # Get Point Processes for segment and init panel
                    self.drop_down.items = []
                    point_processes = self.segment.point_processes()
                    if len(point_processes) > 0:
                        for point_process in point_processes:
                            if point_process.hname().startswith('IClamp'):
                                logging.debug(
                                    "Point process found with name " + point_process.hname())
                                self.init_panel_for_point_process(
                                    point_process)
                                self.drop_down.add_child(
                                    {'id': point_process.hname(), 'value': point_process.hname()})

                    else:
                        logging.debug("No point process found")
                        self.init_panel_for_new_point_process()

                    # Add new point process option
                    self.drop_down.add_child(
                        {'id': 'new', 'value': 'New Point Process'})

                    # Calculate actual segment position => segment.x
                    #nseg = len(geometry.python_variable["section_points"]) - 1
                    seg_loc = neuron_geometries_utils.calculate_segment_location(geometry.python_variable[
                        "section"].nseg, distance_to_selection_normalised, section_length)

                    # Calculate distance to cylinder location origin and distal and
                    # proximal points
                    distal, proximal, distance_to_seg_loc = neuron_geometries_utils.calculate_distance_to_cylinder_location(
                        geometry, seg_loc)

                    # Calculate radius for sphere depending on segment radiues
                    sphere_coordinates, average_radius = neuron_geometries_utils.calculate_sphere_coordinates_and_radius(
                        distal, proximal, seg_loc, distance_to_seg_loc)

                    # Draw Sphere on middle segment point
                    GeppettoJupyterModelSync.current_model.drawSphere(sphere_coordinates[0], sphere_coordinates[
                        1], sphere_coordinates[2], average_radius * 2)

    def create_current_clamp(self, triggered_component, args):
        logging.debug("Creating Current Clamp")
        if self.current_point_process is None:
            # Init point process variable on current python model
            if not hasattr(GeppettoJupyterModelSync.current_python_model, 'point_processes'):
                GeppettoJupyterModelSync.current_python_model.point_processes = []

            # Create current clamp
            point_process = self.create_neuron_current_clamp()

            # Refresh dropdown
            self.drop_down.add_child(
                {'id': point_process.hname(), 'value': point_process.hname()})
            self.drop_down.sync_value = point_process.hname()
        else:
            # Update current point process
            self.update_neuron_current_clamp()

    def update_neuron_current_clamp(self):
        self.current_point_process.delay = float(self.delay.sync_value)
        self.current_point_process.dur = float(self.duration.sync_value)
        self.current_point_process.amp = float(self.amplitude.sync_value)
        self.current_point_process.i = float(self.i.sync_value)

    def create_neuron_current_clamp(self):
        point_process = h.IClamp(self.segment)
        point_process.delay = float(self.delay.sync_value)
        point_process.dur = float(self.duration.sync_value)
        point_process.amp = float(self.amplitude.sync_value)
        point_process.i = float(self.i.sync_value)
        GeppettoJupyterModelSync.current_python_model.point_processes.append(
            point_process)
        self.current_point_process = point_process
        return point_process

    def init_panel_for_new_point_process(self):
        self.current_point_process = None
        self.delay.sync_value = str(0.0)
        self.duration.sync_value = str(0.0)
        self.amplitude.sync_value = str(0.0)
        self.i.sync_value = str(0.0)
        self.drop_down.sync_value = 'new'

    def init_panel_for_point_process(self, point_process):
        self.current_point_process = point_process
        self.delay.sync_value = str(
            point_process.delay)
        self.duration.sync_value = str(
            point_process.dur)
        self.amplitude.sync_value = str(
            point_process.amp)
        self.i.sync_value = str(
            point_process.i)
        self.drop_down.sync_value = point_process.hname()
