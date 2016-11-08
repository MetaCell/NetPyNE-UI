import setuptools
from setuptools.command.install import install
import subprocess
import sys
import json


# Install and enable the Geppetto Jupyter extension
def run_nbextension_install(develop):
    from notebook.nbextensions import install_nbextension_python, enable_nbextension_python, install_nbextension
    from notebook.serverextensions import toggle_serverextension_python
    from notebook import version_info

    # Command: sudo jupyter nbextension enable --py widgetsnbextension
    print("Enabling geppettoJupyter extensions ...")
    isEnabled = enable_nbextension_python('widgetsnbextension')
    if not isEnabled:
        raise Exception('Problem enabling widgetsnbextension extension')

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
    
    # Command: sudo jupyter nbextension install s
    # Command: sudo jupyter nbextension enable overwrite_get_msg_cell
    print("Installing and enabling additional geppettoJupyter extension ...")
    install_nbextension('org.geppetto.frontend.jupyter/src/geppettoJupyter/overwrite_get_msg_cell.js', symlink=develop)
    ext_require_path = 'overwrite_get_msg_cell'
    if version_info[0] > 4:  # notebook 5.x
        from notebook.nbextensions import enable_nbextension
        enable_nbextension('notebook', ext_require_path)
    else:  # notebook 4.x
        from notebook.nbextensions import EnableNBExtensionApp
        EnableNBExtensionApp().toggle_nbextension(ext_require_path)


print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'])

print("Checking out development branch for Geppetto Jupyter ...")
subprocess.call(['git', 'checkout', 'integratingPlotWidget'], cwd='org.geppetto.frontend.jupyter')
# We are checking out development so it's straightforward to commit and push changes
subprocess.call(['git', 'checkout', 'integratingPlot'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')

print("Cloning Geppetto Neuron Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-neuron.git'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/')
subprocess.call(['git', 'checkout', 'integratingPlot'],
                cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')
print("Enabling Geppetto Neuron Configuration ...")
jsonFile = open(
    'org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/extensionsConfiguration.json',
    "w+")
jsonFile.write(json.dumps({"geppetto-neuron/ComponentsInitialization": True}))
jsonFile.close()

print("Installing Geppetto Jupyter python package ...")

if len(sys.argv) > 1 and sys.argv[1] == 'overwrite':
    subprocess.call(['pip', 'install', '.', '--upgrade', '--no-deps', '--force-reinstall'],
                    cwd='org.geppetto.frontend.jupyter')
else:
    subprocess.call(['pip', 'install', '.'], cwd='org.geppetto.frontend.jupyter')

print("Installing Geppetto Jupyter Extension ...")
run_nbextension_install(False)
