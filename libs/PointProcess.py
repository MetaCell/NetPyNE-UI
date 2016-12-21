import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


def updateValues(dataId):
    logging.warning('Updating values for Point Process')
    logging.warning(dataId)


def showPointProcess():

    delay = G.addTextField('Delay', 'tstop')

    duration = G.addTextField('Duration', 'tstop')

    amplitude = G.addTextField('Amplitude', 'tstop')

    pointProcessPanel = G.addPanel('Point Process', items=[
                                  delay, duration, amplitude], widget_id='pointProcessPanel', positionX=600, positionY=10)
    pointProcessPanel.registerToEvent(
        [GeppettoJupyterModelSync.events_controller._events['Select']], updateValues)
    pointProcessPanel.display()
