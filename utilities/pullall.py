import subprocess    

subprocess.call(['git', 'pull'])
subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter')
subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/')
subprocess.call(['git', 'pull'], cwd='../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/geppetto-neuron/')

