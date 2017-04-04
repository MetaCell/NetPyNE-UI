# NEURON-UI

This repository hosts an experimental prototype for a new user interface for [NEURON](http://www.neuron.yale.edu/neuron/) based on web technologies. 

To install:
```
pip install neuron_ui
jupyter nbextension enable --py jupyter_geppetto
```

To install from source:
```
git clone https://github.com/MetaCell/NEURON-UI.git
python utilities/install.py
```

To run:
```
NEURON-UI
```

To update from sources:
```
python update.py
```

![Screenshot](https://dl.dropboxusercontent.com/u/7538688/Don%27t%20delete%2C%20used%20in%20wikis%20etc/release034.png)

The available functionality is currently limited to the RunControl panel, a basic cell builder, point process and space plot functionality.

<p align="center">
  <img src="https://dl.dropboxusercontent.com/u/7538688/Don%27t%20delete%2C%20used%20in%20wikis%20etc/Screen_Shot_2016-06-15_at_18.06.16.png" alt="Old RunControl panel" height="300"/>
</p>

This prototype is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/) and the [Sense Lab](https://senselab.med.yale.edu/).

The UI connects to [nrnpython](http://www.neuron.yale.edu/neuron/static/docs/help/neuron/neuron/classes/python.html) through a [Geppetto](http://git.geppetto.org) extension for [Jupyter Notebook](http://jupyter.org/).

See the [Wiki](https://github.com/MetaCell/NEURON-UI/wiki) for more info!
