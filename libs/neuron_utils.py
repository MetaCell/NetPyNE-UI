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

def extractGeometries():
    GeppettoJupyterModelSync.current_model.addGeometries(extractMorphology())

def extractMorphology():
    logging.warning('Extracting Morphology')
    secs, secLists, synMechs = neuron_geometries_utils.getCellParams(None)
    geometries = []

    # Hack to convert non pt3d geometries
    if 'pt3d' not in list(secs.values())[0]['geom']:
        secs = neuron_geometries_utils.convertTo3DGeoms(secs)

    for secName, sec in secs.items():

        # segs = [seg for seg in sec['neuronSec']]
        # logging.warning('lengths ' + str(len(segs)))

        for i in range(len(sec['geom']['pt3d']) - 1):
            # logging.warning(sec['neuronSec'][i])
            logging.warning("rala")
            logging.warning(sec['geom'])
            #segment = sec['neuronSec'](i)
            position = sec['geom']['pt3d'][i]
            distal = sec['geom']['pt3d'][i + 1]
            geometries.append(G.createGeometry(id=secName + "_" + str(i),
                                               name=secName + " " + str(i),
                                               bottomRadius=position[3],
                                               positionX=position[0],
                                               positionY=position[1],
                                               positionZ=position[2],
                                               topRadius=distal[3],
                                               distalX=distal[0],
                                               distalY=distal[1],
                                               distalZ=distal[2],
                                               # FIXME: Proper knowledge of the neuron api would remove this
                                               # python_variable={'section': sec['neuronSec'], 'segment':
                                               # float((i+1)/len(sec['geom']['pt3d']))}))
                                               python_variable={'section': sec['neuronSec'], 'segment': i}))
    return geometries
