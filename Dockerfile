FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update
RUN apt-get -y install unzip
RUN apt-get -y install git-core
USER jovyan
RUN wget https://github.com/MetaCell/NEURON-UI/archive/master.zip
RUN unzip master.zip
WORKDIR NEURON-UI-master
RUN conda install -c conda-forge ipywidgets
RUN python install.py
CMD ./NEURON-UI
