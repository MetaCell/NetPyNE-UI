import subprocess
from utils import *

# Hack so that it works in python 2 and 3
try: input = raw_input
except NameError: pass
reply = input("Any uncommited change to your jupyter notebook will be stashed. Are you sure you want to update NEURON-UI? (y/n)")

if reply[0] == 'y':
    subprocess.call(['git', 'stash'])
    subprocess.call(['git', 'pull'])
    subprocess.call(['git', 'checkout', 'tags/v0.3.4.jupyterStable'], cwd='org.geppetto.frontend.jupyter')
    subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter')
    subprocess.call(['git', 'checkout', 'master'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')
    subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')
    subprocess.call(['git', 'checkout', 'master'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')
    subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')
    enable_geppetto_neuron_extension()
    install_geppetto_jupyter_python(True)
    run_nbextension_install(False)
else:
    print("Exit without updating")

