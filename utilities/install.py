import setuptools
from setuptools.command.install import install
import subprocess
import json
import os, sys
from shutil import copyfile

branch = None

#by default clones branch (which can be passed as a parameter python install.py branch test_branch)
#if branch doesnt exist clones the default_branch
def clone(repository, folder, default_branch, cwdp='', recursive = False, destination_folder = None):
    global branch
    print("Cloning "+repository)
    if recursive:
        subprocess.call(['git', 'clone', '--recursive', repository], cwd='./'+cwdp)
    else:
        if destination_folder:
            subprocess.call(['git', 'clone', repository, destination_folder], cwd='./'+cwdp)
        else:
            subprocess.call(['git', 'clone', repository], cwd='./'+cwdp)
    checkout(folder, default_branch, cwdp)

def checkout(folder, default_branch, cwdp):
    currentPath = os.getcwd()
    print(currentPath)
    newPath = currentPath+"/"+cwdp+folder
    print(newPath)
    os.chdir(newPath)
    python_git = subprocess.Popen("git branch -a && git tag", shell=True, stdout=subprocess.PIPE,
                                  stderr=subprocess.PIPE)
    outstd,errstd=python_git.communicate()
    if branch and branch in str(outstd) and branch != 'development': # don't ckeckout development for netpyne
        subprocess.call(['git', 'checkout', branch], cwd='./')
    else:
        subprocess.call(['git', 'checkout', default_branch], cwd='./')
    os.chdir(currentPath)

def main(argv):
    global branch
    if(len(argv) > 0):
        if(argv[0] == 'branch'):
            branch = argv[1]

if __name__ == "__main__":
    main(sys.argv[1:])

os.chdir(os.getcwd()+"/../")


clone('https://github.com/Neurosim-lab/netpyne.git','netpyne','ui')
subprocess.call(['pip', 'install', '-e', '.'], cwd='./netpyne/')



# We can't clone org.geppetto.frontend as a regular submodule because Travis doesn't have .gitmodules in the zip
# subprocess.call(['git', 'submodule', 'update', '--init'], cwd='./')
clone('https://github.com/openworm/org.geppetto.frontend.git','geppetto','v0.4.2-alpha','netpyne_ui/', False, 'geppetto')
clone('https://github.com/MetaCell/geppetto-netpyne.git','geppetto-netpyne','development','netpyne_ui/geppetto/src/main/webapp/extensions/')

branch = None
# Cloning Repos
clone('https://github.com/openworm/pygeppetto.git','pygeppetto','development')
subprocess.call(['pip', 'install', '-e', '.'], cwd='./pygeppetto/')
clone('https://github.com/openworm/org.geppetto.frontend.jupyter.git','org.geppetto.frontend.jupyter','development')
with open('npm_frontend_jupyter_log', 'a') as stdout:
    subprocess.call(['npm', 'install'], cwd='./org.geppetto.frontend.jupyter/js', stdout=stdout)
subprocess.call(['npm', 'run', 'build-dev'], cwd='./org.geppetto.frontend.jupyter/js')

print("Enabling Geppetto NetPyNE Extension ...")
geppetto_configuration = os.path.join(os.path.dirname(__file__), './utilities/GeppettoConfiguration.copyme.json')
copyfile(geppetto_configuration, './netpyne_ui/geppetto/src/main/webapp/GeppettoConfiguration.json')

# Installing and building
print("NPM Install and build for Geppetto Frontend  ...")
with open('npm_frontend_log', 'a') as stdout:
    subprocess.call(['npm', 'install'], cwd='./netpyne_ui/geppetto/src/main/webapp/', stdout=stdout)
subprocess.call(['npm', 'run', 'build-dev-noTest'], cwd='./netpyne_ui/geppetto/src/main/webapp/')

print("Installing jupyter_geppetto python package ...")
subprocess.call(['pip', 'install', '-e', '.'], cwd='./org.geppetto.frontend.jupyter')
print("Installing jupyter_geppetto Jupyter Extension ...")
subprocess.call(['jupyter', 'nbextension', 'install', '--py', '--symlink', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'widgetsnbextension'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'serverextension', 'enable', '--sys-prefix', '--py', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')

print("Installing NetPyNE UI python package ...")
subprocess.call(['pip', 'install', '-e', '.'], cwd='.')