FROM jupyter/base-notebook:eb70bcf1a292
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
        vim \
        libpng-dev
USER $NB_USER

RUN conda update conda
RUN conda create --name snakes python=2
RUN wget --no-check-certificate http://www.neuron.yale.edu/ftp/neuron/versions/v7.4/nrn-7.4.tar.gz
RUN tar xzvf nrn-7.4.tar.gz
WORKDIR nrn-7.4
RUN /bin/bash -c "source activate snakes && ./configure --prefix `pwd` --without-iv --with-nrnpython"
RUN /bin/bash -c "source activate snakes && make --silent"
RUN /bin/bash -c "source activate snakes && make --silent install"
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn-7.4/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"

RUN /bin/bash -c "source activate snakes && pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension install --py --user jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

RUN mkdir /home/jovyan/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"
