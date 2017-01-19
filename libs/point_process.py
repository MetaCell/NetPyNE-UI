"""
point_process.py
Neuron Point Process
"""
import logging
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

from neuron import h


class PointProcess:

    def __init__(self):
        logging.debug('Initializing Point Process')

        self.pointProcesses = []

        delay_panel = neuron_utils.add_text_field_with_label('Delay', None)
        duration_panel = neuron_utils.add_text_field_with_label(
            'Duration', None)
        amplitude_panel = neuron_utils.add_text_field_with_label(
            'Amplitude', None)
        self.delay = delay_panel.items[1]
        self.duration = duration_panel.items[1]
        self.amplitude = amplitude_panel.items[1]
        self.save_button = neuron_utils.add_button(
            'Save', self.create_current_clamp)

        self.pointProcessPanel = neuron_utils.add_panel('Point Process', items=[
            delay_panel, duration_panel, amplitude_panel, self.save_button], widget_id='pointProcessPanel', positionX=600, positionY=10)
        self.pointProcessPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.pointProcessPanel.display()

    def updateValues(self, dataId, geometry_identifier, point):

        logging.debug('Updating values for Point Process')

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == geometry_identifier:
                logging.debug('Loading values for geometry ' +
                              str(geometry_identifier))

                distance_to_selection_normalised = neuron_utils.calculate_normalised_distance_to_selection(
                    geometry, point)
                self.segment = geometry.python_variable[
                    "section"](distance_to_selection_normalised)

                current_point_processes = self.segment.point_processes()
                logging.debug(current_point_processes)
                if len(current_point_processes) > 0:

                    for point_process in current_point_processes:
                        if point_process.hname().startswith('IClamp'):
                            self.delay.sync_value = str(
                                point_process.delay)
                            self.duration.sync_value = str(
                                point_process.dur)
                            self.amplitude.sync_value = str(
                                point_process.amp)
                            logging.debug("Point process found")

                else:
                    logging.debug("No point process found")
                    self.delay.sync_value = str(0.0)
                    self.duration.sync_value = str(0.0)
                    self.amplitude.sync_value = str(0.0)

    def create_current_clamp(self, triggeredComponent, args):
        logging.debug("Creating Current Clamp")
        i_clamp = h.IClamp(self.segment)
        i_clamp.delay = float(self.delay.sync_value)
        i_clamp.dur = float(self.duration.sync_value)
        i_clamp.amp = float(self.amplitude.sync_value)
        self.pointProcesses.append(i_clamp)
