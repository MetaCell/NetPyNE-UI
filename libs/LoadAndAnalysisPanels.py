from IPython.display import display
import GeppettoLibrary as G
import GeppettoNeuron

currentModel = None

def loadModule(targetComponent, args):
    global currentModel
    if targetComponent.extraData['action'] == 'loadModel':
        module = __import__(targetComponent.extraData['module'], globals=globals())
        currentModel = getattr(module, targetComponent.extraData['model'])()
        getattr(currentModel, targetComponent.extraData['action'])()
    else:
        currentModel.analysis()

def showSampleModelsPanel():
    loadVerySimpleCellButton = G.addButton('Very simple cell', loadModule,  extraData = {'module': 'verysimple_cell', 'model':'VerySimpleCell', 'action':'loadModel'})    
    loadSimpleCellButton = G.addButton('Simple cell', loadModule,  extraData = {'module': 'simple_cell', 'model':'SimpleCell', 'action':'loadModel'})    
    loadSimpleNetworkButton = G.addButton('Simple network', loadModule,  extraData = {'module': 'simple_network', 'model':'SimpleNetwork', 'action':'loadModel'})    

    loadModelPanel = G.addPanel('Load Models', items = [loadVerySimpleCellButton, loadSimpleCellButton, loadSimpleNetworkButton], widget_id = 'loadModelPanel', positionX =90, positionY=10)
    
    display(loadModelPanel)    
    
def showAnalysisPanel():
    analysisButton = G.addButton('Analysis!', loadModule, extraData = {'action':'analysis'})    
    analysisPanel = G.addPanel('Analysis', items = [analysisButton], widget_id = 'analysisPanel', positionX =90, positionY=250)
    display(analysisPanel)    
    

    