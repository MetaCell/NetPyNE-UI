import setuptools
from setuptools.command.install import install
import subprocess
from utils import *


print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', '-b', 'pipImprovement', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'], cwd='../')

subprocess.call(['git', 'checkout', 'tags/v0.3.4.jupyterStable3'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/')

print("Cloning Geppetto Neuron Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-neuron.git'],
                cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/')

subprocess.call(['git', 'checkout', 'installationImprovements'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-neuron/')

enable_geppetto_neuron_extension()

print("Installing jupyter_geppetto python package ...")
install_package((len(sys.argv) > 1 and sys.argv[1] == 'overwrite'), '../org.geppetto.frontend.jupyter')
print("Installing jupyter_geppettor Extension ...")
run_nbextension_install(False)

print("Installing neuron_ui python package ...")
install_package((len(sys.argv) > 1 and sys.argv[1] == 'overwrite'), '..')
