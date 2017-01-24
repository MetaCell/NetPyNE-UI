import logging
from math import sqrt, pow
import neuron_geometries_utils
from geppettoJupyter.geppetto_comm import GeppettoCoreAPI as G

from geppettoJupyter.geppetto_comm import GeppettoJupyterModelSync
from geppettoJupyter.geppetto_comm import GeppettoJupyterGUISync

from neuron import h
h.load_file("stdrun.hoc")


def configure_logging():
    logger = logging.getLogger()
    fhandler = logging.FileHandler(filename='neuron.log', mode='a')
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fhandler.setFormatter(formatter)
    logger.addHandler(fhandler)
    logger.setLevel(logging.DEBUG)
    logging.debug('Log configured')


def calculate_segment_location(nseg, distance_to_selection_normalised, section_length):
    interval = 1.0 / nseg
    seg_index = int(distance_to_selection_normalised * nseg)
    seg_loc_normalised = seg_index * interval + interval / 2
    seg_loc = seg_loc_normalised * section_length
    return seg_loc


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


def extractGeometries():

    logging.debug('Extracting Morphology')
    logging.debug('Extracting secs and segs from neuron')
    secs, secLists, synMechs = neuron_geometries_utils.getCellParams(None)
    logging.debug('Secs and segs extracted from neuron')
    geometries = []

    # Hack to convert non pt3d geometries
    if 'pt3d' not in list(secs.values())[0]['geom']:
        logging.debug('Non pt3d geometries. Converting to pt3d')
        secs = neuron_geometries_utils.convertTo3DGeoms(secs)
        logging.debug('Geometries converted to pt3d')

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

# GUI API


def add_button(name, actions=None, value=None, extraData=None):
    if value is not None:
        valueUnits = h.units(value)
        if valueUnits != '':
            name += " (" + valueUnits + ")"

    button = GeppettoJupyterGUISync.ButtonSync(
        widget_id=G.newId(), widget_name=name, extraData=extraData)
    if actions is not None:
        button.on_click(actions)
    return button


def add_label(id, name):
    return GeppettoJupyterGUISync.LabelSync(widget_id=G.newId(), widget_name=name, sync_value=id)


def add_text_field(name, value=None, read_only=False):
    parameters = {'widget_id': G.newId(), 'widget_name': name}
    parameters['read_only'] = read_only

    if value is not None:
        parameters['sync_value'] = str(eval("h." + value))
        parameters['extraData'] = {'originalValue': str(eval("h." + value))}
        parameters['value'] = value
    else:
        parameters['value'] = ''
    textfield = GeppettoJupyterGUISync.TextFieldSync(**parameters)
    if value is not None:
        textfield.on_blur(sync_value)
    return textfield


def add_text_field_with_label(name, value=None, read_only=False):
    items = []
    textfield = add_text_field(name, value, read_only)
    items.append(add_label(textfield.widget_id, name))
    items.append(textfield)

    panel = add_panel(name, items=items)
    panel.setDirection('row')
    return panel


def add_drop_down(name, items):
    return GeppettoJupyterGUISync.DropDownSync(widget_id=G.newId(), widget_name=name, items=items)


def add_drop_down_with_label(name, drop_down_items=[]):
    items = []
    dropdown = add_drop_down(name, drop_down_items)
    items.append(add_label(dropdown.widget_id, name))
    items.append(dropdown)

    panel = add_panel(name, items=items)
    panel.setDirection('row')
    return panel


def add_text_field_and_button(name, value=None, create_checkbox=False, actions=None, extraData=None):
    items = []
    # Add Button
    items.append(add_button(name, actions=None,
                            value=value, extraData=extraData))
    # Create Text Field
    textField = add_text_field(name, value)
    if create_checkbox == True:
        # Create Checkbox
        checkbox = add_checkbox(
            "checkbox" + name, extraData={'targetComponent': textField})
        checkbox.on_change(resetValueToOriginal)
        items.append(checkbox)

        # Link Checkbox and Textfield to allow Neuron reset behaviour
        textField.on_blur(clickedCheckboxValue)
        textField.extraData['targetComponent'] = checkbox
    items.append(textField)

    # Create Panel and set layout
    panel = add_panel(name, items=items)
    panel.setDirection('row')
    return panel


def add_panel(name, items=[], widget_id=None, positionX=-1, positionY=-1):
    if widget_id is None:
        widget_id = G.newId()
    for item in items:
        item.embedded = True
    return GeppettoJupyterGUISync.PanelSync(widget_id=widget_id, widget_name=name, items=items, embedded=False, positionX=positionX, positionY=positionY)


def add_checkbox(name, sync_value='false', extraData=None):
    return GeppettoJupyterGUISync.CheckboxSync(widget_id=G.newId(), widget_name=name, sync_value=sync_value, extraData=extraData)


def resetValueToOriginal(triggeredComponent, args):
    logging.debug("Reseting value for textfield")
    logging.debug(triggeredComponent.extraData['targetComponent'].value)
    logging.debug(triggeredComponent.extraData[
                  'targetComponent'].extraData['originalValue'])
    triggeredComponent.sync_value = 'false'
    exec("h." + triggeredComponent.extraData['targetComponent'].value + "=" +
         str(triggeredComponent.extraData['targetComponent'].extraData['originalValue']))
    #targetComponent.sync_value = str(targetComponent.extraData['originalValue'])


def sync_value(triggeredComponent, args):
    logging.debug("Syncing value on blur for textfield")
    if triggeredComponent.value != None and triggeredComponent.value != '' and args['data'] != None:
        exec("h." + triggeredComponent.value + "=" + str(args['data']))


def clickedCheckboxValue(triggeredComponent, args):
    logging.debug("Clicking checkbox due to change on textfield")
    if args['data'] != None and float(args['data']) != float(triggeredComponent.extraData['originalValue']):
        triggeredComponent.extraData['targetComponent'].sync_value = 'true'
    else:
        triggeredComponent.extraData['targetComponent'].sync_value = 'false'
