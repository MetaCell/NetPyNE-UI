"""
netpyne_model_interpreter.py
Model interpreter for NetPyNE. This class creates a geppetto type
"""
import logging
import model as pygeppetto
from model.model_factory import GeppettoModelFactory
from model.values import Point
from netpyne import sim


class NetPyNEModelInterpreter():

    def __init__(self):
        self.factory = GeppettoModelFactory()

    def getGeppettoModel(self, netpyne_model):
        logging.debug('Creating a Geppetto Model')
        
        # We create a GeppettoModel instance and we set a name a assign a lib
        geppetto_model = self.factory.createGeppettoModel('NetPyNEModel');
        netpyne_geppetto_library = pygeppetto.GeppettoLibrary(name='netpynelib')
        geppetto_model.libraries.append(netpyne_geppetto_library)

        self.extractCellTypes(netpyne_model,netpyne_geppetto_library, geppetto_model)
        self.extractInstances(netpyne_model,netpyne_geppetto_library, geppetto_model)

        return geppetto_model

    def updateGeppettoModel(self, netpyne_model, geppetto_model):
        logging.debug('Updating the Geppetto Model')
        
        netpyne_geppetto_library = geppetto_model.libraries[1]
        cellType = netpyne_geppetto_library.types[0]
        cellType.variables.append(self.factory.createStateVariable('time'))
        cellType.variables.append(self.factory.createStateVariable('v1'))
        cellType.synched = False

        return geppetto_model

    def extractCellTypes(self,netpyne_model,netpyne_geppetto_library, geppetto_model):
        
        type = pygeppetto.CompositeType(id='cell',name='cell')
        visualType = pygeppetto.CompositeVisualType(id='cellMorphology',name='cellMorphology')
        type.visualType=visualType
        visualType.variables.append(self.factory.createCylinder('apical0_1', bottomRadius=3.0, topRadius=3.0, position=Point(y=17.0), distal=Point(y=77.0)))
        visualType.variables.append(self.factory.createCylinder('apical1_5', bottomRadius=1.5, topRadius=1.5, position=Point(y=77.0), distal=Point(x=-150.0,y=77.0)))
        visualType.variables.append(self.factory.createCylinder('apical2_2', bottomRadius=2.2, topRadius=2.2, position=Point(y=77.0), distal=Point(y=477.0)))
        visualType.variables.append(self.factory.createCylinder('apical2_2', bottomRadius=1.45, topRadius=1.45, position=Point(y=477.0), distal=Point(y=877.0)))
        visualType.variables.append(self.factory.createCylinder('basal2_8', bottomRadius=2.5, topRadius=2.5, position=Point(y=-50.0), distal=Point(x=-106.07,y=-156.07)))
        visualType.variables.append(self.factory.createCylinder('basal1_7', bottomRadius=2.5, topRadius=2.5, position=Point(y=-50.0), distal=Point(x=-106.07,y=-156.07)))
        visualType.variables.append(self.factory.createCylinder('basal0_6', bottomRadius=2.0, topRadius=2.0, distal=Point(y=-50.0)))
        visualType.variables.append(self.factory.createCylinder('soma_0', bottomRadius=11.5, topRadius=11.5, distal=Point(y=17.0)))
        visualType.variables.append(self.factory.createCylinder('apical4_4', bottomRadius=11.5, topRadius=11.5, position=Point(y=877.0),distal=Point(y=1127.0)))
        
        netpyne_geppetto_library.types.append(type)
        netpyne_geppetto_library.types.append(visualType)

        # print netpyne_model.net.allCells[0]
        # sim.net.allCells[0]['secs']
        # sim.net.allCells[0]['conns']
        # sim.net.allCells[0]['conns']
        pass

    def extractInstances(self,netpyne_model,netpyne_geppetto_library,geppetto_model):
        instance=pygeppetto.Variable(id='cell')
        instance.types.append(netpyne_geppetto_library.types[0])
        geppetto_model.variables.append(instance)
        pass





