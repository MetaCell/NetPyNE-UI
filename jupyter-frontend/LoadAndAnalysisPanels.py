from IPython.display import display
import GeppettoLibrary as G
import GeppettoNeuron

model = None

def loadModule(targetComponent, args):
    global model
    model = __import__(targetComponent.extraData['module'], globals=globals())

def execute_analysis(targetComponent, args):
    model.analysis()

def showSampleModelsPanel():
    loadVerySimpleCellButton = G.addButton('Very simple cell', loadModule,  extraData = {'module': 'verysimple_cell'})    
    loadSimpleCellButton = G.addButton('Simple cell', loadModule,  extraData = {'module': 'simple_cell'})    
    loadSimpleNetworkButton = G.addButton('Simple network', loadModule,  extraData = {'module': 'simple_network'})    

    loadModelPanel = G.addPanel('Load Models', items = [loadVerySimpleCellButton, loadSimpleCellButton, loadSimpleNetworkButton])
    
    display(loadModelPanel)    
    
def showAnalysisPanel():
    analysisButton = G.addButton('Analysis!', execute_analysis)    
    analysisPanel = G.addPanel('Analysis', items = [analysisButton])
    display(analysisPanel)    
    

    