import subprocess
import os

subprocess.call(['git', 'pull'])
os.chdir('org.geppetto.frontend.jupyter')
subprocess.call(['git', 'pull'])
os.chdir('src/geppettoJupyter/geppetto/')
subprocess.call(['git', 'pull'])
