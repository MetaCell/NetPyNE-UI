"""
run_control.py
Neuron Run Control Panel
"""
import logging
from neuron_ui import neuron_utils
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from neuron_ui.singleton import Singleton

from neuron import h
h.load_file("stdrun.hoc")

@Singleton
class RunControl:

    def __init__(self):
        logging.debug('Initializing Run Control')
        self.initPanel = neuron_utils.add_text_field_and_button(
            "Init", 'v_init', True, self.execute_neuron_command, extraData={'commands': ['h.stdinit()']})

        self.initRunButton = neuron_utils.add_button('Init & Run', self.execute_neuron_command, extraData={'commands': ['GeppettoJupyterModelSync.events_controller.triggerEvent("spin_logo")',
                                                                                                                        'GeppettoJupyterModelSync.current_experiment.status = "RUNNING"',
                                                                                                                        'h.run()',
                                                                                                                        'GeppettoJupyterModelSync.current_experiment.status = "COMPLETED"',
                                                                                                                        'import time;time.sleep(1.5);',
                                                                                                                        'GeppettoJupyterModelSync.events_controller.triggerEvent("experiment:doPlay")',
                                                                                                                        'GeppettoJupyterModelSync.events_controller.triggerEvent("stop_spin_logo")']})

        self.stopButton = neuron_utils.add_button('Stop')
        self.stopButton.on_click(['h.stoprun = 1'])

        self.continueTilPanel = neuron_utils.add_text_field_and_button(
            "Continue til", 'runStopAt', True, self.execute_neuron_command, extraData={'commands': ['h.continuerun(runStopAt)', 'h.stoprun=1']})

        self.continueForPanel = neuron_utils.add_text_field_and_button("Continue for", 'runStopIn', True, self.execute_neuron_command, extraData={'commands': [
            'h.continuerun(t + runStopIn)', 'h.stoprun=1']})

        self.singleStepButton = neuron_utils.add_button(
            'Single Step', self.execute_neuron_command, extraData={'commands': ['h.steprun()',
                                                                                'GeppettoJupyterModelSync.events_controller.triggerEvent("experiment:doPlay")',
                                                                                'GeppettoJupyterModelSync.events_controller.triggerEvent("experiment:update")']})

        self.timePanel = neuron_utils.add_text_field_and_button(
            "t", 't', False, self.execute_neuron_command, extraData={'commands': []})

        self.stopPanel = neuron_utils.add_text_field_and_button(
            "Tstop", 'tstop', True, self.execute_neuron_command, extraData={'commands': ['h.tstop_changed()']})

        self.dtPanel = neuron_utils.add_text_field_and_button(
            "dt", 'dt', True, self.execute_neuron_command, extraData={'commands': ['h.setdt()']})

        self.pointsPlottedPanel = neuron_utils.add_text_field_and_button(
            "Points plotted/ms", 'steps_per_ms', True, self.execute_neuron_command, extraData={'commands': ['h.setdt()']})

        self.scrnUpdateInvlPanel = neuron_utils.add_text_field_and_button(
            "Scrn update invl", 'screen_update_invl', True, self.execute_neuron_command, extraData={'commands': []})

        self.realTimePanel = neuron_utils.add_text_field_and_button(
            "Real Time", 'realtime', False, self.execute_neuron_command, extraData={'commands': []})

        self.runControlPanel = neuron_utils.add_panel('Run Control', items=[self.initPanel, self.initRunButton, self.stopButton, self.continueTilPanel, self.continueForPanel, self.singleStepButton,
                                                                            self.timePanel, self.stopPanel, self.dtPanel, self.pointsPlottedPanel, self.scrnUpdateInvlPanel, self.realTimePanel], widget_id='runControlPanel', position_x=700, position_y=150)
        self.runControlPanel.on_close(self.close)
        self.runControlPanel.display()

    def close(self, component, args):
        # Close Jupyter object
        self.runControlPanel.close()
        del self.runControlPanel

        # Destroy this class
        RunControl.delete()
        # del RunControl._instance

    def shake_panel(self):
        self.runControlPanel.shake()

    def execute_neuron_command(self, component, args):
        for callback in component.extraData['commands']:
            try:
                exec(callback)
            except Exception as e:
                logging.exception( "Unexpected error executing callback on event triggered:")
                raise
