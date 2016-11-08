import subprocess

subprocess.call(['git', 'pull'])
subprocess.call(['git', 'checkout', 'integratingPlotWidget'], cwd='org.geppetto.frontend.jupyter')
subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter')
subprocess.call(['git', 'checkout', 'integratingPlot'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')
subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/')
subprocess.call(['git', 'checkout', 'integratingPlot'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')
subprocess.call(['git', 'pull'], cwd='org.geppetto.frontend.jupyter/src/geppettoJupyter/geppetto/src/main/webapp/extensions/geppetto-neuron/')
subprocess.call(['python','install.py','overwrite'])