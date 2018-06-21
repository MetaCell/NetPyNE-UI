import setuptools
from setuptools.command.install import install
import subprocess
import json
import os
from shutil import copyfile

# Cloning Repos
print("Cloning PyGeppetto...")
subprocess.call(['git', 'clone', '-b', 'v0.3.9-alpha', 'https://github.com/openworm/pygeppetto.git'], cwd='../')
subprocess.call(['pip', 'install', '-e', '.'], cwd='../pygeppetto/')

print("Cloning NetPyNE...")
subprocess.call(['git', 'clone', '-b', 'v0.7.8_UI0.2Release', 'https://github.com/Neurosim-lab/netpyne.git'], cwd='../')
subprocess.call(['pip', 'install', '-e', '.'], cwd='../netpyne/')

print("Cloning Geppetto Jupyter (Python package)...")
subprocess.call(['git', 'clone', '--recursive', '-b', 'v0.4.0-M1', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'], cwd='../')

print("Cloning Geppetto Frontend")
subprocess.call(['git', 'checkout', 'v0.4.0-M1'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/')

print("Cloning Geppetto NetPyNE Configuration ...")
subprocess.call(['git', 'clone', 'https://github.com/MetaCell/geppetto-netpyne.git'],
                cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/')

subprocess.call(['git', 'checkout', '0.2M3'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-netpyne/')

print("Enabling Geppetto NetPyNE Extension ...")
geppetto_configuration = os.path.join(os.path.dirname(__file__), 'GeppettoConfiguration.json')
copyfile(geppetto_configuration, '../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/GeppettoConfiguration.json')

# Installing and building
print("NPM Install and build for Geppetto Frontend  ...")
subprocess.call(['npm', 'install'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/')
subprocess.call(['npm', 'run', 'build-dev-noTest'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/')

print("Installing jupyter_geppetto python package ...")
subprocess.call(['pip', 'install', '-e', '.'], cwd='../org.geppetto.frontend.jupyter')
print("Installing jupyter_geppetto Jupyter Extension ...")
subprocess.call(['jupyter', 'nbextension', 'install', '--py', '--symlink', '--user', 'jupyter_geppetto'], cwd='../org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--user', 'jupyter_geppetto'], cwd='../org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', 'widgetsnbextension'], cwd='../org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'serverextension', 'enable', '--py', 'jupyter_geppetto'], cwd='../org.geppetto.frontend.jupyter')

print("Installing NetPyNE UI python package ...")
subprocess.call(['pip', 'install', '-e', '.'], cwd='..')

