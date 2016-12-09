from netpyne import utils
from neuron import h

from geppettoJupyter.geppetto_comm import GeppettoCore


def extractMorphology():
    secs, secLists, synMechs = utils.getCellParams(None)
    geometries = []

    # Convert non pt3d geometries
    secs = convertTo3DGeoms(secs)

    for secName, sec in secs.items():
        # TODO: What happen when we find more than two points
        # for pt3d in sec['geom']['pt3d']:

        position = sec['geom']['pt3d'][0]
        distal = sec['geom']['pt3d'][1]
        geometries.append(GeppettoCore.GeometrySync(name=secName,
                                  bottomRadius=position[3],
                                  positionX=position[0],
                                  positionY=position[1],
                                  positionZ=position[2],
                                  topRadius=distal[3],
                                  distalX=distal[0],
                                  distalY=distal[1],
                                  distalZ=distal[2]))
    return geometries

    #print(secs, secLists, synMechs)


# Exmaple Converting simple geoms to d3
def convertTo3DGeoms(secs):
    # set 3d geoms for reduced cell models
    offset = 0
    prevL = 0
    for secName, sec in secs.items():
        sec['geom']['pt3d'] = []
        if secName in ['soma', 'Adend1', 'Adend2', 'Adend3']:  # set 3d geom of soma and Adends
            sec['geom']['pt3d'].append(
                [offset + 0, prevL, 0, sec['geom']['diam']])
            prevL = float(prevL + sec['geom']['L'])
            sec['geom']['pt3d'].append(
                [offset + 0, prevL, 0, sec['geom']['diam']])
        if secName in ['Bdend', 'dend']:  # set 3d geom of Bdend
            sec['geom']['pt3d'].append([offset + 0, 0, 0, sec['geom']['diam']])
            sec['geom']['pt3d'].append(
                [offset + sec['geom']['L'], 0, 0, sec['geom']['diam']])
        if secName in ['axon']:  # set 3d geom of axon
            sec['geom']['pt3d'].append([offset + 0, 0, 0, sec['geom']['diam']])
            sec['geom']['pt3d'].append(
                [offset + 0, -sec['geom']['L'], 0, sec['geom']['diam']])

    return secs