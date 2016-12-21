import logging
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


def updateValues(dataId):
    logging.warning('Updating values')
    logging.warning(dataId)


def showCellBuilder():
    # Radius
    #radiusTextField = G.addTextField('Radius', '[Selected].radius')
    radiusTextField = G.addTextField('Radius', 'tstop')

    # Length
    #lengthTextField = G.addTextField('Length', '[Selected].length')
    lengthTextField = G.addTextField('Length', 'tstop')

    cellBuilderPanel = G.addPanel('Cell Builder', items=[
                                  radiusTextField, lengthTextField], widget_id='cellBuilderPanel', positionX=600, positionY=10)
    cellBuilderPanel.registerToEvent(
        [GeppettoJupyterModelSync.events_controller._events['Select']], updateValues)
    cellBuilderPanel.display()
