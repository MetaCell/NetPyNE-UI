import logging
from neuron_ui import neuron_geometries_utils
from jupyter_geppetto.geppetto_comm import GeppettoCoreAPI as G

from jupyter_geppetto.geppetto_comm import GeppettoJupyterModelSync
from jupyter_geppetto.geppetto_comm import GeppettoJupyterGUISync

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
    

def createStateVariable(id = None, name = 'Untitled State Variable', units = 'Unknown', timeSeries = [], python_variable = None):
    geometries = []
    if python_variable["segment"] is not None:
        geometries = neuron_geometries_utils.getGeometriesBySegment(python_variable["segment"], neuron_geometries_utils.getNeuronGeometries())
    return G.createStateVariable(id=id, name=name,
                              units=units, python_variable=python_variable, geometries = geometries)

def createProject(name='Project'):
    neuron_geometries_utils.secs = {}
    G.createProject(name=name)



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


def add_panel(name, items=[], widget_id=None, position_x=-1, position_y=-1, width=-1,height=-1, properties={"closable":True}):
    if widget_id is None:
        widget_id = G.newId()
    for item in items:
        item.embedded = True
    return GeppettoJupyterGUISync.PanelSync(widget_id=widget_id, widget_name=name, items=items, embedded=False, position_x=position_x, position_y=position_y, width=width, height=height, properties=properties)


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
