import subprocess
import pip
import os


subprocess.call(['git', 'clone', '--recursive', 'https://github.com/openworm/org.geppetto.frontend.jupyter.git'])
subprocess.call(['git', 'checkout', 'development'], cwd = 'org.geppetto.frontend.jupyter')
subprocess.call(['cp', '-r', '../geppetto-neuron', 'org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/'])

os.chdir('org.geppetto.frontend.jupyter')
pip.main(['sudo', 'pip', 'install', '.', '--install-option=\"--jupyter-notebook-path=\'http://localhost:8888/notebooks/jupyter-frontend/geppetto_demo.ipynb\'\"' ])
#subprocess.call(['sudo', 'pip', 'install', '.'], cwd = 'org.geppetto.frontend.jupyter')

#, '--install-option=\"--jupyter-notebook-path=\'http://localhost:8888/notebooks/jupyter-frontend/geppetto_demo.ipynb\'\"'
#http://stackoverflow.com/questions/4585929/how-to-use-cp-command-to-exclude-a-specific-directory