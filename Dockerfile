FROM jupyter/base-notebook:eb70bcf1a292
USER root

ARG neuronuiBranch=development
ENV neuronuiBranch=${neuronuiBranch}
RUN echo "$neuronuiBranch";

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
        unzip 
USER $NB_USER

RUN conda create --name snakes python=2
RUN wget http://www.neuron.yale.edu/ftp/neuron/versions/v7.4/nrn-7.4.tar.gz
RUN tar xzvf nrn-7.4.tar.gz
WORKDIR nrn-7.4
RUN /bin/bash -c "source activate snakes && ./configure --prefix `pwd` --without-iv --with-nrnpython"
RUN /bin/bash -c "source activate snakes && make"
RUN /bin/bash -c "source activate snakes && make install"
WORKDIR src/nrnpython
RUN /bin/bash -c "source activate snakes && python setup.py install"
RUN wget https://github.com/MetaCell/NEURON-UI/archive/$frontendBranch.zip
RUN unzip $frontendBranch.zip
WORKDIR NEURON-UI-$frontendBranch/utilities
RUN /bin/bash -c "source activate snakes && python --version"
RUN /bin/bash -c "source activate snakes && exec python install.py"
RUN cd ../neuron_ui/tests && /bin/bash -c "source activate snakes && python -m unittest netpyne_model_interpreter_test"
CMD exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''
