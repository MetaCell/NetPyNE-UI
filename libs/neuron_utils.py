import logging
#from netpyne import utils
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
            num_points = len(points)
            for i in range(num_points - 1):
                if (num_points - 2) == 0:
                    segment_index = 0.5
                else:
                    segment_index = i / (num_points - 2)
                geometries.append(G.createGeometry(sec_name=sec_name, index=i, position=points[i], distal=points[i + 1], python_variable={'section': sec['neuronSec'], 'segment': segment_index}))

    logging.debug("Sections and segments converted to Geppetto")
    logging.debug("Geometries found: " + str(len(geometries)))
    GeppettoJupyterModelSync.current_model.addGeometries(geometries)
    return geometries

#GUI API
def add_button(name, actions = None, value = None, extraData = None):
    if value is not None:
        valueUnits = h.units(value)
        if valueUnits != '':
            name += " (" + valueUnits + ")"

    button = GeppettoJupyterGUISync.ComponentSync(component_name='RAISEDBUTTON', widget_id=G.newId(), widget_name=name, extraData = extraData)
    if actions is not None:
        button.on_click(actions)
    return button

def add_text_field(name, value = None):
    parameters = {'component_name':'TEXTFIELD', 'widget_id': G.newId(), 'widget_name' : name}

    if value is not None:
        parameters['sync_value'] = str(eval("h."+ value))
        parameters['extraData'] = {'originalValue': str(eval("h."+value))}
        parameters['value'] = value
    else:
        parameters['value'] = ''
    textfield = GeppettoJupyterGUISync.ComponentSync(**parameters)
    if value is not None:
        textfield.on_blur(sync_value)
    return textfield

def add_label(id, name):
    return GeppettoJupyterGUISync.ComponentSync(component_name = 'LABEL', widget_id = G.newId(), widget_name = name, sync_value = id)

def add_text_field_with_label(name, value=None):
    items = []
    textfield = add_text_field(name, value)
    items.append(add_label(textfield.widget_id, name))
    items.append(textfield)

    panel = add_panel(name, items=items)
    panel.setDirection('row')
    return panel

def add_text_field_and_button(name, value=None, create_checkbox=False, actions=None, extraData=None):
    items = []
    # Add Button
    items.append(add_button(name, actions=None, value=value, extraData=extraData))
    # Create Text Field
    textField = add_text_field(name, value)
    if create_checkbox == True:
        # Create Checkbox
        checkbox = add_checkbox("checkbox" + name, extraData={'targetComponent': textField})
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

def add_panel(name, items = [], widget_id=None, positionX=-1, positionY=-1):
    if widget_id is None: widget_id = G.newId()
    for item in items:
        item.embedded = True
    return GeppettoJupyterGUISync.PanelSync(widget_id = widget_id, widget_name=name, items=items, positionX=positionX, positionY=positionY)

def add_checkbox(name, sync_value = 'false', extraData = None):
    return GeppettoJupyterGUISync.ComponentSync(component_name='CHECKBOX', widget_id=G.newId(), widget_name=name, sync_value = sync_value, extraData = extraData)

def resetValueToOriginal(triggeredComponent, args):
    logging.debug("Reseting value for textfield")
    logging.debug(triggeredComponent.extraData['targetComponent'].value)
    logging.debug(triggeredComponent.extraData['targetComponent'].extraData['originalValue'])
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
