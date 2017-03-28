
"""
utils.py 
Useful functions
Contributors: 
"""
import os
import sys
from neuron import h
from math import sqrt, pow, ceil
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G
import logging
h.load_file("stdrun.hoc")
from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync

def calculate_distance_to_cylinder_location(geometry, seg_loc):
    distance_to_seg_loc = 0
    proximal = []
    distal = []
    for point_index in range(len(geometry.python_variable["section_points"]) - 1):
        proximal = geometry.python_variable["section_points"][point_index]
        distal = geometry.python_variable["section_points"][point_index + 1]
        geometry_length = sqrt(pow(distal[0] - proximal[0], 2) + pow(
            distal[1] - proximal[1], 2) + pow(distal[2] - proximal[2], 2))
        if seg_loc < geometry_length + distance_to_seg_loc:
            break
        distance_to_seg_loc += geometry_length
    return distal, proximal, distance_to_seg_loc

def calculate_distance_to_selection(geometry, point):
    # Calculate segment
    geometry_index = int(geometry.id.rsplit('_', 1)[1])
    section_length = 0
    distance_to_selection = 0
    for point_index in range(len(geometry.python_variable["section_points"]) - 1):
        # Calculate geometry length
        proximal = geometry.python_variable["section_points"][point_index]
        distal = geometry.python_variable["section_points"][point_index + 1]
        geometry_length = sqrt(pow(distal[0] - proximal[0], 2) + pow(
            distal[1] - proximal[1], 2) + pow(distal[2] - proximal[2], 2))
        section_length += geometry_length
        # Add geometry length or distance to selection
        if point_index < geometry_index:
            distance_to_selection += geometry_length
        elif point_index == geometry_index:
            # Calculate project point
            geometry_vector = [distal[0] - proximal[0],
                               distal[1] - proximal[1], distal[2] - proximal[2]]
            point_vector = [point[0] - proximal[0],
                            point[1] - proximal[1], point[2] - proximal[2]]
            t_num = geometry_vector[0] * point_vector[0] + geometry_vector[
                1] * point_vector[1] + geometry_vector[2] * point_vector[2]
            t_den = geometry_vector[0] * geometry_vector[0] + geometry_vector[
                1] * geometry_vector[1] + geometry_vector[2] * geometry_vector[2]
            t = t_num / t_den
            projected_point = [proximal[0] + t * geometry_vector[0], proximal[
                1] + t * geometry_vector[1], proximal[2] + t * geometry_vector[2]]

            distance_to_selection += sqrt(pow(projected_point[0] - proximal[0], 2) + pow(
                projected_point[1] - proximal[1], 2) + pow(projected_point[2] - proximal[2], 2))

    return distance_to_selection, section_length



def getGeometriesBySegment(segment, secs):
    secData = None
    secDataName = None
    for sec_name, sec in secs.items():
        if sec['neuronSec'] == segment.sec:
            secData = sec
            secDataName = sec_name
            break
    section_points = secData['geom']['pt3d']
    section_length = calculate_section_length(section_points)
    interval = section_length / segment.sec.nseg
    seg_index = ceil(segment.x * segment.sec.nseg) -1
    if seg_index < 0:
        seg_index = 0
    seg_init = seg_index*interval
    seg_end = (seg_index+1)*interval

    geometries = []
    length = 0
    for point_index in range(len(section_points) - 1):
        # Calculate geometry length
        proximal = section_points[point_index]
        distal = section_points[point_index + 1]
        geometry_length = sqrt(pow(distal[0] - proximal[0], 2) + pow(
            distal[1] - proximal[1], 2) + pow(distal[2] - proximal[2], 2))

        # Add geometry length or distance to selection
        if length >= seg_init and length < seg_end:
            geometries.append(GeppettoJupyterModelSync.current_model.id + "." + G.removeSpecialCharacters(secDataName) + "_" + str(point_index))
        elif length > seg_end:
            break

        length += geometry_length

    return geometries

secs = {}

def extractGeometries(reload=False):
    global secs
    secs = getNeuronGeometries(reload)

    geometries = []
    logging.debug("Converting sections and segments to Geppetto")
    for sec_name, sec in secs.items():
        if 'pt3d' in sec['geom']:
            points = sec['geom']['pt3d']
            for i in range(len(points) - 1):
                geometries.append(G.createGeometry(sec_name=sec_name, index=i, position=points[i], distal=points[
                                  i + 1], python_variable={'section': sec['neuronSec'], 'section_points': sec['geom']['pt3d']}))

    logging.debug("Sections and segments converted to Geppetto")
    logging.debug("Geometries found: " + str(len(geometries)))
    GeppettoJupyterModelSync.current_model.addGeometries(geometries)
    return geometries

