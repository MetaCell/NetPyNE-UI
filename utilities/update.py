import subprocess
from utils import *

# Hack so that it works in python 2 and 3
try: input = raw_input
except NameError: pass
reply = input("Any uncommited change to your jupyter notebook will be stashed. Are you sure you want to update NEURON-UI? (y/n)")

if reply[0] == 'y':
        subprocess.call(['git', 'pull'])
    subprocess.call(['git', 'checkout', 'development'], cwd='../org.geppetto.frontend.jupyter')
    subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter')
    subprocess.call(['git', 'checkout', 'tags/v0.3.4.jupyterStable3'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/')
    subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/')
    subprocess.call(['git', 'checkout', 'development'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-neuron/')
    subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-neuron/')
    subprocess.call(['npm', 'install'], cwd='org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/')
    subprocess.call(['npm', 'run', 'build-dev'], cwd='org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/')
    enable_geppetto_neuron_extension()
    install_package(True, '../org.geppetto.frontend.jupyter')
    run_nbextension_install(False)

    install_package(True, '..')
else:
    print("Exit without updating")


