"""
run_control.py
Neuron Run Control Panel
"""
import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G

class RunControl:

    def __init__(self):
        logging.warning('Initializing Run Control')
        self.initPanel = G.addTextFieldAndButton(
            "Init", 'v_init', True, ['h.stdinit()'])

        self.initRunButton = G.addButton('Init & Run', ['GeppettoJupyterModelSync.current_experiment.state = "RUNNING"',
                                                        'h.run()', 'GeppettoJupyterModelSync.current_experiment.state = "COMPLETED"'])

        self.stopButton = G.addButton('Stop')
        self.stopButton.on_click(['h.stoprun = 1'])

        self.continueTilPanel = G.addTextFieldAndButton(
            "Continue til", 'runStopAt', True, ['h.continuerun(runStopAt)', 'h.stoprun=1'])

        self.continueForPanel = G.addTextFieldAndButton("Continue for", 'runStopIn', True, [
                                                        'h.continuerun(t + runStopIn)', 'h.stoprun=1'])

        self.singleStepButton = G.addButton('Single Step', ['h.steprun()'])

        self.timePanel = G.addTextFieldAndButton("t", 't', False, [])

        self.stopPanel = G.addTextFieldAndButton(
            "Tstop", 'tstop', True, ['h.tstop_changed()'])

        self.dtPanel = G.addTextFieldAndButton("dt", 'dt', True, ['h.setdt()'])

        self.pointsPlottedPanel = G.addTextFieldAndButton(
            "Points plotted/ms", 'steps_per_ms', True, ['h.setdt()'])

        self.scrnUpdateInvlPanel = G.addTextFieldAndButton(
            "Scrn update invl", 'screen_update_invl', True, [])

        self.realTimePanel = G.addTextFieldAndButton(
            "Real Time", 'realtime', False, [])

        self.runControlPanel = G.addPanel('Run Control', items=[self.initPanel, self.initRunButton, self.stopButton, self.continueTilPanel, self.continueForPanel, self.singleStepButton,
                                                                self.timePanel, self.stopPanel, self.dtPanel, self.pointsPlottedPanel, self.scrnUpdateInvlPanel, self.realTimePanel], widget_id='runControlPanel', positionX=600, positionY=10)

        self.runControlPanel.display()
