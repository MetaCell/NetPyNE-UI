[![Build Status](https://travis-ci.org/MetaCell/NetPyNE-UI.svg?branch=master)](https://travis-ci.org/MetaCell/NetPyNE-UI)
[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/metacell/netpyne-ui/)

# NetPyNE-UI

This repository hosts the user interface for [NetPyNE](http://www.neurosimlab.org/netpyne/).


![Screenshot](https://github.com/metacell/netpyne-ui/raw/master/netpyneui.png)

#### Install using Docker (self-contained, the simplest)

##### Using Kitematic
Open [Kitematic](https://kitematic.com/): search for netpyne-ui and create the container.

![Image](https://github.com/tarelli/bucket/raw/master//neuronuiImage.png)

Start the container and click on Web preview to launch it. No need to ever use the command line, enjoy!

![Kitematic](https://github.com/tarelli/bucket/raw/master//kitematic.png)

##### From command line 
```
docker pull metacell/netpyne-ui
docker run -it -p 8888:8888 metacell/netpyne-ui
```

Open your browser and connect to http://localhost:8888/geppetto.

Alternatively you can execute the following command: 
```
docker run -it -v ~/folder_in_your_computer:/home/jovyan/netpyne_workspace -p 8888:8888 metacell/netpyne-ui
```
Any file inside the folder_in_your_computer directory will be copied into the docker at netpyne_workspace folder and the other way around. Logs and Jupyter notebook will be located here and therefore accesible from the user machine. This mechanism can be used as well to import and export models.

#### Install using pip
```
pip install netpyne_ui
jupyter nbextension enable --py jupyter_geppetto
NetPyNE-UI
```

#### Install from sources (for developers and for using your own NetPyNE models)
```
git clone https://github.com/MetaCell/NetPyNE-UI.git
cd utilities
python install.py
cd ..
./NetPyNE-UI
```
##### To update sources:
```
python update.py
```

NetPyNE-UI is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/).
See the [Wiki](https://github.com/MetaCell/NetPyNE-UI/wiki) for more info!
