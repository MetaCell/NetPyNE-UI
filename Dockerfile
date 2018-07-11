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
        python2.7 \
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
        python2.7-dev \
        xfonts-100dpi \ 
        libopenmpi-dev \
        python2.7-scipy \
        make \
        zlib1g-dev \
        unzip \
        vim \
        libpng-dev

# Install latest NEURON
RUN git clone --branch 7.6.1crxd https://github.com/adamjhn/nrn.git
WORKDIR nrn
RUN ./build.sh
RUN ./configure --without-x --with-nrnpython=python2 --without-paranrn --prefix="/home/jovyan/work/nrn/" --without-iv
RUN make --silent -j4
RUN make --silent install -j4

# Switch to non sudo, create a Python 2 virtual environment 
USER $NB_USER
# Commenting out the conda update things broke!
# RUN conda update conda
RUN conda create --name snakes python=2

# Install NEURON python
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"
# Install Bokeh
RUN /bin/bash -c "source activate snakes && conda install bokeh=0.12.7"

ARG INCUBATOR_VER=unknown
RUN /bin/bash -c "INCUBATOR_VER=${INCUBATOR_VER} source activate snakes && pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

WORKDIR /home/jovyan
RUN git clone https://github.com/Neurosim-lab/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"