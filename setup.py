import setuptools
from setuptools.command.install import install
import post_setup
import subprocess
#import pip
import os
import json


# Install and enable the Geppetto Jupyter extension
def run_nbextension_install(develop):
    from notebook.nbextensions import install_nbextension_python, enable_nbextension_python
    from notebook.serverextensions import toggle_serverextension_python

    # Command: sudo jupyter nbextension install --py geppettoJupyter
    print("Installing geppettoJupyter extension ...")
    install_nbextension_python('geppettoJupyter', symlink=develop)

    # Command: sudo jupyter nbextension enable --py geppettoJupyter
    print("Enabling geppettoJupyter extensions ...")
    isEnabled = enable_nbextension_python('geppettoJupyter')
    if not isEnabled:
        raise Exception('Problem enabling geppettoJupyter extension')

    # Command: jupyter serverextension enable --py geppettoJupyter
    print("Enabling server extensions ...")
    toggle_serverextension_python('geppettoJupyter', enabled=True)

print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'])

print("Checking out development branch for Geppetto Jupyter ...")
subprocess.call(['git', 'checkout', 'development'], cwd='org.geppetto.frontend.jupyter')
# We are checking out development so it's straightforward to commit and push changes
subprocess.call(['git', 'checkout', 'development'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')

print("Cloning Geppetto Neuron Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-neuron.git'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/')
print("Enabling Geppetto Neuron Configuration ...")
jsonFile = open(
    'org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/extensionsConfiguration.json',
    "w+")
jsonFile.write(json.dumps({"geppetto-neuron/ComponentsInitialization": True}))
jsonFile.close()

print("Installing Geppetto Jupyter python package ...")
#os.chdir('org.geppetto.frontend.jupyter')
#pip.main(['install', '.', '--upgrade', '--no-deps', '--force-reinstall', '--install-option',
#           '--jupyter-notebook-path="http://localhost:8888/notebooks/libs/neuron-ui-demo.ipynb"'])
subprocess.call(['pip', 'install', '.', '--upgrade', '--no-deps', '--force-reinstall', '--install-option', '--jupyter-notebook-path="http://localhost:8888/notebooks/libs/neuron-ui-demo.ipynb"'],
                cwd='org.geppetto.frontend.jupyter')

print("Installing Geppetto Jupyter Extension ...")
run_nbextension_install(False)

# setuptools.setup(
#     name="neuron-ui",
#     version="0.0.1",
#     url="https://github.com/MetaCell/NEURON-UI",
#     author="MetaCell",
#     description="Experimental UI for NEURON",
#     long_description=open('README.md').read(),
#     install_requires = [
#         'ipywidgets>=5.1.5',
#         'jupyter>=1.0.0'
#     ],
# )