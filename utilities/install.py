import os
import sys
import site
import json
import setuptools
import subprocess

from setuptools.command.install import install

def checkDependencies():
    '''checksifnpmisinstalled'''
    shell = (sys.platform == 'win32')
    try:
        subprocess.check_call(['npm', '--version'], shell=shell)
        subprocess.check_call(['node', '--version'], shell=shell)
    except:
        print('ATENTION: -> -nodejs- -npm- not found... Please visit:')
        print('https://nodejs.org')
        return False

    try:
        subprocess.check_call(['git', '--version'], shell=shell)
        return True
    except:
        print('ATENTION: -> "git" not found... You ca get it by:')
        print('sudo apt upgrade')
        print('sudo apt install git')
        return False


if checkDependencies():

    # Update pip
    subprocess.call(["pip", "install", "--upgrade", "pip", "--user"])

    # Find current directory
    here = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    here = os.path.dirname(here)

    # Install dependency - editable mode
    print("Cloning PyGeppetto...")
    http = 'git+https://github.com/openworm/pygeppetto.git@development#egg=pygeppetto'
    subprocess.call(['pip', 'install', '-e', http, '--src', os.path.join(here), "--user"])

    # Install dependency - editable mode
    print("Cloning NetPyNE...")
    http = 'git+https://github.com/Neurosim-lab/netpyne.git@metadata#egg=netpyne'
    subprocess.call(['pip', 'install', '-e', http, '--src', os.path.join(here), "--user"])

    # Clone dependency
    print("Cloning GeppettoJupyter (Python package)...")
    http = 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'
    subprocess.call(['git', 'clone', '--recursive', '-b', 'development', http], cwd=here)

    # CheckOut branch
    cwd = os.path.join(here, "org.geppetto.frontend.jupyter", "src", "jupyter_geppetto", "geppetto")
    subprocess.call(['git', 'checkout', 'development'], cwd=cwd)

    # Clone dependency
    print("Cloning Geppetto NetPyNe Configuration...")
    http = 'https://github.com/MetaCell/geppetto-netpyne.git'
    cwd = os.path.join(cwd, "src", "main", "webapp", "extensions")
    subprocess.call(['git', 'clone', http], cwd=cwd)

    # checkOut branch
    subprocess.call(['git', 'checkout', 'development'], cwd=os.path.join(cwd, "geppetto-netpyne"))

    ## Enable extension
    #print("Enabling Geppetto NetPyNe Extension...")
    #with open(os.path.join(cwd, 'extensionsConfiguration.json'), "w+") as jsonFile:
    #    jsonFile.write(json.dumps({"geppetto-NetPyNe/ComponentsInitialization" : True}))

    # install npm resources
    cwd = os.path.join(here, "org.geppetto.frontend.jupyter", "src", "jupyter_geppetto", "geppetto", "src", "main", "webapp")
    print("NPM Install and build for Geppetto Frontend...")
    subprocess.call(['npm', 'install'], cwd=cwd)
    subprocess.call(['npm', 'run', 'build-dev-noTest'], cwd=cwd)

    # Install dependency - editable mode
    print("Installing jupyter_geppetto python package...")
    cwd = os.path.join(here, "org.geppetto.frontend.jupyter")
    subprocess.call(["pip", "install", "-e", ".", "--user"], cwd=cwd)

    # install extensions
    print("Installing jupyter_geppetto Jupyter Extension...")
    subprocess.call(['jupyter', 'nbextension', 'install', '--py', '--symlink', '--user', 'jupyter_geppetto'], cwd=cwd)
    subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--user', 'jupyter_geppetto'], cwd=cwd)
    subprocess.call(['jupyter', 'nbextension', 'enable', '--py', 'widgetsnbextension'], cwd=cwd)
    subprocess.call(['jupyter', 'serverextension', 'enable', '--py', 'jupyter_geppetto'], cwd=cwd)
	
    # Install main distribution - editable mode
    print("Installing netpyne_ui python package...")
    subprocess.call(['pip', 'install', '-e', '.', "--user"], cwd=here)

