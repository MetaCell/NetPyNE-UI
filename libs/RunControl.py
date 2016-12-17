from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G

def showRunControlPanel():
    # Init Panel
    initPanel = G.addTextFieldAndButton("Init", 'v_init', True, ['h.stdinit()'])
    
    # Init Run Button
    initRunButton = G.addButton('Init & Run', ['GeppettoJupyterModelSync.current_experiment.state = "RUNNING"', 'h.run()', 'GeppettoJupyterModelSync.current_experiment.state = "COMPLETED"'])    
    
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
    
    runControlPanel.display()        
    
