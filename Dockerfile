FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update
RUN apt-get -y install unzip
RUN apt-get -y install git-core
RUN apt-get -y install g++
RUN apt-get -y install libncurses5-dev libncursesw5-dev
RUN apt-get -y install make
USER jovyan
RUN wget https://github.com/nrnhines/nrn/archive/master.zip
RUN unzip master.zip
WORKDIR nrn-master
RUN ./build.sh
RUN ./configure --prefix `pwd` --without-iv --with-nrnpython
RUN make
RUN make install
WORKDIR src/nrnpython
RUN python setup.py install
RUN wget https://github.com/MetaCell/NEURON-UI/archive/development.zip
RUN unzip development.zip
WORKDIR NEURON-UI-development/utilities
RUN python install.py
CMD exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''
