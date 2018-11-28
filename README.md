[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/metacell/netpyne-ui/)

<p align="center">
    <img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/updated_documentation/docs/netpyne.png" width="350px"/>
</p>

![Screenshot](https://github.com/metacell/netpyne-ui/raw/updated_documentation/docs/netpyneui.png)

This repository hosts the User Interface for [NetPyNE](http://www.neurosimlab.org/netpyne/). NetPyNE is a python package to facilitate the development, parallel simulation and analysis of biological neuronal networks using the NEURON simulator.

## Install NetPyNE User Interface

Select one option to install the NetPyNE User Interface. 

If you are familiar with NEURON and have already NEURON installed in your machine you can proceed using Pip. If you want a container which comes with everything preinstalled including NEURON you can use the Docker image. Using docker you will still be able to mount a local folder which will be your NetPyNE workspace. If you don't have docker installed in your system and you have had troubles installing it you can opt for the Virtual Machine installation.

<p align="center">
    <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Pip-installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/pip_logo.png" alt="Pip" width="70px"/></a>
  <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Docker-installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/docker_logo.png" alt="Docker" width="100px"/></a>
  <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Virtual-Machine-Installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/vbox_logo.png" alt="Virtual Box" width="80px"/></a>
</p>

## Install NetPyNE User Interface from sources (for developers)
```
git clone https://github.com/MetaCell/NetPyNE-UI.git
cd utilities
python install.py
cd ..
./NetPyNE-UI
```
### To update sources:
```
python update.py
```

NetPyNE-UI is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/).
See the [Wiki](https://github.com/MetaCell/NetPyNE-UI/wiki) for more info!

