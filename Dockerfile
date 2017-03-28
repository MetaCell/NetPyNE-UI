FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update
RUN apt-get -y install unzip
RUN apt-get -y install git-core
USER jovyan
RUN wget https://github.com/MetaCell/NEURON-UI/archive/{sourceref}.zip
RUN unzip {sourceref}.zip
WORKDIR NEURON-UI-{sourceref}
RUN python install.py
CMD ./NEURON-UI
