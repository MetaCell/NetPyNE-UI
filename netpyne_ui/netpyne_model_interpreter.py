"""
netpyne_model_interpreter.py
Model interpreter for NetPyNE. This class creates a geppetto type
"""
import logging
import pygeppetto.model as pygeppetto
from pygeppetto.model.model_factory import GeppettoModelFactory
from pygeppetto.model.values import Point, ArrayElement, ArrayValue


class NetPyNEModelInterpreter():

    def __init__(self):
        self.factory = GeppettoModelFactory()

    def getGeppettoModel(self, netpyne_model):
        logging.debug('Creating a Geppetto Model')

        # We create a GeppettoModel instance and we set a name a assign a lib
        geppetto_model = self.factory.createGeppettoModel('NetPyNEModel')
        netpyne_geppetto_library = pygeppetto.GeppettoLibrary(
            name='netpynelib')
        geppetto_model.libraries.append(netpyne_geppetto_library)

        self.extractPopulations(netpyne_model, netpyne_geppetto_library, geppetto_model)
        self.extractInstances(netpyne_model, netpyne_geppetto_library, geppetto_model)

        return geppetto_model

    def extractPopulations(self, netpyne_model, netpyne_geppetto_library, geppetto_model):
        # Initialise network
        network = pygeppetto.CompositeType(id='network_netpyne', name='network_netpyne')
        netpyne_geppetto_library.types.append(network)

        # Create intermediate population structure for easy access (by key)
        populations = {}
        for index, cell in enumerate(netpyne_model.net.allCells):
            # This will be only executed the first time for each population
            if cell['tags']['pop'] not in populations:
                # Create CellType, VisualType, ArrayType, ArrayVariable and append to netpyne library
                if 'cellType' in cell['tags']:
                    composite_id = cell['tags']['cellType']
                else: 
                    composite_id = cell['tags']['pop'] + "_cell"

                cellType = pygeppetto.CompositeType(id=str(composite_id), name=str(composite_id), abstract= False)
                visualType = pygeppetto.CompositeVisualType(id='cellMorphology', name='cellMorphology')
                cellType.visualType = visualType
                defaultValue = ArrayValue(elements=[])
                arrayType = pygeppetto.ArrayType(size=0,
                                                    arrayType=cellType,
                                                    id=str(cell['tags']['pop']),
                                                    name=str(cell['tags']['pop']),
                                                    defaultValue= defaultValue)
                arrayVariable = pygeppetto.Variable(id=str(cell['tags']['pop']))
                arrayVariable.types.append(arrayType)
                network.variables.append(arrayVariable)

                netpyne_geppetto_library.types.append(cellType)
                netpyne_geppetto_library.types.append(visualType)
                netpyne_geppetto_library.types.append(arrayType)

                # Save in intermediate structure
                populations[cell['tags']['pop']] = arrayType

                # Note: no need to check if pt3d since already done via netpyne sim.net.defineCellShapes() in instantiateNetPyNEModel
                secs = cell['secs']
                
                # Iterate sections creating spheres and cylinders
                if hasattr(secs, 'items'):
                    for sec_name, sec in list(secs.items()):
                        if 'pt3d' in sec['geom']:
                            points = sec['geom']['pt3d']
                            for i in range(len(points) - 1):
                                # draw soma as a cylinder, not as a sphere (more accurate representation of 3d pts)  
                                visualType.variables.append(self.factory.createCylinder(str(sec_name),
                                                                                            bottomRadius=float(points[i][3] / 2),
                                                                                            topRadius=float(points[i + 1][3] / 2),
                                                                                            position=Point(x=float(points[i][0]),y=float(points[i][1]), z=float(points[i][2])),
                                                                                            distal=Point(x=float(points[i + 1][0]), y=float(points[i + 1][1]), z=float(points[i + 1][2]))))
                    

            # Save the cell position and update elements in defaultValue and size
            populations[cell['tags']['pop']].size = populations[cell['tags']['pop']].size + 1
            populations[cell['tags']['pop']].defaultValue.elements.append(ArrayElement(index=len(populations[cell['tags']['pop']].defaultValue.elements) , position=Point(x=float(cell['tags']['x']), y=-float(cell['tags']['y']), z=float(cell['tags']['z']))))
            
    def extractInstances(self, netpyne_model, netpyne_geppetto_library, geppetto_model):
        instance = pygeppetto.Variable(id='network')
        instance.types.append(netpyne_geppetto_library.types[0])
        geppetto_model.variables.append(instance)
        pass
