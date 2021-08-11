import subprocess
import json
import os
import sys
import logging

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

WORKSPACE_DIR = 'workspace'

os.environ['JUPYTER_CONFIG_DIR'] = os.path.join(ROOT_DIR, '.jupyter-config')


def cprint(string):
    print(f"\033[35;4m\U0001f560 {string} \033[0m \n")
    sys.stdout.flush()


def execute(cmd, cwd='.', *args, **kwargs):
    exit_code = subprocess.call(cmd, cwd=cwd, *args, **kwargs)
    if exit_code != 0:
        raise SystemExit(f'Error installing NetPyNE-UI - Command {cmd} failed with code {exit_code} in directory {cwd}')


# by default clones branch (which can be passed as a parameter python install.py branch test_branch)
# if branch doesnt exist clones the default_branch_or_tag
def clone(repository, folder=None, branch_or_tag=None, cwdp=DEPS_DIR, recursive=False):
    print("Cloning " + repository)
    branch_or_tag = branch_or_tag or 'master'
    folder = folder or os.path.basename(repository).replace('.git', '')
    if folder and os.path.exists(os.path.join(cwdp, folder)):
        print(f'Skipping clone of {repository}: folder exists')
    else:
        exit_code = 0
        if recursive:
            exit_code = subprocess.call(['git', 'clone', '--recursive', repository], cwd=cwdp)
        else:
            if folder:
                exit_code = subprocess.call(['git', 'clone', repository, folder], cwd=cwdp)
            else:
                exit_code = subprocess.call(['git', 'clone', repository], cwd=cwdp)

        if exit_code != 0:
            raise SystemExit(f'Failed to clone repository {repository} into {folder}')
        
    if not os.path.exists(os.path.join(cwdp, folder, '.git')):
        print(f'Skipping checkout of {repository}: folder is not a git repository')
        return

    if branch_or_tag:
        checkout(folder, branch_or_tag, cwdp)


def checkout(folder, branch_or_tag, cwdp):
    currentPath = os.getcwd()
    newPath = os.path.join(currentPath, cwdp, folder)

    print(f'Checking out {branch_or_tag}')
    try:
        subprocess.call(['git', 'checkout', branch_or_tag], cwd=newPath)
    except Exception as e:
        logging.error('Cannot checkout branch or tag %s on %s', branch_or_tag, folder, exc_info=True)


def compile_mod():
    execute(['nrnivmodl', os.path.join(WORKSPACE_DIR, 'mod')], cwd=ROOT_DIR)


def main(netpyne_branch, workspace_branch, pygeppetto_branch=None, jupyter_geppetto_branch=None, skipNpm=False,
         skipTest=False, development=False):
    cprint("Installing requirements")
    print(workspace_branch)
    execute(cmd=['pip', 'install', '-r', 'requirements.txt'], cwd=ROOT_DIR)

    if not os.path.exists(DEPS_DIR):
        os.mkdir(DEPS_DIR)


    if development:
        os.chdir(DEPS_DIR)

        cprint("Installing netpyne")
        clone(repository=NETPYNE, branch_or_tag=netpyne_branch)
        execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, NETPYNE_DIR))

        # install pygeppetto
        cprint("Installing pygeppetto")
        clone(repository=PYGEPPETTO,
              folder='pygeppetto',
              branch_or_tag=pygeppetto_branch
              )
        execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, 'pygeppetto'))

        # install jupyter geppetto
        cprint("Installing org.geppetto.frontend.jupyter")
        clone(repository=JUPYTER,
              folder=JUPYTER_DIR,
              branch_or_tag=jupyter_geppetto_branch
              )

        execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, JUPYTER_DIR))
        execute(cmd=['pip', 'install', '-e', '.'], cwd=ROOT_DIR)

    else:

        if netpyne_branch and netpyne_branch != 'master':
          cprint("Installing netpyne")
          clone(repository=NETPYNE, branch_or_tag=netpyne_branch)
          execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, NETPYNE_DIR))
        # install requirements
        if netpyne_branch and netpyne_branch != 'master':
          cprint("Installing netpyne")
          clone(repository=NETPYNE, branch_or_tag=netpyne_branch)
          execute(cmd=['pip', 'install', '-e', '.'], cwd=os.path.join(DEPS_DIR, NETPYNE_DIR))
        cprint("Installing UI python package...")
        execute(cmd=['pip', 'install', '-e', '.', '--no-deps'], cwd=ROOT_DIR)

    os.chdir(ROOT_DIR)
    if workspace_branch:
      cprint("Cloning workspace")
      clone(repository=WORKSPACE, branch_or_tag=workspace_branch, folder=WORKSPACE_DIR, cwdp=ROOT_DIR)
      cprint("Compiling workspace modules")
      compile_mod()

    if not skipNpm and os.path.exists(os.path.join(DEPS_DIR, JUPYTER_DIR)):
        cprint("Building Jupyter Geppetto extension...")
        execute(cmd=['npm', 'ci'], cwd=os.path.join(DEPS_DIR, JUPYTER_DIR, 'js'))
        execute(cmd=['npm', 'run', 'build-dev' if development else 'build'],
                cwd=os.path.join(DEPS_DIR, JUPYTER_DIR, 'js'))

    execute(cmd=['jupyter', 'nbextension', 'install', '--py', '--symlink', '--sys-prefix', 'jupyter_geppetto'])
    execute(cmd=['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'])
    execute(cmd=['jupyter', 'nbextension', 'enable', '--py', '--sys-prefix', 'widgetsnbextension'])
    execute(cmd=['jupyter', 'serverextension', 'enable', '--py', '--sys-prefix', 'jupyter_geppetto'])

    # Set python console theme
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

    parser.add_argument('--npm-skip', dest='skipNpm', action='store_true', default=False,
                        help='Skips the long npm install and build processes')

    parser.add_argument('--no-test', dest='skipTest', action="store_true", default=False,
                        help='Skip python tests.')

    parser.add_argument('--dev', dest='development', action="store_true", default=False,
                        help='Install for development.')

    parser.add_argument('--netpyne', '-vn', dest='netpyne_version', action="store",
                        default=os.getenv('NETPYNE_VERSION', 'development'),
                        help='Specify NetPyNE library branch or tag.')

    parser.add_argument('--workspace', '-vw', dest='workspace_version', action="store",
                        default=os.getenv('WORKSPACE_VERSION', 'master'),
                        help='Specify workspace branch or tag.')

    parser.add_argument('--pygeppetto', '-vp', dest='pygeppetto_version', action="store",
                        default=os.getenv('PYGEPPETTO_VERSION', 'development'),
                        help='Specify Pygeppetto library branch or tag (only for dev build).')

    parser.add_argument('--jupyter_geppetto', '-vj', dest='jupyter_geppetto_version', action="store",
                        default=os.getenv('JUPYTER_GEPPETTO_VERSION', 'development'),
                        help='Specify Jupyter Geppetto library branch or tag (only for dev build).')

    args = parser.parse_args(sys.argv[1:])
    print('Install arguments:\n', args)

    main(skipNpm=args.skipNpm, skipTest=args.skipTest, development=args.development,
         netpyne_branch=args.netpyne_version,
         workspace_branch=args.workspace_version,
         pygeppetto_branch=args.pygeppetto_version,
         jupyter_geppetto_branch=args.jupyter_geppetto_version
         )
