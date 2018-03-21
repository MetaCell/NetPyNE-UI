FROM jupyter/base-notebook:eb70bcf1a292
USER root

ARG netpyneuiBranch=development
ENV netpyneuiBranch=${netpyneuiBranch}
RUN echo "$netpyneuiBranch";

RUN apt-get -qq update

ARG NRN_VERSION="7.4"
ARG NRN_ARCH="x86_64"

RUN apt-get -qq install -y \
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
        libpng-dev
USER $NB_USER

RUN conda create --name snakes python=2
RUN wget http://www.neuron.yale.edu/ftp/neuron/versions/v7.4/nrn-7.4.tar.gz
RUN tar xzf nrn-7.4.tar.gz
WORKDIR nrn-7.4
RUN /bin/bash -c "source activate snakes && ./configure --prefix `pwd` --without-iv --with-nrnpython"
RUN /bin/bash -c "source activate snakes && make --silent"
RUN /bin/bash -c "source activate snakes && make --silent install"
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn-7.4/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"
RUN wget https://github.com/MetaCell/NetPyNE-UI/archive/$netpyneuiBranch.zip
RUN unzip $netpyneuiBranch.zip
WORKDIR NetPyNE-UI-$netpyneuiBranch/utilities
RUN /bin/bash -c "source activate snakes && python --version"
RUN /bin/bash -c "source activate snakes && exec python install.py"
RUN cd ../netpyne_ui/tests && /bin/bash -c "source activate snakes && python -m unittest netpyne_model_interpreter_test"
RUN mkdir /home/jovyan/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --ip=0.0.0.0 --allow_root=true --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"
CMD /bin/bash -c "source activate snakes && exec jupyter kernelspec list"
