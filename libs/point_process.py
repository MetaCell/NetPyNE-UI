"""
point_process.py
Neuron Point Process
"""
import logging
# from IPython.core.debugger import Tracer
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

from neuron import h


class PointProcess:

    def __init__(self):
        logging.debug('Initializing Point Process')

        self.pointProcesses = []

        delay_panel = neuron_utils.add_text_field_with_label('Delay', None)
        duration_panel = neuron_utils.add_text_field_with_label('Duration', None)
        amplitude_panel = neuron_utils.add_text_field_with_label('Amplitude', None)
        self.delay = delay_panel.items[1]
        self.duration = duration_panel.items[1]
        self.amplitude = amplitude_panel.items[1]
        self.save_button = neuron_utils.add_button('Save', self.create_current_clamp)

        self.pointProcessPanel = neuron_utils.add_panel('Point Process', items=[
            delay_panel, duration_panel, amplitude_panel, self.save_button], widget_id='pointProcessPanel', positionX=600, positionY=10)
        self.pointProcessPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.pointProcessPanel.display()

    def updateValues(self, dataId, groupNameIdentifier):
        logging.debug('Updating values for Point Process')

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == groupNameIdentifier:
                logging.debug('Loading values for geometry ' +
                              str(groupNameIdentifier))

                #self.segment = list(geometry.python_variable["section"].allseg())[geometry.python_variable["segment"]]
                self.segment = geometry.python_variable[
                    "section"](geometry.python_variable["segment"])

                current_point_processes = self.segment.point_processes()
                logging.debug(current_point_processes)
                # Tracer()()
                if len(current_point_processes) == 1:
                    logging.debug("Point process found")
                    self.delay.sync_value = str(
                        current_point_processes[0].delay)
                    self.duration.sync_value = str(
                        current_point_processes[0].dur)
                    self.amplitude.sync_value = str(
                        current_point_processes[0].amp)
                else:
                    logging.debug("No point process found")
                    self.delay.sync_value = str(0.0)
                    self.duration.sync_value = str(0.0)
                    self.amplitude.sync_value = str(0.0)

    def create_current_clamp(self, triggeredComponent, args):
        logging.debug("Creating Current Clamp")
        logging.debug(self.delay.sync_value)
        logging.debug(self.duration.sync_value)
        logging.debug(self.amplitude.sync_value)
        i_clamp = h.IClamp(self.segment)
        i_clamp.delay = float(self.delay.sync_value)
        i_clamp.dur = float(self.duration.sync_value)
        i_clamp.amp = float(self.amplitude.sync_value)
        self.pointProcesses.append(i_clamp)
