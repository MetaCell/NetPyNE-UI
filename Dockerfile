FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update

RUN apt-get install -y \
        locales \
        gcc \
        g++ \
        git-core \
        unzip \
        build-essential \
        libncurses-dev \
        libncurses5-dev libncursesw5-dev \
        python \
        libpython-dev \
        cython \
        autotools-dev \
        automake \
        libtool \
        bison \
        flex

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
