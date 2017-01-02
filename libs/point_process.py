"""
point_process.py
Neuron Point Process
"""
import logging
# from IPython.core.debugger import Tracer

from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync

from neuron import h

class PointProcess:
    def __init__(self):
        logging.warning('Initializing Point Process')

        self.pointProcesses = []

        self.delay = G.addTextField('Delay', None)
        self.duration = G.addTextField('Duration', None)
        self.amplitude = G.addTextField('Amplitude', None)
        self.save_button = G.addButton('Save', self.create_current_clamp)

        self.pointProcessPanel = G.addPanel('Point Process', items=[
            self.delay, self.duration, self.amplitude, self.save_button], widget_id='pointProcessPanel', positionX=600, positionY=10)
        self.pointProcessPanel.registerToEvent(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.updateValues)
        self.pointProcessPanel.display()

    def create_current_clamp(self, triggeredComponent, args):
        logging.warning("Create Current Clamp")
        logging.warning(self.segment)
        ic = h.IClamp(self.segment)
        ic.delay = float(self.delay.sync_value)
        ic.dur = float(self.duration.sync_value)
        ic.amp = float(self.amplitude.sync_value)
        self.pointProcesses.append(ic)
        logging.warning(ic)
        current_point_processes2 = self.segment.point_processes()
        logging.warning(current_point_processes2)

    def updateValues(self, dataId, groupNameIdentifier):
        logging.warning('Updating values for Point Process')
        logging.warning(dataId)
        logging.warning(groupNameIdentifier)

        for geometry in GeppettoJupyterModelSync.current_model.geometries:
            logging.warning("reading geometry")
            logging.warning(geometry.id)
            if geometry.id == groupNameIdentifier:
                logging.warning("math")
                logging.warning(geometry.python_variable["section"])
                logging.warning(geometry.python_variable["segment"])
                #self.segment = geometry.python_variable["section"](float(geometry.python_variable["segment"]))
                self.segment = list(geometry.python_variable["section"].allseg())[geometry.python_variable["segment"]]
                logging.warning(self.segment)
                current_point_processes = self.segment.point_processes()
                logging.warning(current_point_processes)
                # Tracer()()
                if len(current_point_processes) == 1:
                # for pointProcess in self.pointProcesses:
                #     segment_loc = pointProcess.get_loc()
                #     section_loc =pointProcess.cas()
                    # logging.warning("pakkkkk")
                #     logging.warning(segment_loc)
                #     logging.warning(section_loc)

                    logging.warning("Point process found")
                    logging.warning(str(current_point_processes[0].delay))
                    logging.warning(str(current_point_processes[0].dur))
                    logging.warning(str(current_point_processes[0].amp))
                    self.delay.sync_value = str(current_point_processes[0].delay)
                    self.duration.sync_value = str(current_point_processes[0].dur)
                    self.amplitude.sync_value = str(current_point_processes[0].amp)
                else:
                    logging.warning("No point process found")
                    self.delay.sync_value = str(0.0)
                    self.duration.sync_value = str(0.0)
                    self.amplitude.sync_value = str(0.0)

            
            #logging.warning(stateVariable.python_variable)
            #logging.warning(dir(stateVariable.python_variable))
        logging.warning("Stated varible checked")

