# NEURON-UI

[![Build Status](https://travis-ci.org/MetaCell/NEURON-UI.svg?branch=master)](https://travis-ci.org/MetaCell/NEURON-UI)


This repository hosts an experimental prototype for a new user interface for NEURON based on web technologies. 
The available functionality is currently limited to the RunControl panel.
This prototype is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/) and the [Sense Lab](https://senselab.med.yale.edu/).

The UI connects to [nrnpython](http://www.neuron.yale.edu/neuron/static/docs/help/neuron/neuron/classes/python.html) through a [Geppetto](http://git.geppetto.org) extension for [Jupyter Notebook](http://jupyter.org/).

To install:
```
git clone https://github.com/MetaCell/NEURON-UI.git
python setup.py #(In some setups this needs to run as sudo)
```
To run:
```
./NEURON-UI
```
To pull the latest and re-install:
```
python update.py
sudo python setup.py
```

