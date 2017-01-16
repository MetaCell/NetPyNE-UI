
"""
utils.py 
Useful functions
Contributors: 
"""
import os
import sys
from neuron import h
h.load_file("stdrun.hoc")


def convertTo3DGeoms(secs):
    # set 3d geoms for reduced cell models
    offset = 0
    prevL = 0
    for secName, sec in secs.items():
        sec['geom']['pt3d'] = []
        # sec['neuronSec'] = sec
        if secName in ['soma', 'Adend1', 'Adend2', 'Adend3']:  # set 3d geom of soma and Adends
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

        if len(secs) == 1:
            secName = 'soma'  # if just one section rename to 'soma'
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
