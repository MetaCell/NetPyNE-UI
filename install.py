import setuptools
from setuptools.command.install import install
import subprocess
from utils import *


print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'])

#print("Checking out development branch for Geppetto Jupyter ...")
subprocess.call(['git', 'checkout', 'development'], cwd='org.geppetto.frontend.jupyter')

#FIXME: Change to development once merged
subprocess.call(['git', 'checkout', 'development-jupyter'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')

print("Cloning Geppetto Neuron Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-neuron.git'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/')
subprocess.call(['git', 'checkout', 'development'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')

enable_geppetto_neuron_extension()
install_geppetto_jupyter_python((len(sys.argv) > 1 and sys.argv[1] == 'overwrite'))
run_nbextension_install(False)
