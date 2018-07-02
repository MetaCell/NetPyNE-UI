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
        python \
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
        python3-dev \
        xfonts-100dpi \ 
        cython3 \ 
        libopenmpi-dev \
        python3-scipy \
        make \
        zlib1g-dev \
        unzip \
        vim \
        libpng-dev

# Install latest iv and NEURON
RUN git clone http://github.com/neuronsimulator/iv
RUN git clone http://github.com/neuronsimulator/nrn
WORKDIR iv
RUN ./build.sh
RUN ./configure
RUN make --silent -j4
RUN make --silent install -j4
WORKDIR ../nrn
RUN ./build.sh
RUN ./configure --with-nrnpython=python2 --with-paranrn
RUN make --silent -j4
RUN make --silent install -j4

# Switch to non sudo, create a Python 2 virtual environment 
USER $NB_USER
RUN conda update conda
RUN conda create --name snakes python=2

# Install NEURON python
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"

ARG INCUBATOR_VER=unknown
RUN /bin/bash -c "INCUBATOR_VER=${INCUBATOR_VER} source activate snakes && pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

RUN mkdir /home/jovyan/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"