"""
point_process.py
Neuron Point Process
"""
import logging
import neuron_utils
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from math import sqrt, pow

from neuron import h


class PointProcess:

    def __init__(self):
        logging.debug('Initializing Point Process')

        # self.point_processes = None
        self.current_point_process = None

        drop_down_panel = neuron_utils.add_drop_down_with_label('Current Clamps', [{'id':'noSelection', 'value':'No segment selected'}])
        delay_panel = neuron_utils.add_text_field_with_label('Delay', None)
        duration_panel = neuron_utils.add_text_field_with_label(
            'Duration', None)
        amplitude_panel = neuron_utils.add_text_field_with_label(
            'Amplitude', None)
        self.drop_down = drop_down_panel.items[1]
        self.drop_down.on_change(self.update_drop_down_selection)
        self.delay = delay_panel.items[1]
        self.duration = duration_panel.items[1]
        self.amplitude = amplitude_panel.items[1]
        self.save_button = neuron_utils.add_button(
            'Save', self.create_current_clamp)

        self.pointProcessPanel = neuron_utils.add_panel('Point Process', items=[
            drop_down_panel, delay_panel, duration_panel, amplitude_panel, self.save_button], widget_id='pointProcessPanel', positionX=600, positionY=10)
        self.pointProcessPanel.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.pointProcessPanel.display()

    def update_drop_down_selection(self, triggeredComponent, args):
        logging.debug("Update drop drown")
        logging.debug(args)
        if args['data'] == 'new':
            self.current_point_process = None
            self.delay.sync_value = str(0.0)
            self.duration.sync_value = str(0.0)
            self.amplitude.sync_value = str(0.0)
        else:
            for point_process in self.segment.point_processes():
                logging.debug(point_process.hname())
                if args['data'] == point_process.hname():
                    self.current_point_process = point_process
                    self.delay.sync_value = str(
                        point_process.delay)
                    self.duration.sync_value = str(
                        point_process.dur)
                    self.amplitude.sync_value = str(
                        point_process.amp)


    def updateValues(self, dataId, geometry_identifier, point):

        logging.debug('Updating values for Point Process')

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == geometry_identifier:
                logging.debug('Loading values for geometry ' +
                              str(geometry_identifier))

                distance_to_selection, section_length = neuron_utils.calculate_normalised_distance_to_selection(
                    geometry, point)
                distance_to_selection_normalised = distance_to_selection/section_length
                self.segment = geometry.python_variable[
                    "section"](distance_to_selection_normalised)

                point_processes = self.segment.point_processes()

                self.drop_down.items = []
                if len(point_processes) > 0:

                    for point_process in point_processes:
                        if point_process.hname().startswith('IClamp'):
                            logging.debug("Point process found")
                            self.current_point_process = point_process
                            self.drop_down.add_child({'id':point_process.hname(), 'value':point_process.hname()})
                            self.delay.sync_value = str(
                                point_process.delay)
                            self.duration.sync_value = str(
                                point_process.dur)
                            self.amplitude.sync_value = str(
                                point_process.amp)
                            self.drop_down.sync_value = point_process.hname()

                else:
                    logging.debug("No point process found")
                    self.delay.sync_value = str(0.0)
                    self.duration.sync_value = str(0.0)
                    self.amplitude.sync_value = str(0.0)
                    self.drop_down.sync_value = 'new'
                    self.current_point_process = None

                self.drop_down.add_child({'id':'new', 'value':'New Point Process'})

                # Calculate actual segment position
                nseg = len(geometry.python_variable["section_points"]) - 1
                interval = 1.0/nseg
                segIndex = int(distance_to_selection_normalised*nseg)
                seg_loc_normalised = segIndex * interval + interval/2
                seg_loc = seg_loc_normalised * section_length

                distance_to_seg_loc = 0
                proximal = []
                distal = []
                for point_index in range(len(geometry.python_variable["section_points"]) - 1):
                    proximal = geometry.python_variable["section_points"][point_index]
                    distal = geometry.python_variable["section_points"][point_index + 1]
                    geometry_length = sqrt(pow(distal[0]-proximal[0],2) + pow(distal[1]-proximal[1],2) + pow(distal[2]-proximal[2],2))
                    if seg_loc < geometry_length + distance_to_seg_loc:
                        break
                    distance_to_seg_loc += geometry_length


                geometry_vector = [distal[0]-proximal[0], distal[1]-proximal[1], distal[2]-proximal[2]]
                average_radius = (proximal[3] + distal[3])/2
                geometry_vector_length = sqrt(pow(geometry_vector[0],2) + pow(geometry_vector[1],2) + pow(geometry_vector[2],2))
                distance_in_seg = (seg_loc-distance_to_seg_loc)/geometry_vector_length
                seg_loc_point = [proximal[0] + distance_in_seg * geometry_vector[0], proximal[1] + distance_in_seg * geometry_vector[1], proximal[2] + distance_in_seg * geometry_vector[2]]
                
                GeppettoJupyterModelSync.current_model.draw(seg_loc_point[0],seg_loc_point[1],seg_loc_point[2],average_radius*2)                

    def create_current_clamp(self, triggeredComponent, args):
        logging.debug("Creating Current Clamp")
        if self.current_point_process is None:
            if not hasattr(GeppettoJupyterModelSync.current_python_model, 'point_processes'):
                GeppettoJupyterModelSync.current_python_model.point_processes = []
            pp = h.IClamp(self.segment)
            self.current_point_process = pp
            pp.delay = float(self.delay.sync_value)
            pp.dur = float(self.duration.sync_value)
            pp.amp = float(self.amplitude.sync_value)
            GeppettoJupyterModelSync.current_python_model.point_processes.append(pp)
            self.drop_down.add_child({'id':pp.hname(), 'value':pp.hname()})
            self.drop_down.sync_value = pp.hname()
        else:
            self.current_point_process.delay = float(self.delay.sync_value)
            self.current_point_process.dur = float(self.duration.sync_value)
            self.current_point_process.amp = float(self.amplitude.sync_value)
