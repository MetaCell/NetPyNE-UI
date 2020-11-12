import subprocess
import json
import os, sys
from shutil import copyfile

branch = None

HERE = os.path.dirname(os.path.abspath(__file__))


# repos
JUPYTER = 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'
PYGEPPETTO = 'https://github.com/openworm/pygeppetto.git'
NETPYNE = 'https://github.com/Neurosim-lab/netpyne.git'
WORKSPACE = 'https://github.com/Neurosim-lab/netpyne_workspace'

ROOT_DIR = os.path.join(HERE, os.pardir)
DEPS_DIR = os.path.join(ROOT_DIR, 'src')

WEBAPP_DIR = os.path.join(ROOT_DIR, 'webapp')
JUPYTER_DIR = 'jupyter-geppetto'
NETPYNE_DIR = 'netpyne'

WORKSPACE_DIR = 'netpyne_workspace'

def cprint(string):
    print(f"\033[35;4m\U0001f560 {string} \033[0m \n")
    sys.stdout.flush()



def execute(cmd, cwd='.', *args, **kwargs):
    exit_code = subprocess.call(cmd, cwd=cwd, *args, **kwargs)
    if exit_code != 0:
        raise SystemExit('Error installing NetPyNE-UI')



# by default clones branch (which can be passed as a parameter python install.py branch test_branch)
# if branch doesnt exist clones the default_branch_or_tag
def clone(repository, folder=None, default_branch_or_tag=None, cwdp=DEPS_DIR, recursive=False):
    global branch
    print("Cloning " + repository)
    default_branch_or_tag = default_branch_or_tag or branch or 'master'
    folder = folder or os.path.basename(repository).replace('.git', '')
    if folder and os.path.exists(os.path.join(cwdp, folder)):
        print(f'Skipping clone of {repository}: folder exists')
    else:
        if recursive:
            subprocess.call(['git', 'clone', '--recursive', repository], cwd=cwdp)
        else:
            if folder:
                subprocess.call(['git', 'clone', repository, folder], cwd=cwdp)
            else:
                subprocess.call(['git', 'clone', repository], cwd=cwdp)
    checkout(folder, default_branch_or_tag, cwdp)


