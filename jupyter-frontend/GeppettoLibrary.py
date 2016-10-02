import ipywidgets as widgets
from traitlets import (Unicode, Instance, List, Dict, Bool, Float)
from collections import defaultdict

from neuron import h
h.load_file("stdrun.hoc")


#UTILS
sync_values = defaultdict(list)

lastId = 0 
def newId():
    global lastId
    lastId+=1;
    return "id" + str(lastId)
    
    
#API    
def addButton(name, actions = None, value = None, extraData = None):
    if value is not None:
        valueUnits = h.units(value)
        if valueUnits != '':
            name += " (" + h.units(value) + ")"
            
    button = ComponentWidget(component_name='RAISEDBUTTON', widget_id=newId(), widget_name=name, extraData = extraData)
    if actions is not None:
        button.on_click(actions)
    
    return button

def addTextField(name, value = None):
    parameters = {'component_name':'TEXTFIELD', 'widget_id':newId(), 'widget_name' : name}
    
    if 'value' is not None:
        parameters['sync_value'] = str(eval("h."+ value))
        extraData = {'originalValue': str(eval("h."+value))}
        parameters['extraData'] = extraData
        parameters['value'] = value
    else:
        parameters['value'] = ''
    return ComponentWidget(**parameters)     

def addTextFieldAndButton(name, value = None, create_checkbox = False, actions = None):
    items = []
    items.append(addButton(name, actions = None, value = value))
    textField = addTextField(name, value)
    if create_checkbox == True:
        checkbox = addCheckbox("checkbox" + name)
        checkbox.on_change(textField.resetValueToOriginal)
        items.append(checkbox)
        textField.on_blur(checkbox.clickedCheckboxValue)
    items.append(textField)  
    panel = addPanel(name, items = items)
    panel.setDirection('row')
    return panel
        
def addPanel(name, items = None):
    if items is None: items = []
    for item in items:
        item.embedded = True
    panelWidget = PanelWidget(widget_id=newId(), widget_name=name, items=items)
    return panelWidget

def addCheckbox(name, sync_value = 'false'):
    return ComponentWidget(component_name='CHECKBOX', widget_id=newId(), widget_name=name, sync_value = sync_value)


