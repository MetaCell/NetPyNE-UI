"""
cell_builder.py
Neuron Cell Builder
"""
import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from neuron import h


class SpacePlot:

    def __init__(self):
        logging.debug('Initializing Space Plot')

        self.geometry = None
        self.section = None
        # self.vectors = []
        self.state_variables = []

        self.plot_widget = G.plotVariable('Plot')
        self.plot_widget.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.refresh_data)

    def refresh_data(self, data, geometry_identifier, point):
        logging.debug('Refreshing space plot with selected geometry: ' +
                      data + "." + geometry_identifier)

        self.vectors = []

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == geometry_identifier:

                logging.debug('Loading values for geometry ' +
                              str(geometry_identifier))

                self.geometry = geometry
                self.state_variables = []

                self.section = geometry.python_variable["section"]
                for index, segment in enumerate(self.section):
                    vector = h.Vector()
                    vector.record(segment._ref_v)

                    state_variable = G.createStateVariable(id=self.section.name() + "_" + str(index), name=self.section.name() + "_" + str(index),
                                                           units='mV', python_variable=vector)
                    # self.vectors.append(vector)
                    self.state_variables.append(state_variable)

                    
                GeppettoJupyterModelSync.current_model.sync()
                for state_variable in self.state_variables:
                    self.plot_widget.add_data(GeppettoJupyterModelSync.current_model.id + "." + state_variable.id)
                break

