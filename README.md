# NEURON-UI

This repository hosts an experimental prototype for a new user interface for [NEURON](http://www.neuron.yale.edu/neuron/) based on web technologies. 

To install:
```
pip install neuron_ui
jupyter nbextension enable --py jupyter_geppetto
```

For a development installation:
```
git clone https://github.com/MetaCell/NEURON-UI.git
python utilities/install.py
```

This scripts clones all needed repos and install the extension and NEURON in development mode. Any change to python and js code will be automatically deploy. However, for js code we will have to execute (in this path NEURON-UI/org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp):
```
npm run build-dev-noTest
```

A better option is to run:
```
npm run build-dev-noTest:watch
```
so that any change in the js code will trigger a rebuild.


To run:
```
NEURON-UI
```

To update from sources:
```
python update.py
```

![Screenshot](https://dl.dropboxusercontent.com/u/7538688/Don%27t%20delete%2C%20used%20in%20wikis%20etc/release034.png)

The available functionality is currently limited to the RunControl panel, a basic cell builder, a simplified point process manager that lets you inject a current clamp and space plot functionality.

<p align="center">
  <img src="https://dl.dropboxusercontent.com/u/7538688/Don%27t%20delete%2C%20used%20in%20wikis%20etc/Screen_Shot_2016-06-15_at_18.06.16.png" alt="Old RunControl panel" height="300"/>
</p>

This prototype is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/) and the [Sense Lab](https://senselab.med.yale.edu/).

The UI connects to [nrnpython](http://www.neuron.yale.edu/neuron/static/docs/help/neuron/neuron/classes/python.html) through a [Geppetto](http://git.geppetto.org) extension for [Jupyter Notebook](http://jupyter.org/).

See the [Wiki](https://github.com/MetaCell/NEURON-UI/wiki) for more info!
