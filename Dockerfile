FROM jupyter/base-notebook:eb70bcf1a292
USER root

ARG netpyneuiBranch=development
ENV netpyneuiBranch=${netpyneuiBranch}
RUN echo "$netpyneuiBranch";
RUN python --version

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
        python2.7 \
        libpython-dev \
        cython \
        git-core \
        unzip \
        libpng-dev
USER $NB_USER
RUN conda install -c conda-forge notebook=4.4.1
RUN conda install -c conda-forge ipython=5.6.0
RUN conda install -c conda-forge jsonschema=2.6.0
RUN conda install -c conda-forge ipykernel=4.8.1
RUN conda install -c conda-forge jupyter_core=4.4.0
RUN conda install -c conda-forge jupyter_client=4.4.0
RUN conda create --name snakes python=2
RUN python --version && conda info
RUN conda info --envs
RUN pip list && conda list
RUN /bin/bash -c "source activate snakes && python --version"
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
RUN python --version
RUN pip list
RUN conda list
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --port=8889 --no-browser --ip 0.0.0.0  --debug --NotebookApp.default_url=/geppetto --NotebookApp.token='' && exec jupyter trust notebook.ipynb"
