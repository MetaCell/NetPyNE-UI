import logging
#from netpyne import utils
import neuron_geometries_utils
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G

from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync


def configure_logging():
    logger = logging.getLogger()
    fhandler = logging.FileHandler(filename='neuron.log', mode='a')
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fhandler.setFormatter(formatter)
    logger.addHandler(fhandler)
    logger.setLevel(logging.DEBUG)
    logging.debug('Log configured')


def extractGeometries():

    logging.debug('Extracting Morphology')
    logging.debug('Extracting secs and segs from neuron')
    secs, secLists, synMechs = neuron_geometries_utils.getCellParams(None)
    logging.debug('Secs and segs extracted from neuron')
    geometries = []

    # Hack to convert non pt3d geometries
    if 'pt3d' not in list(secs.values())[0]['geom']:
        secs = neuron_geometries_utils.convertTo3DGeoms(secs)

    logging.debug("starting secs extraction")
    for secName, sec in secs.items():
        if 'pt3d' in sec['geom']:
            points = sec['geom']['pt3d']

            for i in range(len(points) - 1):
                position = points[i]
                distal = points[i + 1]

                # geometries.append(G.createGeometry(id=secName + "_" + str(i),
                #                                    name=secName + " " + str(i),
                #                                    bottomRadius=position[3],
                #                                    positionX=position[0],
                #                                    positionY=position[1],
                #                                    positionZ=position[2],
                #                                    topRadius=distal[3],
                #                                    distalX=distal[0],
                #                                    distalY=distal[1],
                #                                    distalZ=distal[2],
                #                                    python_variable={'section': sec['neuronSec'], 'segment': i}))

                geometries.append(GeppettoJupyterModelSync.GeometrySync(id=secName + "_" + str(i),
                                                                        name=secName + " " + str(i),
                                                                        bottomRadius=position[3],
                                                                        positionX=position[0],
                                                                        positionY=position[1],
                                                                        positionZ=position[2],
                                                                        topRadius=distal[3],
                                                                        distalX=distal[0],
                                                                        distalY=distal[1],
                                                                        distalZ=distal[2],
                                                                        python_variable={'section': sec['neuronSec'], 'segment': (i/len(points))}))


    logging.debug("finishing secs extraction")
    logging.debug("Geometries found: " + str(len(geometries)))
    GeppettoJupyterModelSync.current_model.addGeometries(geometries)
    return geometries
