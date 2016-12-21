from __future__ import print_function
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G
import GeppettoNeuron
import importlib

currentModel = None

def loadModule(targetComponent, args):
    global currentModel
    if targetComponent.extraData['action'] == 'loadModel':
        #FIXME: Check if it works in python 2
        module = importlib.import_module("models." + targetComponent.extraData['module'])
        currentModel = getattr(module, targetComponent.extraData['model'])()
        currentModel()
        #getattr(currentModel, targetComponent.extraData['action'])()
    else:
        currentModel.analysis()

def showSampleModelsPanel():
    items = []
    items.append(G.addButton('Very simple cell', loadModule,  extraData = {'module': 'verysimple_cell', 'model':'VerySimpleCell', 'action':'loadModel'}))    
    items.append(G.addButton('Simple cell', loadModule,  extraData = {'module': 'simple_cell', 'model':'SimpleCell', 'action':'loadModel'}))
    items.append(G.addButton('Simple network', loadModule,  extraData = {'module': 'simple_network', 'model':'SimpleNetwork', 'action':'loadModel'}))
    items.append(G.addButton('CA3 Pyramidal', loadModule,  extraData = {'module': 'CA3_pyramidal', 'model':'CA3_pyramidal', 'action':'loadModel'}))
    items.append(G.addButton('Ball and stick', loadModule,  extraData = {'module': 'ball_and_stick', 'model':'BallAndStick', 'action':'loadModel'}))

    loadModelPanel = G.addPanel('Load Models', items = items, widget_id = 'loadModelPanel', positionX =90, positionY=10)
    loadModelPanel.display()    
    
def showAnalysisPanel():
    analysisButton = G.addButton('Plot', loadModule, extraData = {'action':'analysis'})
    analysisPanel = G.addPanel('Analysis', items = [analysisButton], widget_id = 'analysisPanel', positionX =90, positionY=250)
    analysisPanel.display()

def showCellBuilderPanel():
    from CellBuilder import showCellBuilder
    showCellBuilder()

def showPointProcessPanel():
    from PointProcess import showPointProcess
    showPointProcess()

def showRunControlPanel():
    from RunControl import showRunControlPanel
    showRunControlPanel()
    