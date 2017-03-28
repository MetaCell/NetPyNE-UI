FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update
RUN apt-get -y install unzip
RUN apt-get -y install git-core
USER jovyan
RUN wget https://github.com/MetaCell/NEURON-UI/archive/installationImprovements.zip
RUN unzip installationImprovements.zip
WORKDIR NEURON-UI-installationImprovements
RUN python install.py
CMD exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''