def checkout(folder, default_branch_or_tag, cwdp):
    currentPath = os.getcwd()
    print(currentPath)
    newPath = os.path.join(currentPath, cwdp, folder)
    print(newPath)
    os.chdir(newPath)
    python_git = subprocess.Popen("git branch -a", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    outstd, errstd = python_git.communicate()
    if branch and branch in str(outstd):
        print(f'Checking out {branch}')
        subprocess.call(['git', 'checkout', branch], cwd=newPath)
    else:
        print(f'Checking out {default_branch_or_tag}')
        subprocess.call(['git', 'checkout', default_branch_or_tag], cwd=newPath)
    os.chdir(currentPath)


def compile_mod():
    execute(['nrnivmodl', os.path.join(WORKSPACE_DIR, 'mod')], cwd=ROOT_DIR)


def main(branch=branch, skipNpm=False, skipTest=False, development=False):

    cprint("Installing requirements")
    

    if not os.path.exists(DEPS_DIR):
            os.mkdir(DEPS_DIR)
    clone(repository=NETPYNE, default_branch_or_tag='gui_cns')
    execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, NETPYNE_DIR))
    
    
    if development:
        os.chdir(DEPS_DIR)
        # install pygeppetto
        cprint("Installing pygeppetto")
        clone(repository=PYGEPPETTO,
              folder='pygeppetto',
              default_branch_or_tag='development'
              )
        execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, 'pygeppetto'))

        # install jupyter geppetto
        cprint("Installing org.geppetto.frontend.jupyter")
        clone(repository=JUPYTER,
              folder=JUPYTER_DIR,
              default_branch_or_tag='development'
              )

        execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, JUPYTER_DIR))
        execute(cmd=['pip', 'install', '-e', '.'], cwd=ROOT_DIR)
        
    else:
        # install requirements
        execute(cmd=['pip', 'install', '-r', 'requirements.txt'], cwd=ROOT_DIR)
        cprint("Installing UI python package...")
        execute(cmd=['pip', 'install', '.', '--no-deps'], cwd=ROOT_DIR)

    os.chdir(ROOT_DIR)
    cprint("Cloning workspace")
    clone(repository=WORKSPACE, default_branch_or_tag='gui_cns', cwdp=ROOT_DIR)
    cprint("Compiling workspace modules")
    compile_mod()

    if not skipNpm and os.path.exists(os.path.join(DEPS_DIR, JUPYTER_DIR)):
        cprint("Building Jupyter Geppetto extension...")
        execute(cmd=['npm', 'ci'], cwd=os.path.join(DEPS_DIR,JUPYTER_DIR, 'js'))
        execute(cmd=['npm', 'run', 'build-dev' if development else 'build'], cwd=os.path.join(DEPS_DIR, JUPYTER_DIR, 'js'))


    execute(cmd=['jupyter', 'nbextension', 'install', '--py', '--symlink', '--sys-prefix', 'jupyter_geppetto'])
    execute(cmd=['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'])
    execute(cmd=['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'widgetsnbextension'])
    execute(cmd=['jupyter', 'serverextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'])



    # set python console theme
    print("Installing notebook theme")
    from jupyter_core import paths
    config_dir = paths.jupyter_config_dir()
    print('Jupyter configuration dir is {}'.format(config_dir))
    css_path = os.path.join(config_dir, 'custom')
    if not os.path.exists(css_path):
        os.makedirs(css_path)
    execute(cmd=['cp', 'custom.css', css_path], cwd=HERE)


     # Enables Compression
    json_config_path = "{}/jupyter_notebook_config.json".format(config_dir)
    config = {}
    if os.path.exists(json_config_path):
        with open(json_config_path, 'r') as f:
            try:
                config = json.load(f)
            except Exception as e:
                print("Something went wrong reading the jupyter configuration file.\n{}"
                      "\nNew configuration will be created".format(str(e)))
                f.close()
    with open(json_config_path, 'w+') as f:
        try:
            _ = config['NotebookApp']
        except KeyError:
            config['NotebookApp'] = {'tornado_settings': {}}
        try:
            _ = config['NotebookApp']['tornado_settings']
        except KeyError:
            config['NotebookApp']['tornado_settings'] = {}
        config['NotebookApp']['tornado_settings']['gzip'] = True
        f.seek(0)
        json.dump(config, f, indent=4, sort_keys=True)
        f.truncate()

    # test
    if skipTest:
        cprint("Skipping tests")
    else:
            # install pytest if needed
        cprint("Installing test libraries")
        execute(cmd=['pip', 'install', '-r', 'requirements-test.txt'], cwd=ROOT_DIR)
        cprint("Testing NetPyNE")
        # execute("python -m unittest netpyne_ui.tests.netpyne_model_interpreter_test".split())


    cprint("Installing client packages")
    if not skipNpm:
        execute(cmd=['npm', 'install' if development else 'ci'], cwd=WEBAPP_DIR)
        execute(cmd=['npm', 'run', 'build-dev'], cwd=WEBAPP_DIR)



if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Install NetPyNE-UI and related dev libraries.')
    parser.add_argument('--branch', '-b', dest='branch', type=str, action="store", nargs='?',
                        help='the branch to checkout for all projects. '
                             'The branch is checked out if exists, otherwise the default for the project will be used')
    parser.add_argument('--npm-skip', dest='skipNpm', action='store_true', default=False,
                        help='Skips the long npm install and build processes')

    parser.add_argument('--no-test', dest='skipTest', action="store_true", default=False,
                        help='Skip python tests.')

    parser.add_argument('--dev', dest='development', action="store_true", default=False,
                        help='Install for development.')

    args = parser.parse_args([arg if arg != 'branch' else '-b' for arg in sys.argv[1:]])
    print(args)
    branch = args.branch

    skipNpm = args.skipNpm
    skipTest = args.skipTest
    development = args.development
    main(branch, skipNpm, skipTest, development)
