FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update


ARG NRN_VERSION="7.4"
ARG NRN_ARCH="x86_64"

RUN apt-get install -y \
        locales \
        wget \
        gcc \
        g++ \
        build-essential \
        libncurses-dev \
        python \
        libpython-dev \
        cython \
        git-core \
        unzip \
    && cd work \
    && wget http://www.neuron.yale.edu/ftp/neuron/versions/v${NRN_VERSION}/nrn-${NRN_VERSION}.tar.gz \
    && tar xvzf nrn-${NRN_VERSION}.tar.gz \
    && cd nrn-${NRN_VERSION} \
    && ./configure --prefix=`pwd` --without-iv --with-nrnpython=/usr/bin/python \
    && make \
    && make install \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 \
    && apt-get clean

WORKDIR /home/jovyan/work/nrn-7.4/src/nrnpython
RUN python setup.py install
RUN wget https://github.com/MetaCell/NEURON-UI/archive/development.zip
RUN unzip development.zip
WORKDIR NEURON-UI-development/utilities
RUN python install.py
CMD exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''
