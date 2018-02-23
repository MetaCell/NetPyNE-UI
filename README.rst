
Experimental prototype for a new user interface
for `NEURON <http://www.neuron.yale.edu/neuron/>`__ based on web
technologies.

This prototype is being developed in collaboration with the `Neurosim
Lab <http://neurosimlab.org/>`__ and the `Sense
Lab <https://senselab.med.yale.edu/>`__.

The UI connects to
`nrnpython <http://www.neuron.yale.edu/neuron/static/docs/help/neuron/neuron/classes/python.html>`__
through a `Geppetto <http://git.geppetto.org>`__ extension for `Jupyter
Notebook <http://jupyter.org/>`__.

See the `Repo <https://github.com/MetaCell/NetPyNE-UI>`__ and `Wiki <https://github.com/MetaCell/NetPyNE-UI/wiki>`__ for more
=======
NetPyNE-UI
=========

User Interface for NetPyNE.
See the `Repo <https://github.com/MetaCell/NetPyNE-UI>`__ and `Wiki <https://github.com/MetaCell/NetPyNE-UI/wiki>`__ for more
info!

Installation
============

.. code-block:: bash

    pip install netpyne_ui
    jupyter nbextension enable --py jupyter_geppetto

Usage
=====

.. code-block:: bash

    NetPyNE-UI

or 

.. code-block:: bash

    jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token=''


