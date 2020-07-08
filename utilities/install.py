import setuptools
from setuptools.command.install import install
import subprocess
import json
import os, sys
from shutil import copyfile

branch = None

HERE = os.path.dirname(os.path.abspath(__file__))


def execute(cmd, cwd='.'):
    exit_code = subprocess.call(cmd, cwd=cwd)
    if exit_code != 0:
        raise SystemExit('Error installing NetPyNE-UI')

#by default clones branch (which can be passed as a parameter python install.py branch test_branch)
#if branch doesnt exist clones the default_branch
def clone(repository, folder, default_branch, cwdp='', recursive = False, destination_folder = None):
    global branch
    print("Cloning "+repository)
    if recursive:
        execute(['git', 'clone', '--recursive', repository], cwd='./'+cwdp)
    else:
        if destination_folder:
            execute(['git', 'clone', repository, destination_folder], cwd='./'+cwdp)
        else:
            execute(['git', 'clone', repository], cwd='./'+cwdp)
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
        execute(['git', 'checkout', branch], cwd='./')
    else:
        execute(['git', 'checkout', default_branch], cwd='./')
    os.chdir(currentPath)

def clone_repo(project, repo_name, **kwargs):
    normal = "\033[0;37;40m"
    stroke = "\033[1;32;40m\n"
    subprocess.run(["echo", f'{stroke}Cloning {repo_name} from {project}{stroke}'])
    url = f'https://github.com/{project}/{repo_name}.git'
    clone(url, **kwargs)

def compile_mod():
    execute(['nrnivmodl', 'netpyne_workspace/mod'])

def execute(cmd, cwd='.'):
    exit_code = execute(cmd, cwd=cwd)
    if exit_code != 0:
        raise SystemExit('Error installing NetPyNe-UI')

def main(argv):
    global branch
    if(len(argv) > 0):
        if(argv[0] == 'branch'):
            branch = argv[1]

if __name__ == "__main__":
    main(sys.argv[1:])

os.chdir(os.getcwd()+"/../")

execute(['python3', '-m', 'pip', 'install', '-r', 'requirements.txt'])

clone_repo(project='Neurosim-lab',
           repo_name='netpyne',
           folder='netpyne',
           default_branch='gui_cns'
)
execute(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./netpyne/')

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

execute(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./netpyne/')
branch = None
# Cloning Repos

clone_repo(project='openworm',
           repo_name='pygeppetto',
           folder='pygeppetto',
           default_branch='master'
)
execute(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./pygeppetto/')


clone_repo(project='openworm',
           repo_name='org.geppetto.frontend.jupyter',
           folder='org.geppetto.frontend.jupyter',
           default_branch='master'
)


with open('npm_frontend_jupyter_log', 'a') as stdout:
    execute(['npm', 'install'], cwd='./org.geppetto.frontend.jupyter/js', stdout=stdout)
execute(['npm', 'run', 'build-dev'], cwd='./org.geppetto.frontend.jupyter/js')


# Installing and building
print("NPM Install and build for Geppetto Frontend  ...")
with open('npm_frontend_log', 'a') as stdout:
    execute(['npm', 'install'], cwd='webapp/', stdout=stdout)
execute(['npm', 'run', 'build-dev-noTest'], cwd='webapp/')

print("Installing jupyter_geppetto python package ...")
execute(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='./org.geppetto.frontend.jupyter')
print("Installing jupyter_geppetto Jupyter Extension ...")
execute(['jupyter', 'nbextension', 'install', '--py', '--symlink', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
execute(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')
execute(['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'widgetsnbextension'], cwd='./org.geppetto.frontend.jupyter')
execute(['jupyter', 'serverextension', 'enable', '--sys-prefix', '--py', 'jupyter_geppetto'], cwd='./org.geppetto.frontend.jupyter')

print("Installing NetPyNE UI python package ...")
execute(['python3', '-m', 'pip', 'install', '-e', '.'], cwd='.')

# set python console theme
execute(['jt', '-t', 'monokai'])

print("Installing notebook theme")
from jupyter_core import paths
config_dir = paths.jupyter_config_dir()
print('Jupyter configuration dir is {}'.format(config_dir))
css_path = os.path.join(config_dir, 'custom')
if not os.path.exists(css_path):
    os.makedirs(css_path)
execute(cmd=['cp', 'custom.css', css_path], cwd=HERE)
