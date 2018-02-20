"""
cell_builder.py
Neuron Cell Builder
"""
import logging
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from neuron import h
from neuron_ui import neuron_utils
from neuron_ui.singleton import Singleton


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
        self.plot_widget.on_close(self.close)
        self.plot_widget_2.on_close(self.close)

        GeppettoJupyterModelSync.events_controller.register_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.refresh_data)

    def shake_panel(self):
        self.plot_widget.shake()
        self.plot_widget_2.shake()

    def close(self, component, args):
        # Close Jupyter object
        self.plot_widget.close()
        del self.plot_widget

        self.plot_widget_2.close()
        del self.plot_widget_2

        GeppettoJupyterModelSync.events_controller.unregister_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Select']], self.refresh_data)

        # Destroy this class
        SpacePlot.delete()
        # del RunControl._instance

    def updatePlots(self, data):
        logging.debug('Updating plots')
        # Add regular plot with all state variables on section
        plot_widget_data = []
        for state_variable in self.state_variables:
            plot_widget_data.append(GeppettoJupyterModelSync.current_model.id + "." +
                                    state_variable.id)
        self.plot_widget.plot_data(plot_widget_data)

        # Add proper space plot
        plot_widget_data_2 = []
        plot_widget_data_2.append(
            GeppettoJupyterModelSync.current_model.id + "." + self.derived_state_variables[0].id)
        plot_widget_data_2.append(
            GeppettoJupyterModelSync.current_model.id + "." + self.derived_state_variables[1].id)
        self.plot_widget_2.plot_XY_data(plot_widget_data_2)

        GeppettoJupyterModelSync.events_controller.unregister_to_event(
            [GeppettoJupyterModelSync.events_controller._events['Instances_created']], self.updatePlots)

    def refresh_data(self, data, geometry_identifier, point):
        logging.debug('Refreshing space plot with selected geometry: ' +
                      data + "." + geometry_identifier)

        self.vectors = []

        for geometry in GeppettoJupyterModelSync.current_model.geometries_raw:
            if geometry.id == geometry_identifier:

                logging.debug('Loading values for geometry ' +
                              str(geometry_identifier))

                GeppettoJupyterModelSync.current_model.highlight_visual_group_element(
                    geometry.python_variable["section"].name())

                self.geometry = geometry
                self.state_variables = []

                self.section = geometry.python_variable["section"]
                for index, segment in enumerate(self.section):
                    vector = h.Vector()
                    vector.record(segment._ref_v)
                    state_variable = neuron_utils.createStateVariable(id=self.section.name() + "_" + str(index), name=self.section.name() + "_" + str(index),
                                                                      units='mV', python_variable={"record_variable": vector,
                                                                                                   "segment": segment})
                    self.state_variables.append(state_variable)


                if hasattr(self, 'derived_state_variables'):
                    self.derived_state_variables[0].set_inputs(self.state_variables)
                    self.derived_state_variables[1].timeSeries = list(range(len(self.state_variables)))
                else:
                    self.derived_state_variables = []
                    self.derived_state_variables.append(G.createDerivedStateVariable(id="space_plot", name="Space Plot",
                                                                                    units='mV', inputs=self.state_variables, normalizationFunction='SPACEPLOT'))
                    self.derived_state_variables.append(G.createDerivedStateVariable(id="space_plot_2", name="Space Plot 2",
                                                                                    units='nm', timeSeries=list(range(len(self.state_variables))), normalizationFunction='CONSTANT'))
                GeppettoJupyterModelSync.current_model.addDerivedStateVariables(self.derived_state_variables)

                # FIXME: We can not be sured the new variables are created by
                # this time probably is better if we register an event for
                # model loaded and we listen to it
                GeppettoJupyterModelSync.events_controller.register_to_event(
                    [GeppettoJupyterModelSync.events_controller._events['Instances_created']], self.updatePlots)

                # GeppettoJupyterModelSync.current_model.sync()
                

                break

    
        
