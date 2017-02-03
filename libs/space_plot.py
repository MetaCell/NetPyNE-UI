"""
cell_builder.py
Neuron Cell Builder
"""
import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from neuron import h
import time
from singleton import Singleton

@Singleton
class SpacePlot:

    def __init__(self):
        logging.debug('Initializing Space Plot')

        self.geometry = None
        self.section = None
        self.state_variables = []

        self.plot_widget = G.plotVariable(
            'Plot', position_x=90, position_y=405)
        self.plot_widget_2 = G.plotVariable(
            'Plot', position_x=490, position_y=405)

        GeppettoJupyterModelSync.events_controller.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.refresh_data)

    def shake_panel(self):
        self.plot_widget.shake()
        self.plot_widget_2.shake()

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
                    self.state_variables.append(state_variable)

                derived_state_variable = G.createDerivedStateVariable(id="space_plot", name="Space Plot",
                                                                      units='mV', inputs=self.state_variables, normalizationFunction='SPACEPLOT')

                derived_state_variable_2 = G.createDerivedStateVariable(id="space_plot_2", name="Space Plot 2",
                                                                        units='nm', timeSeries=list(range(len(self.state_variables))), normalizationFunction='CONSTANT')

                # FIXME: We can not be sured the new variables are created by
                # this time probably is better if we register an event for
                # model loaded and we listen to it

                # Add regular plot with all state variables on section
                plot_widget_data = []
                for state_variable in self.state_variables:
                    plot_widget_data.append(GeppettoJupyterModelSync.current_model.id + "." +
                                            state_variable.id)
                self.plot_widget.plot_data(plot_widget_data)

                # Add proper space plot
                plot_widget_data_2 = []
                plot_widget_data_2.append(
                    GeppettoJupyterModelSync.current_model.id + "." + derived_state_variable.id)
                plot_widget_data_2.append(
                    GeppettoJupyterModelSync.current_model.id + "." + derived_state_variable_2.id)
                self.plot_widget_2.plot_XY_data(plot_widget_data_2)

                break
