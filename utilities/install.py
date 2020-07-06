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

def clone_repo(project, repo_name, **kwargs):
    normal = "\033[0;37;40m"
    stroke = "\033[1;32;40m\n"
    subprocess.run(["echo", f'{stroke}Cloning {repo_name} from {project}{stroke}'])
    url = f'https://github.com/{project}/{repo_name}.git'
    clone(url, **kwargs)

def compile_mod():
    subprocess.call(['nrnivmodl', 'netpyne_workspace/mod'])

def main(argv):
    global branch
    if(len(argv) > 0):
        if(argv[0] == 'branch'):
            branch = argv[1]

if __name__ == "__main__":
    main(sys.argv[1:])

os.chdir(os.getcwd()+"/../")

subprocess.call(['python3', '-m', 'pip', 'install', '-r', 'requirements.txt'])

clone_repo(project='Neurosim-lab',
           repo_name='netpyne',
           folder='netpyne',
           default_branch='gui_cns'
)
subprocess.call(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./netpyne/')

# clone_repo(project='openworm',
#            repo_name='geppetto-client',
#            folder='geppetto-client',
#            default_branch='v2.4.0',
#            cwdp='webapp/',
#            recursive=False,
# )

clone_repo(project='Neurosim-lab',
           repo_name='netpyne_workspace',
           folder='netpyne_workspace',
           default_branch="cns2020"
)
compile_mod()

subprocess.call(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./netpyne/')
branch = None
# Cloning Repos

clone_repo(project='openworm',
           repo_name='pygeppetto',
           folder='pygeppetto',
           default_branch='master'
)
subprocess.call(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./pygeppetto/')


clone_repo(project='openworm',
           repo_name='org.geppetto.frontend.jupyter',
           folder='org.geppetto.frontend.jupyter',
           default_branch='master'
)


with open('npm_frontend_jupyter_log', 'a') as stdout:
    subprocess.call(['npm', 'install'], cwd='./org.geppetto.frontend.jupyter/js', stdout=stdout)
subprocess.call(['npm', 'run', 'build-dev'], cwd='./org.geppetto.frontend.jupyter/js')


# Installing and building
print("NPM Install and build for Geppetto Frontend  ...")
with open('npm_frontend_log', 'a') as stdout:
    subprocess.call(['npm', 'install'], cwd='webapp/', stdout=stdout)
subprocess.call(['npm', 'run', 'build-dev-noTest'], cwd='webapp/')

print("Installing jupyter_geppetto python package ...")
subprocess.call(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./org.geppetto.frontend.jupyter')
print("Installing jupyter_geppetto Jupyter Extension ...")
subprocess.call(['jupyter', 'nbextension', 'install', '--py', '--symlink', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'widgetsnbextension'], cwd='./org.geppetto.frontend.jupyter')
subprocess.call(['jupyter', 'serverextension', 'enable', '--sys-prefix', '--py', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')

print("Installing NetPyNE UI python package ...")
subprocess.call(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='.')

# set python console theme
subprocess.call(['jt', '-t', 'monokai'])