"""
netpyne_model_interpreter.py
Model interpreter for NetPyNE. This class creates a geppetto type
"""
import logging
import model as pygeppetto
from model.model_factory import GeppettoModelFactory
from model.values import Point, ArrayElement, ArrayValue


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

    def updateGeppettoModel(self, netpyne_model, geppetto_model):
        logging.debug('Updating the Geppetto Model')

        netpyne_geppetto_library = geppetto_model.libraries[1]
        cellType = netpyne_geppetto_library.types[0]
        cellType.variables.append(self.factory.createStateVariable('time'))
        cellType.variables.append(self.factory.createStateVariable('v1'))
        cellType.synched = False

        return geppetto_model

    def convertTo3DGeoms(self, secs):
        # set 3d geoms for reduced cell models
        offset = 0
        prevL = 0
        for secName, sec in secs.items():
            sec['geom']['pt3d'] = []
            if secName in ['Adend1', 'Adend2', 'Adend3', 'soma']:  # set 3d geom of soma and Adends
                sec['geom']['pt3d'].append(
                    [offset + 0, prevL, 0, sec['geom']['diam']])
                prevL = float(prevL + sec['geom']['L'])
                sec['geom']['pt3d'].append(
                    [offset + 0, prevL, 0, sec['geom']['diam']])
            elif secName in ['axon', 'dend']:  # set 3d geom of axon
                sec['geom']['pt3d'].append(
                    [offset + 0, 0, 0, sec['geom']['diam']])
                sec['geom']['pt3d'].append(
                    [offset + 0, -sec['geom']['L'], 0, sec['geom']['diam']])
            else:  # set 3d geom of dend
                sec['geom']['pt3d'].append(
                    [offset + 0, 0, 0, sec['geom']['diam']])
                nseg = sec['geom']['nseg']
                logging.debug('takasec')
                logging.debug(sec)
                if nseg != {}:
                    for i in range(nseg):
                        sec['geom']['pt3d'].append(
                            [offset + (sec['geom']['L'] / nseg) * (i + 1), 0, 0, sec['geom']['diam']])
        return secs


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

                # Convert to pt3d if not there
                secs = cell['secs']
                if hasattr(secs, 'values') and len(secs.values()) > 0:
                    if 'pt3d' not in list(secs.values())[0]['geom']:
                        secs = self.convertTo3DGeoms(secs)
                
                # Iterate sections creating spheres and cylinders
                if hasattr(secs, 'items'):
                    for sec_name, sec in secs.items():
                        if 'pt3d' in sec['geom']:
                            points = sec['geom']['pt3d']
                            for i in range(len(points) - 1):
                                if sec_name == 'soma':
                                    visualType.variables.append(self.factory.createSphere(str(sec_name),
                                                                                            radius=float(points[i][3] / 2),
                                                                                            position=Point(x=float(points[i][0]),y=-float(points[i][1]), z=float(points[i][2]))))
                                else:
                                    visualType.variables.append(self.factory.createCylinder(str(sec_name),
                                                                                            bottomRadius=float(points[i][3] / 2),
                                                                                            topRadius=float(points[i + 1][3] / 2),
                                                                                            position=Point(x=float(points[i][0]),y=-float(points[i][1]), z=float(points[i][2])),
                                                                                            distal=Point(x=float(points[i + 1][0]), y=-float(points[i + 1][1]), z=float(points[i + 1][2]))))
                    

            # Save the cell position and update elements in defaultValue and size
            populations[cell['tags']['pop']].size = populations[cell['tags']['pop']].size + 1
            populations[cell['tags']['pop']].defaultValue.elements.append(ArrayElement(index=len(populations[cell['tags']['pop']].defaultValue.elements) , position=Point(x=float(cell['tags']['x']), y=float(cell['tags']['y']), z=float(cell['tags']['z']))))
            
    def extractInstances(self, netpyne_model, netpyne_geppetto_library, geppetto_model):
        instance = pygeppetto.Variable(id='network')
        instance.types.append(netpyne_geppetto_library.types[0])
        geppetto_model.variables.append(instance)
        pass
