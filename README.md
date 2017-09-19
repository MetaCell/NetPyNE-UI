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

This scripts clones all needed repos and install the extension and NEURON in development mode. This project consists on four different github repos:
```
{
  "name": "NEURON_UI",
  "path": ".",
  "url": "https://github.com/MetaCell/NEURON-UI"
},
{
  "name": "org.geppetto.frontend.jupyter",
  "path": "./org.geppetto.frontend.jupyter",
  "url": "https://github.com/openworm/org.geppetto.frontend.jupyter"
},
{
  "name": "org.geppetto.frontend",
  "path": "./org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/",
  "url": "https://github.com/openworm/org.geppetto.frontend"
},
{
  "name": "Geppetto Neuron",
  "path": "./org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-neuron/",
  "url": "https://github.com/MetaCell/geppetto-neuron"
}
```

A script with a set of tools can be found at /utilities/gitall.py. These are some examples of how to use it:
```
  python gitall.py branches: print current branch of each repo

  python gitall.py checkout <branch> : checkout <branch> on each repo

  python gitall.py pull: execute git pull on each repo

  python gitall.py fetch <remote> <branch> : execute git fetch on each repo

  python gitall.py status: execute git status on each repo
```

Any change to python code will be automatically deployed. However, for js code we will have to build the js sources. There are two options either you run:
```
npm run build-dev-noTest
```

at NEURON-UI/org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp on every change.

or, a better option, is to run:
```
python run-dev-server.py
```

at NEURON-UI/utilities so that any change in the js code will trigger a rebuild.

To run the server:
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
