import setuptools
from setuptools.command.install import install
import subprocess
from utils import *


print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', '-b', 'pipImprovement', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'])

subprocess.call(['git', 'checkout', 'tags/v0.3.4.jupyterStable3'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')

print("Cloning Geppetto Neuron Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-neuron.git'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/')

enable_geppetto_neuron_extension()
install_geppetto_jupyter_python((len(sys.argv) > 1 and sys.argv[1] == 'overwrite'))
run_nbextension_install(False)