def getNeuronGeometries(reload = False):
    global secs
    if secs != {} and reload is False:
        return secs
    else:
        logging.debug('Extracting Morphology')
        logging.debug('Extracting secs and segs from neuron')
        secs, secLists, synMechs = getCellParams(None)
        logging.debug('Secs and segs extracted from neuron')

        # Hack to convert non pt3d geometries
        if 'pt3d' not in list(secs.values())[0]['geom']:
            logging.debug('Non pt3d geometries. Converting to pt3d')
            secs = convertTo3DGeoms(secs)
            logging.debug('Geometries converted to pt3d')
            # This is not working as expected. It is creating an extre segment for soma and dend
            # h.define_shape()
        return secs

def calculate_sphere_coordinates_and_radius(distal, proximal, seg_loc, distance_to_seg_loc):
    average_radius = (proximal[3] + distal[3]) / 2
    geometry_vector = [distal[0] - proximal[0],
                       distal[1] - proximal[1], distal[2] - proximal[2]]
    geometry_vector_length = sqrt(pow(
        geometry_vector[0], 2) + pow(geometry_vector[1], 2) + pow(geometry_vector[2], 2))
    distance_in_seg = (seg_loc - distance_to_seg_loc) / geometry_vector_length
    sphere_coordinates = [proximal[0] + distance_in_seg * geometry_vector[0], proximal[1] +
                          distance_in_seg * geometry_vector[1], proximal[2] + distance_in_seg * geometry_vector[2]]
    return sphere_coordinates, average_radius

def calculate_section_length(section_points):
    section_length = 0
    for point_index in range(len(section_points) - 1):
        # Calculate geometry length
        proximal = section_points[point_index]
        distal = section_points[point_index + 1]
        geometry_length = sqrt(pow(distal[0] - proximal[0], 2) + pow(
            distal[1] - proximal[1], 2) + pow(distal[2] - proximal[2], 2))
        section_length += geometry_length
    return section_length

def calculate_segment_location(nseg, distance_to_selection_normalised, section_length):
    interval = 1.0 / nseg
    seg_index = int(distance_to_selection_normalised * nseg)
    seg_loc_normalised = seg_index * interval + interval / 2
    seg_loc = seg_loc_normalised * section_length
    return seg_loc

def convertTo3DGeoms(secs):
    # set 3d geoms for reduced cell models
    offset = 0
    prevL = 0
    for secName, sec in secs.items():
        sec['geom']['pt3d'] = []
        if secName in ['Adend1', 'Adend2', 'Adend3']:  # set 3d geom of soma and Adends
            sec['geom']['pt3d'].append(
                [offset + 0, prevL, 0, sec['geom']['diam']])
            prevL = float(prevL + sec['geom']['L'])
            sec['geom']['pt3d'].append(
                [offset + 0, prevL, 0, sec['geom']['diam']])
        elif secName in ['axon']:  # set 3d geom of axon
            sec['geom']['pt3d'].append([offset + 0, 0, 0, sec['geom']['diam']])
            sec['geom']['pt3d'].append(
                [offset + 0, -sec['geom']['L'], 0, sec['geom']['diam']])
        else:  # set 3d geom of dend
            sec['geom']['pt3d'].append([offset + 0, 0, 0, sec['geom']['diam']])
            nseg = sec['geom']['nseg']
            for i in range(nseg):
                sec['geom']['pt3d'].append(
                    [offset + (sec['geom']['L'] / nseg) * (i + 1), 0, 0, sec['geom']['diam']])
    return secs


def _equal_dicts(d1, d2, ignore_keys):
    ignored = set(ignore_keys)
    for k1, v1 in d1.items():
        if k1 not in ignored and (k1 not in d2 or d2[k1] != v1):
            return False
    for k2, v2 in d2.items():
        if k2 not in ignored and k2 not in d1:
            return False
    return True

section_name_dict = {}


