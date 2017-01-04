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
        logging.debug('Initializing Point Process')

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
        logging.debug("Create Current Clamp")
        logging.debug(self.segment)
        ic = h.IClamp(self.segment)
        ic.delay = float(self.delay.sync_value)
        ic.dur = float(self.duration.sync_value)
        ic.amp = float(self.amplitude.sync_value)
        self.pointProcesses.append(ic)
        logging.debug(ic)
        current_point_processes2 = self.segment.point_processes()
        logging.debug(current_point_processes2)

    def updateValues(self, dataId, groupNameIdentifier):
        logging.debug('Updating values for Point Process')
        logging.debug(dataId)
        logging.debug(groupNameIdentifier)

        for geometry in GeppettoJupyterModelSync.current_model.geometries:
            logging.debug("reading geometry")
            logging.debug(geometry.id)
            if geometry.id == groupNameIdentifier:
                logging.debug("math")
                logging.debug(geometry.python_variable["section"])
                logging.debug(geometry.python_variable["segment"])
                #self.segment = geometry.python_variable["section"](float(geometry.python_variable["segment"]))
                self.segment = list(geometry.python_variable["section"].allseg())[geometry.python_variable["segment"]]
                logging.debug(self.segment)
                current_point_processes = self.segment.point_processes()
                logging.debug(current_point_processes)
                # Tracer()()
                if len(current_point_processes) == 1:
                # for pointProcess in self.pointProcesses:
                #     segment_loc = pointProcess.get_loc()
                #     section_loc =pointProcess.cas()
                    # logging.debug("pakkkkk")
                #     logging.debug(segment_loc)
                #     logging.debug(section_loc)

                    logging.debug("Point process found")
                    logging.debug(str(current_point_processes[0].delay))
                    logging.debug(str(current_point_processes[0].dur))
                    logging.debug(str(current_point_processes[0].amp))
                    self.delay.sync_value = str(current_point_processes[0].delay)
                    self.duration.sync_value = str(current_point_processes[0].dur)
                    self.amplitude.sync_value = str(current_point_processes[0].amp)
                else:
                    logging.debug("No point process found")
                    self.delay.sync_value = str(0.0)
                    self.duration.sync_value = str(0.0)
                    self.amplitude.sync_value = str(0.0)

            
            #logging.debug(stateVariable.python_variable)
            #logging.debug(dir(stateVariable.python_variable))
        logging.debug("Stated varible checked")

