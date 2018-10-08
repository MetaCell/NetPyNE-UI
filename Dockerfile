FROM jupyter/base-notebook:eb70bcf1a292
USER root

RUN apt-get -qq update
RUN apt-get install -y \
        locales \
        wget \
        gcc \
        g++ \
        build-essential \
        libncurses-dev \
        libpython-dev \
        cython \
        libx11-dev \
        git \
        bison \
        flex \
        automake \ 
        libtool \ 
        libxext-dev \
        libncurses-dev \
        xfonts-100dpi \ 
        libopenmpi-dev \
        make \
        zlib1g-dev \
        unzip \
        vim \
        libpng-dev

# Switch to non sudo, create a Python 3 virtual environment 
USER $NB_USER
RUN conda create --name snakes python=3.7

# Install latest iv and NEURON
RUN git clone --branch 7.6.2 https://github.com/neuronsimulator/nrn
WORKDIR nrn
RUN ./build.sh
# Activate conda to configure nrn with the right python version
RUN /bin/bash -c "source activate snakes && ./configure --without-x --with-nrnpython=python3 --without-paranrn --prefix='/home/jovyan/work/nrn/' --without-iv"
RUN make --silent -j4
RUN make --silent install -j4

# Install NEURON python
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"

ARG INCUBATOR_VER=unknown
RUN /bin/bash -c "INCUBATOR_VER=${INCUBATOR_VER} source activate snakes && pip install netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

WORKDIR /home/jovyan
RUN git clone --branch CNS18 https://github.com/Neurosim-lab/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"