def getSecName(sec, dirCellSecNames=None):
    if sec in section_name_dict:
        return section_name_dict[sec]

    if dirCellSecNames is None:
        dirCellSecNames = {}

    if '>.' in sec.name():
        fullSecName = sec.name().split('>.')[1]
    elif '.' in sec.name():
        fullSecName = sec.name().split('.')[1]
    else:
        fullSecName = sec.name()
    if '[' in fullSecName:  # if section is array element
        secNameTemp = fullSecName.split('[')[0]
        secIndex = int(fullSecName.split('[')[1].split(']')[0])
        secName = secNameTemp + '_' + str(secIndex)  # (secNameTemp,secIndex)
    else:
        secName = fullSecName
        secIndex = -1
    if secName in dirCellSecNames:  # get sec names from python
        secName = dirCellSecNames[secName]

    # Add index for network
    index = ""
    while (secName + str(index)) in section_name_dict.values():
        if index == "":
            index = 0
        else:
            index += 1
    secName += str(index)

    section_name_dict[sec] = secName
    return secName


def mechVarList():
    msname = h.ref('')
    varList = {}
    for i, mechtype in enumerate(['mechs', 'pointps']):
        # either distributed mechs (0) or point process (1)
        mt = h.MechanismType(i)
        varList[mechtype] = {}
        for j in range(int(mt.count())):
            mt.select(j)
            mt.selected(msname)
            ms = h.MechanismStandard(msname[0], 1)  # PARAMETER (modifiable)
            varList[mechtype][msname[0]] = []
            propName = h.ref('')
            for var in range(int(ms.count())):
                k = ms.name(propName, var)
                varList[mechtype][msname[0]].append(propName[0])
    return varList


