import subprocess
import os

subprocess.call(['git', 'pull'])
subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter')
subprocess.call(['git', 'pull'], cwd='src/geppettoJupyter/geppetto/')
