[![Build Status](https://travis-ci.org/MetaCell/NetPyNE-UI.svg?branch=master)](https://travis-ci.org/MetaCell/NetPyNE-UI)
[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/metacell/netpyne-ui/)

# NetPyNE-UI

This repository hosts the user interface for [NetPyNE](http://www.neurosimlab.org/netpyne/).


![Screenshot](https://github.com/metacell/netpyne-ui/raw/master/netpyneui.png)

#### Install using Docker (self-contained, the simplest)

##### Using Kitematic
Open [Kitematic](https://kitematic.com/): search for netpyne-ui and create the container.

![Image](https://github.com/metacell/netpyne-ui/raw/master/docs/netpyneuiImage.png)

Start the container and click on Web preview to launch it. No need to ever use the command line, enjoy!

![Kitematic](https://github.com/metacell/netpyne-ui/raw/master/docs/kitematic.png)

##### From command line 
To pull the docker container:
```
docker pull metacell/netpyne-ui
```
To run the docker container:
```
docker run -it -p 8888:8888 metacell/netpyne-ui
```
Or alternatively, if you want a local folder outside of the Docker container to host the NetPyNE-UI workspace (where you can import models from, export models to, inspect the log and the jupyter notebook) you can execute the following command: 
```
docker run -it -v ~/folder_in_your_computer:/home/jovyan/netpyne_workspace -p 8888:8888 metacell/netpyne-ui
```
This will mount your local folder `folder_in_your_computer` as a volume inside the container and will be used to host the NetPyNE-UI workspace (`/home/jovyan/netpyne_workspace` inside the container). 

Once you run your container you can open your browser and connect to http://localhost:8888/geppetto.

#### Install using pip
```
Coming soon
```

#### Install from sources (for developers)
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
