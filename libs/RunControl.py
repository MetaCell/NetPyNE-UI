from IPython.display import display
import GeppettoNeuron
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm.GeppettoCore import sync_values

from neuron import h
h.load_file("stdrun.hoc")

def showRunControlPanel():
    # Init Panel
    initPanel = G.addTextFieldAndButton("Init", 'v_init', True, ['h.stdinit()'])
    
    # Init Run Button
    initRunButton = G.addButton('Init & Run', ['current_experiment.state = "IN PROGRESS"', 'h.run()', 'current_experiment.state = "COMPLETED"'])    
    
    # Stop Button
    stopButton = G.addButton('Stop')
    stopButton.on_click(['h.stoprun = 1'])   
    
    # Continue til
    continueTilPanel = G.addTextFieldAndButton("Continue til", 'runStopAt', True, ['h.continuerun(runStopAt)', 'h.stoprun=1'])

    # Continue for
    continueForPanel = G.addTextFieldAndButton("Continue for", 'runStopIn', True, ['h.continuerun(t + runStopIn)', 'h.stoprun=1'])
    
    # Single Step
    singleStepButton = G.addButton('Single Step', ['h.steprun()'])
    
    # t Panel
    timePanel = G.addTextFieldAndButton("t", 't', False, [])
    
    # TStop Panel
    stopPanel = G.addTextFieldAndButton("Tstop", 'tstop', True, ['h.tstop_changed()'])
   
    # dt Panel
    dtPanel = G.addTextFieldAndButton("dt", 'dt', True, ['h.setdt()'])
    
    # Points plotted Panel
    pointsPlottedPanel = G.addTextFieldAndButton("Points plotted/ms", 'steps_per_ms', True, ['h.setdt()'])

    # Scrn update invl Panel
    scrnUpdateInvlPanel = G.addTextFieldAndButton("Scrn update invl", 'screen_update_invl', True, [])
    
    # Real Time Texfield
    realTimePanel = G.addTextFieldAndButton("Real Time", 'realtime', False, [])

    # Init main panel
    runControlPanel = G.addPanel('Run Control', items = [initPanel, initRunButton, stopButton, continueTilPanel, continueForPanel, singleStepButton, timePanel, stopPanel, dtPanel, pointsPlottedPanel, scrnUpdateInvlPanel, realTimePanel], widget_id = 'runControlPanel', positionX =600, positionY=10)
    
    display(runControlPanel)    
    
    
# Refresh value every 1 
class Event(object):
    def __init__(self):
        self.fih = h.FInitializeHandler(1, self.callback)

    def callback(self) :
        for key,value in sync_values.items():
            value.sync_value = str(eval("h._ref_t."+key))

        h.cvode.event(h.t + 1, self.callback)

e = Event()

    
    