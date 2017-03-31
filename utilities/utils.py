import sys
import json
import subprocess

def install_geppetto_jupyter_python(overwrite):
    print("Installing Geppetto Jupyter python package ...")

    if overwrite:
        subprocess.call(['pip', 'install', '.', '--upgrade', '--no-deps', '--force-reinstall'],
                        cwd='../org.geppetto.frontend.jupyter')
    else:
        subprocess.call(['pip', 'install', '.'], cwd='../org.geppetto.frontend.jupyter')


# Install and enable the Geppetto Jupyter extension
def run_nbextension_install(develop):
    print("Installing Geppetto Jupyter Extension ...")
    from notebook.nbextensions import install_nbextension_python, enable_nbextension_python, install_nbextension
    from notebook.serverextensions import toggle_serverextension_python
    from notebook import version_info

    # Command: sudo jupyter nbextension enable --py widgetsnbextension
    print("Enabling jupyter_geppetto extensions ...")
    isEnabled = enable_nbextension_python('widgetsnbextension')
    if not isEnabled:
        raise Exception('Problem enabling widgetsnbextension extension')

    # Command: sudo jupyter nbextension install --py jupyter_geppetto
    print("Installing jupyter_geppetto extension ...")
    install_nbextension_python('jupyter_geppetto', symlink=develop, user=True)

    # Command: sudo jupyter nbextension enable --py jupyter_geppetto
    print("Enabling jupyter_geppetto extensions ...")
    isEnabled = enable_nbextension_python('jupyter_geppetto')
    if not isEnabled:
        raise Exception('Problem enabling jupyter_geppetto extension')

    # Command: jupyter serverextension enable --py jupyter_geppetto
    print("Enabling server extensions ...")
    toggle_serverextension_python('jupyter_geppetto', enabled=True)
    
    # Command: sudo jupyter nbextension install s
    # Command: sudo jupyter nbextension enable overwrite_get_msg_cell
    print("Installing and enabling additional jupyter_geppetto extension ...")
    install_nbextension('../org.geppetto.frontend.jupyter/src/jupyter_geppetto/overwrite_get_msg_cell.js', symlink=develop, user=True)
    ext_require_path = 'overwrite_get_msg_cell'
    if version_info[0] > 4:  # notebook 5.x
        from notebook.nbextensions import enable_nbextension
        enable_nbextension('notebook', ext_require_path)
    else:  # notebook 4.x
        from notebook.nbextensions import EnableNBExtensionApp
        EnableNBExtensionApp().toggle_nbextension(ext_require_path)

# Enable the Geppetto Neuron extension
def enable_geppetto_neuron_extension():
    print("Enabling Geppetto Neuron Configuration ...")
    jsonFile = open(
        '../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/extensionsConfiguration.json',
        "w+")
    jsonFile.write(json.dumps({"geppetto-neuron/ComponentsInitialization": True}))
    jsonFile.close()