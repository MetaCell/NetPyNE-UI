[![Build Status](https://travis-ci.org/MetaCell/NetPyNE-UI.svg?branch=master)](https://travis-ci.org/MetaCell/NetPyNE-UI)
[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/metacell/netpyne-ui/)

# NetPyNE-UI

This repository hosts the user interface for [NetPyNE](http://www.neurosimlab.org/netpyne/).


![Screenshot](https://github.com/metacell/netpyne-ui/raw/master/netpyneui.png)

## Install using Docker (self-contained, the simplest)

### Prerequisites
In order to Install NetPyNE-UI with docker we need to install docker itself before to proceed.
Below you can find the link with the procedure to follow depending on the OS you are using.

#### For Windows users
To install docker on Windows download docker-toolbox from the link below and follow the onscreen instructions.
[Windows](https://docs.docker.com/toolbox/toolbox_install_windows/)

Few notes regarding the windows installation:
- During the step "Select Additional Tasks", select all the checkboxes as the image here.
![windows_docker1](https://github.com/metacell/netpyne-ui/raw/master/docker_windows1.png).


#### For Linux users
To install docker on Linux follow the link below with the instructions.
[Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Few notes about the linux installation:
- Once the installation has been completed, to run docker from your user you need to add it to the docker group.
To do this you can run the command below
```
sudo usermod -a -G docker $USERNAME
```
Once the command has been executed you need to open a new terminal or login in your environment again in order to make the change effective.

#### For MacOS users
To install docker on Mac OS follow the link below with the instructions.
[MacOS](https://docs.docker.com/docker-for-mac/install/)

### Docker is installed, and now?
Once you completede the docker installation you have 2 ways to proceed further.
You can use the kitematic GUI and do everything from a nice interface, however if you are fine working with the console you can skip the kitematic section and jump directly to the section [Install NUERON-UI using Docker from command line] .

### Install NEURON-UI using Docker graphical interface (Kitematic)
Retrieve the right version of Kitematic for your OS from [here](https://github.com/docker/kitematic/releases).

Open [Kitematic](https://kitematic.com/): search for netpyne-ui and create the container.

![Image](https://github.com/metacell/netpyne-ui/raw/master/docs/kitematicImage.png)

Start the container and click on Web preview to launch it. No need to ever use the command line, enjoy!

![Kitematic](https://github.com/metacell/netpyne-ui/raw/master/docs/kitematicRun.png)

### Install NUERON-UI using Docker from command line 
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

One note for Windows users - once the docker image has been pulled and the NetPyNE-UI container created, you can reach your instance of NetPyNE-UI by default at the address 192.168.99.100:8888, if something has been changed in the settings this will be visible when the docker terminal will be open, as per image below.

![windows_docker2](https://github.com/metacell/netpyne-ui/raw/master/docker_windows2.png)

## Install using pip
```
Coming soon
```

## Install from sources (for developers)
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

