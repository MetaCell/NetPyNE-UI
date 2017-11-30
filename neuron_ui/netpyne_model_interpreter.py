"""
netpyne_model_interpreter.py
Model interpreter for NetPyNE. This class creates a geppetto type
"""
import logging
import model as pygeppetto
from model.model_factory import GeppettoModelFactory
from model.values import Point, ArrayElement, ArrayValue
from netpyne import sim, utils


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
        # self.extractCellTypes(
        #     netpyne_model, netpyne_geppetto_library, geppetto_model)
        self.extractInstances(
            netpyne_model, netpyne_geppetto_library, geppetto_model)

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
            elif secName in ['axon']:  # set 3d geom of axon
                sec['geom']['pt3d'].append(
                    [offset + 0, 0, 0, sec['geom']['diam']])
                sec['geom']['pt3d'].append(
                    [offset + 0, -sec['geom']['L'], 0, sec['geom']['diam']])
            else:  # set 3d geom of dend
                sec['geom']['pt3d'].append(
                    [offset + 0, 0, 0, sec['geom']['diam']])
                nseg = sec['geom']['nseg']
                if nseg != {}:
                    for i in range(nseg):
                        sec['geom']['pt3d'].append(
                            [offset + (sec['geom']['L'] / nseg) * (i + 1), 0, 0, sec['geom']['diam']])
        return secs


    def extractPopulations(self, netpyne_model, netpyne_geppetto_library, geppetto_model):
        
        network = pygeppetto.CompositeType(id='network_netpyne', name='network_netpyne')
        netpyne_geppetto_library.types.append(network)

        for key, value in netpyne_model.net.pops.items():
            print key
            print value.__dict__
            print value.tags['cellType']

            
            
            cellType = pygeppetto.CompositeType(id=value.tags['cellType'], name=value.tags['cellType'], abstract= False)
            visualType = pygeppetto.CompositeVisualType(id='cellMorphology', name='cellMorphology')
            cellType.visualType = visualType

            print value.rand
            print value.cellModelClass
            print value.cellModelClass.__dict__

            
            elements = []
            for index, cell in enumerate(sim.net.cells):
                if cell.tags['pop'] == value.tags['pop']:

                    if len(visualType.variables) == 0:
                        secs = cell.secs
                        if 'pt3d' not in list(secs.values())[0]['geom']:
                            secs = self.convertTo3DGeoms(secs)
                        for sec_name, sec in secs.items():

                            if 'pt3d' in sec['geom']:
                                points = sec['geom']['pt3d']
                                for i in range(len(points) - 1):
                                    if sec_name == 'soma':
                                        visualType.variables.append(self.factory.createSphere(sec_name,
                                                                                                radius=float(points[i][3] / 2),
                                                                                                position=Point(x=float(points[i][0]),y=float(points[i][1]), z=float(points[i][2]))))
                                    else:
                                        visualType.variables.append(self.factory.createCylinder(sec_name,
                                                                                                bottomRadius=float(points[i][3] / 2),
                                                                                                topRadius=float(points[i + 1][3] / 2),
                                                                                                position=Point(x=float(points[i][0]),y=float(points[i][1]), z=float(points[i][2])),
                                                                                                distal=Point(x=float(points[i + 1][0]), y=float(points[i + 1][1]), z=float(points[i + 1][2]))))
                    

                    elements.append(ArrayElement(index=index , position=Point(x=0.0, y=0.0, z=0.0)))

                    print sim.net.cells
            
            
            netpyne_geppetto_library.types.append(cellType)
            netpyne_geppetto_library.types.append(visualType)


            defaultValue = ArrayValue(elements=elements)
            arrayType = pygeppetto.ArrayType(size=value.tags['numCells'],
                                                    arrayType=cellType,
                                                    id=key,
                                                    name=key,
                                                    defaultValue= defaultValue)
            netpyne_geppetto_library.types.append(arrayType)


            arrayVariable = pygeppetto.Variable(id=key)
            arrayVariable.types.append(arrayType)
            network.variables.append(arrayVariable)

        

        

    def extractCellTypes(self, netpyne_model, netpyne_geppetto_library, geppetto_model):

        secDic, secLists, synMechs, globs = utils.getCellParams(
            None, None, None)

        logging.debug(secDic)
        logging.debug(secLists)
        logging.debug(synMechs)
        logging.debug(globs)

        secs = self.convertTo3DGeoms(secDic)

        type = pygeppetto.CompositeType(id='cell', name='cell')
        visualType = pygeppetto.CompositeVisualType(id='cellMorphology', name='cellMorphology')
        type.visualType = visualType

        logging.debug("Converting sections and segments to Geppetto")
        for sec_name, sec in secs.items():
            if 'pt3d' in sec['geom']:
                points = sec['geom']['pt3d']
                for i in range(len(points) - 1):
                    if sec_name == 'soma':
                        visualType.variables.append(self.factory.createSphere(sec_name,
                                                                                radius=float(points[i][3] / 2),
                                                                                position=Point(x=float(points[i][0]),y=float(points[i][1]), z=float(points[i][2]))))
                    else:
                        visualType.variables.append(self.factory.createCylinder(sec_name,
                                                                                bottomRadius=float(points[i][3] / 2),
                                                                                topRadius=float(points[i + 1][3] / 2),
                                                                                position=Point(x=float(points[i][0]),y=float(points[i][1]), z=float(points[i][2])),
                                                                                distal=Point(x=float(points[i + 1][0]), y=float(points[i + 1][1]), z=float(points[i + 1][2]))))


        logging.debug("Sections and segments converted to Geppetto")

        # type = pygeppetto.CompositeType(id='cell',name='cell')
        # visualType = pygeppetto.CompositeVisualType(id='cellMorphology',name='cellMorphology')
        # type.visualType=visualType
        # visualType.variables.append(self.factory.createCylinder('apical0_1', bottomRadius=3.0, topRadius=3.0, position=Point(y=17.0), distal=Point(y=77.0)))
        # visualType.variables.append(self.factory.createCylinder('apical1_5', bottomRadius=1.5, topRadius=1.5, position=Point(y=77.0), distal=Point(x=-150.0,y=77.0)))
        # visualType.variables.append(self.factory.createCylinder('apical2_2', bottomRadius=2.2, topRadius=2.2, position=Point(y=77.0), distal=Point(y=477.0)))
        # visualType.variables.append(self.factory.createCylinder('apical2_2', bottomRadius=1.45, topRadius=1.45, position=Point(y=477.0), distal=Point(y=877.0)))
        # visualType.variables.append(self.factory.createCylinder('basal2_8', bottomRadius=2.5, topRadius=2.5, position=Point(y=-50.0), distal=Point(x=-106.07,y=-156.07)))
        # visualType.variables.append(self.factory.createCylinder('basal1_7', bottomRadius=2.5, topRadius=2.5, position=Point(y=-50.0), distal=Point(x=-106.07,y=-156.07)))
        # visualType.variables.append(self.factory.createCylinder('basal0_6', bottomRadius=2.0, topRadius=2.0, distal=Point(y=-50.0)))
        # visualType.variables.append(self.factory.createCylinder('soma_0', bottomRadius=11.5, topRadius=11.5, distal=Point(y=17.0)))
        # visualType.variables.append(self.factory.createCylinder('apical4_4', bottomRadius=11.5, topRadius=11.5, position=Point(y=877.0),distal=Point(y=1127.0)))

        netpyne_geppetto_library.types.append(type)
        netpyne_geppetto_library.types.append(visualType)

        # print netpyne_model.net.allCells[0]
        # sim.net.allCells[0]['secs']
        # sim.net.allCells[0]['conns']
        # sim.net.allCells[0]['conns']
        pass

    def extractInstances(self, netpyne_model, netpyne_geppetto_library, geppetto_model):
        instance = pygeppetto.Variable(id='network')
        instance.types.append(netpyne_geppetto_library.types[0])
        geppetto_model.variables.append(instance)
        pass
