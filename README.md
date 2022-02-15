[![Docker Automated buil](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/metacell/netpyne-ui/)
[![Build Status](https://travis-ci.org/MetaCell/NetPyNE-UI.svg?branch=master)](https://travis-ci.org/MetaCell/NetPyNE-UI)
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/tarelli/NetPyNE-UI%2Ftest?branch=master&key=eyJhbGciOiJIUzI1NiJ9.NWFkNzMyNDIzNjQ1YWMwMDAxMTJkN2Rl.-gUEkJxH6NCCIRgSIgEikVDte-Q0BsGZKEs4uahgpzs&type=cf-1)]( https%3A%2F%2Fg.codefresh.io%2Fpipelines%2Ftest%2Fbuilds%3FrepoOwner%3DMetaCell%26repoName%3DNetPyNE-UI%26serviceName%3DMetaCell%252FNetPyNE-UI%26filter%3Dtrigger%3Abuild~Build%3Bbranch%3Amaster%3Bpipeline%3A5e5bbecc6c98a1209fc7bca3~test)
<p align="center">
    <img src="https://github.com/MetaCell/NetPyNE-UI/raw/documentation/docs/netpyne.png" width="350px"/>
</p>

![Screenshot](https://github.com/MetaCell/NetPyNE-UI/raw/documentation/docs/netpyneui.png)

This repository hosts the User Interface for [NetPyNE](http://www.neurosimlab.org/netpyne/). NetPyNE is a python package
to facilitate the development, parallel simulation and analysis of biological neuronal networks using the NEURON
simulator.

## Install NetPyNE User Interface

Select one option to install the NetPyNE User Interface.

If you are familiar with NEURON and have already NEURON installed in your machine you can proceed using Pip. If you want
a container which comes with everything preinstalled including NEURON you can use the Docker image. Using docker you
will still be able to mount a local folder which will be your NetPyNE workspace. If you don't have docker installed in
your system and you have had troubles installing it you can opt for the Virtual Machine installation.

<p align="center">
    <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Pip-installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/pip_logo.png" alt="Pip" width="70px"/></a>
  <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Docker-installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/docker_logo.png" alt="Docker" width="100px"/></a>
  <a href="https://github.com/MetaCell/NetPyNE-UI/wiki/Virtual-Machine-Installation"><img src="https://raw.githubusercontent.com/MetaCell/NetPyNE-UI/master/docs/vbox_logo.png" alt="Virtual Box" width="80px"/></a>
</p>

## Install NetPyNE User Interface from sources (for developers)

### Python Dependencies

We recommend the use of a new python 3 virtual environment:

```bash
python3 -m venv npenv
source npenv/bin/activate
```

Or, with conda

```bash
conda create -n netpyne python=3.7
conda activate netpyne
```

### Run install script

```bash
python utilities/install.py
```

### Start application

```bash
./NetPyNE-UI
```

For debugging you can use `run.py` instead

```bash
python run.py
```

## Run NetPyNE User Interface in Docker

Ensure that you have Docker installed on your system.

Build the image

```bash
docker build -t netpyne-ui .
```

Run the image

```bash
docker run -p 8888:8888 netpyne-ui 
```

## End-to-end tests

End-to-end tests are located in `tests/deployment/frontend/e2e`. Ensure that the application is running in a blank
state, since end-to-end tests interact with the running application.

Install packages

```bash
cd tests/frontend/e2e
npm install
```

Start tests

```bash
npm run test
```

#### Containerized tests

You can also use `docker-compose` to run the tests. Ensure that you have Docker installed on your system.

Build the images

```bash
cd tests/deployment
sh build.sh
```

Run the tests

```bash
docker-compose up --abort-on-container-exit --exit-code-from netpyne-ui-e2e
```

## Additional Notes

NetPyNE-UI is being developed in collaboration with the [Neurosim Lab](http://neurosimlab.org/). See
the [Wiki](https://github.com/MetaCell/NetPyNE-UI/wiki) for more info!