def getCellParams(cell):
    dirCell = dir(cell)

    if 'all_sec' in dirCell:
        secs = cell.all_sec
    elif 'sec' in dirCell:
        secs = [cell.sec]
    elif 'allsec' in dir(h):
        secs = [sec for sec in h.allsec()]
    elif 'soma' in dirCell:
        secs = [cell.soma]
    else:
        secs = []

    # create dict with hname of each element in dir(cell)
    dirCellHnames = {}
    for dirCellName in dirCell:
        try:
            dirCellHnames.update(
                {getattr(cell, dirCellName).hname(): dirCellName})
        except:
            pass
    # create dict with dir(cell) name corresponding to each hname
    dirCellSecNames = {}
    for sec in secs:
        dirCellSecNames.update(
            {hname: name for hname, name in dirCellHnames.items() if hname == sec.hname()})

    secDic = {}
    synMechs = []
    for sec in secs:
        # create new section dict with name of section
        secName = getSecName(sec, dirCellSecNames)

        # if len(secs) == 1:
        #     secName = 'soma'  # if just one section rename to 'soma'
        # create dictionary to store sec info
        secDic[secName] = {'geom': {}, 'topol': {},
                           'mechs': {}, 'neuronSec': sec}

        # store geometry properties
        standardGeomParams = ['L', 'nseg', 'diam', 'Ra', 'cm']
        secDir = dir(sec)
        for geomParam in standardGeomParams:
            # if geomParam in secDir:
            try:
                secDic[secName]['geom'][
                    geomParam] = sec.__getattribute__(geomParam)
            except:
                pass

        # store 3d geometry
        sec.push()  # access current section so ismembrane() works
        numPoints = int(h.n3d())
        if numPoints:
            points = []
            for ipoint in range(numPoints):
                x = h.x3d(ipoint)
                y = h.y3d(ipoint)
                z = h.z3d(ipoint)
                diam = h.diam3d(ipoint)
                points.append((x, y, z, diam))
            secDic[secName]['geom']['pt3d'] = points

        # store mechanisms
        # list of properties for all density mechanisms and point processes
        varList = mechVarList()
        ignoreMechs = ['dist']  # dist only used during cell creation
        ignoreVars = []  #
        mechDic = {}
        ionDic = {}

        for mech in dir(sec(0.5)):
            if h.ismembrane(mech) and mech not in ignoreMechs:  # check if membrane mechanism
                if not mech.endswith('_ion'):  # exclude ions
                    mechDic[mech] = {}  # create dic for mechanism properties
                    varNames = [varName.replace('_' + mech, '')
                                for varName in varList['mechs'][mech]]
                    varVals = []
                    for varName in varNames:
                        if varName not in ignoreVars:
                            try:
                                varVals = [seg.__getattribute__(
                                    mech).__getattribute__(varName) for seg in sec]
                                if len(set(varVals)) == 1:
                                    varVals = varVals[0]
                                mechDic[mech][varName] = varVals
                            except:
                                pass
                                # print 'Could not read variable %s from
                                # mechanism %s'%(varName,mech)

                # store ions
                elif mech.endswith('_ion'):
                    ionName = mech.split('_ion')[0]
                    varNames = [varName.replace(
                        '_' + mech, '').replace(ionName, '') for varName in varList['mechs'][mech]]
                    varNames.append('e')
                    varVals = []
                    ionDic[ionName] = {}  # create dic for mechanism properties
                    for varName in varNames:
                        varNameSplit = varName
                        if varName not in ignoreVars:
                            try:
                                varVals = [seg.__getattribute__(
                                    varNameSplit + ionName) for seg in sec]
                                if len(set(varVals)) == 1:
                                    varVals = varVals[0]
                                ionDic[ionName][varNameSplit] = varVals
                            except:
                                pass
                                # print 'Could not read variable %s from
                                # mechanism %s'%(varName,mech)

        secDic[secName]['mechs'] = mechDic
        if len(ionDic) > 0:
            secDic[secName]['ions'] = ionDic

        # add synapses and point neurons
        # for now read fixed params, but need to find way to read only synapse
        # params
        pointps = {}
        for seg in sec:
            for ipoint, point in enumerate(seg.point_processes()):
                pointpMod = point.hname().split('[')[0]
                varNames = varList['pointps'][pointpMod]
                if any([s in pointpMod.lower() for s in ['syn', 'ampa', 'gaba', 'nmda', 'glu']]):
                    # if 'synMech' in pptype.lower(): # if syn in name of point
                    # process then assume synapse
                    synMech = {}
                    synMech['label'] = pointpMod + '_' + str(len(synMechs))
                    synMech['mod'] = pointpMod
                    #synMech['loc'] = seg.x
                    for varName in varNames:
                        try:
                            synMech[varName] = point.__getattribute__(varName)
                        except:
                            print('Could not read variable %s from synapse %s' % (
                                varName, synMech['label']))

                    if not [_equal_dicts(synMech, synMech2, ignore_keys=['label']) for synMech2 in synMechs]:
                        synMechs.append(synMech)

                else:  # assume its a non-synapse point process
                    pointpName = pointpMod + '_' + str(len(pointps))
                    pointps[pointpName] = {}
                    pointps[pointpName]['mod'] = pointpMod
                    pointps[pointpName]['loc'] = seg.x
                    for varName in varNames:
                        try:
                            pointps[pointpName][
                                varName] = point.__getattribute__(varName)
                            # special condition for Izhi model, to set vinit=vr
                            # if varName == 'vr': secDic[secName]['vinit'] = point.__getattribute__(varName)
                        except:
                            print('Could not read %s variable from point process %s' % (
                                varName, pointpName))

        if pointps:
            secDic[secName]['pointps'] = pointps

        # store topology (keep at the end since h.SectionRef messes remaining
        # loop)
        secRef = h.SectionRef(sec=sec)
        if secRef.has_parent():
            secDic[secName]['topol']['parentSec'] = getSecName(
                secRef.parent().sec, dirCellSecNames)
            secDic[secName]['topol']['parentX'] = h.parent_connection()
            secDic[secName]['topol']['childX'] = h.section_orientation()

        h.pop_section()  # to prevent section stack overflow

    # store section lists
    secLists = h.List('SectionList')
    if int(secLists.count()):
        secListDic = {}
        for i in range(int(secLists.count())):  # loop over section lists
            hname = secLists.o(i).hname()
            if hname in dirCellHnames:  # use python variable name
                secListName = dirCellHnames[hname]
            else:
                secListName = hname
            secListDic[secListName] = [getSecName(
                sec, dirCellSecNames) for sec in secLists.o(i)]
    else:
        secListDic = {}

    # celsius warning
    if hasattr(h, 'celsius'):
        if h.celsius != 6.3:  # if not default value
            print(
                "Warning: h.celsius=%.4g in imported file -- you can set this value in simConfig['hParams']['celsius']" % (h.celsius))

    # clean
    h.initnrn()
    del(cell)  # delete cell
    import gc
    gc.collect()

    return secDic, secListDic, synMechs

    # cellRule['secs'] = secDic
    # if secListDic:
    #     cellRule['secLists'] = secListDic