# COMPONENT AND PANEL
class ComponentWidget(widgets.Widget):
    _view_name = Unicode('ComponentView').tag(sync=True)
    _view_module = Unicode('geppettoWidgets').tag(sync=True)
    _model_name = Unicode('ComponentModel').tag(sync=True)
    _model_module = Unicode('geppettoWidgets').tag(sync=True)
    
    widget_id = Unicode('').tag(sync=True)
    widget_name = Unicode('').tag(sync=True)
    embedded = Bool(True).tag(sync=True)
    
    component_name = Unicode('').tag(sync=True)
    
    sync_value = Unicode().tag(sync=True)
    value = None
    extraData = None
    
    clickCallbacks = []
    changeCallbacks = []
    blurCallbacks = []
    
    def __init__(self, **kwargs):
        super(ComponentWidget, self).__init__(**kwargs)

        if 'value' in kwargs and kwargs["value"] is not None:
            sync_values[kwargs["value"]] = self
        
        self._click_handlers = widgets.CallbackDispatcher()
        self._change_handlers = widgets.CallbackDispatcher()
        self._blur_handlers = widgets.CallbackDispatcher()
        
        self.on_msg(self._handle_button_msg)
        
    def clickedCheckboxValue(targetComponent, triggeredComponent, args):
        if args[1]['data'] != None and float(args[1]['data']) != float(triggeredComponent.extraData['originalValue']):
            targetComponent.sync_value =  'true'
        else:        
            targetComponent.sync_value =  'false'
            
    def resetValueToOriginal(targetComponent, triggeredComponent, args):
        triggeredComponent.sync_value = 'false'
        exec("h." + targetComponent.value + "=" + str(targetComponent.extraData['originalValue']))
        #targetComponent.sync_value = str(targetComponent.extraData['originalValue'])
        
    def fireChangeCallbacks(self, *args, **kwargs):
        self.fireCallbacks(self.changeCallbacks, args)
        
    def fireClickCallbacks(self, *args, **kwargs):
        self.fireCallbacks(self.clickCallbacks, args)    
        
    def fireBlurCallbacks(self, *args, **kwargs):
        self.fireCallbacks(self.blurCallbacks, args)
        if self.value != None and args[1]['data'] != None:
            exec("h." + self.value + "=" + str(args[1]['data']))
        
    def fireCallbacks(self, cbs, args):
        if isinstance(cbs, list):
            for callback in cbs:
                exec(callback)
        else:
            cbs(self, args)
        
    def on_click(self, callbacks, remove=False):
        """Register a callback to execute when the button is clicked.

        The callback will be called with one argument, the clicked button
        widget instance.

        Parameters
        ----------
        remove: bool (optional)
            Set to true to remove the callback from the list of callbacks.
        """
        self.clickCallbacks = callbacks    
        self._click_handlers.register_callback(self.fireClickCallbacks, remove=remove)
        
    def on_change(self, callbacks, remove=False):
        """Register a callback to execute when the button is clicked.

        The callback will be called with one argument, the clicked button
        widget instance.

        Parameters
        ----------
        remove: bool (optional)
            Set to true to remove the callback from the list of callbacks.
        """
        self.changeCallbacks = callbacks    
        self._change_handlers.register_callback(self.fireChangeCallbacks, remove=remove)
        
    def on_blur(self, callbacks, remove=False):
        """Register a callback to execute when the button is clicked.

        The callback will be called with one argument, the clicked button
        widget instance.

        Parameters
        ----------
        remove: bool (optional)
            Set to true to remove the callback from the list of callbacks.
        """
        self.blurCallbacks = callbacks    
        self._blur_handlers.register_callback(self.fireBlurCallbacks, remove=remove)    

    def _handle_button_msg(self, _, content, buffers):
        """Handle a msg from the front-end.

        Parameters
        ----------
        content: dict
            Content of the msg.
        """
        if content.get('event', '') == 'click':
            self._click_handlers(self, content)
        elif content.get('event', '') == 'change':  
            self._change_handlers(self, content)
        elif content.get('event', '') == 'blur':
            self._blur_handlers(self, content)

class PanelWidget(widgets.Widget):
    _view_name = Unicode('PanelView').tag(sync=True)
    _view_module = Unicode('geppettoWidgets').tag(sync=True)
    _model_name = Unicode('PanelModel').tag(sync=True)
    _model_module = Unicode('geppettoWidgets').tag(sync=True)
    
    widget_id = Unicode('').tag(sync=True)
    widget_name = Unicode('').tag(sync=True)
        
    items = List(Instance(widgets.Widget)).tag(sync=True, **widgets.widget_serialization) 
    parentStyle = Dict({'flexDirection': 'column'}).tag(sync=True)
    embedded = Bool(False).tag(sync=True)
    
    def __init__(self, **kwargs):
        super(PanelWidget, self).__init__(**kwargs)
        self._click_handlers = widgets.CallbackDispatcher()
        self.on_msg(self._handle_income_msg)
        
    def on_click(self, callback, remove=False):
        """Register a callback to execute when the button is clicked.

        The callback will be called with one argument, the clicked button
        widget instance.

        Parameters
        ----------
        remove: bool (optional)
            Set to true to remove the callback from the list of callbacks.
        """
        self._click_handlers.register_callback(callback, remove=remove)

    def _handle_income_msg(self, _, content, buffers):
        """Handle a msg from the front-end.

        Parameters
        ----------
        content: dict
            Content of the msg.
        """
        if content.get('event', '') == 'click':
            self._click_handlers(self)
    
    def addChild(self, child):
        child.embedded = True
        self.items = [i for i in self.items] + [child]
        
    def setDirection(self, direction):
        self.parentStyle ={'flexDirection': direction}